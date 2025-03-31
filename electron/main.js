import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initialize, enable } from '@electron/remote/main/index.js';
import net from 'net';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import electronUpdater from 'electron-updater';
import electronLog from 'electron-log';

const { autoUpdater } = electronUpdater;
const log = electronLog;

// Настройка логирования
log.transports.file.level = 'debug';
autoUpdater.logger = log;

// Настройка autoUpdater
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = true;

// Для отладки
log.info('App version:', app.getVersion());
log.info('Platform:', process.platform);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Initialize remote module
initialize();

// Объявите mainWindow в глобальной области видимости
let mainWindow = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Enable remote module for the window
  enable(mainWindow.webContents);

  // Load the app
  const isDev = process.env.NODE_ENV === 'development';
  // Используем более надежный способ формирования пути
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:8080';
  } else {
    // Проверяем несколько возможных путей к HTML-файлу
    const possiblePaths = [
      path.join(app.getAppPath(), 'dist', 'index.html'),
      path.join(__dirname, '../dist/index.html'),
      path.join(process.resourcesPath, 'app.asar/dist/index.html')
    ];
    
    let foundPath = null;
    for (const p of possiblePaths) {
      console.log('Checking path:', p);
      if (fs.existsSync(p)) {
        foundPath = p;
        console.log('Found HTML file at:', p);
        break;
      }
    }
    
    if (foundPath) {
      startUrl = `file://${foundPath}`;
    } else {
      console.error('Could not find index.html in any of the expected locations');
      startUrl = `file://${possiblePaths[0]}`; // Используем первый путь как запасной вариант
    }
  }
    
  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);
  
  // Добавьте обработчики событий для отслеживания загрузки страницы
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
  
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });
  
  // Открываем DevTools для отладки в режиме разработки
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();
  
  // Проверяем обновления через 3 секунды после запуска
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// TCP Printer Connection
let printerConfig = {
  host: '127.0.0.1',
  port: 9100,
  timeout: 5000
};

ipcMain.on('update-printer-config', (event, config) => {
  printerConfig = { ...printerConfig, ...config };
  event.reply('printer-config-updated', { success: true });
});

ipcMain.on('get-printer-config', (event) => {
  event.reply('printer-config', printerConfig);
});
  ipcMain.handle('print-document', async (event, { data, config }) => {
    console.log('Получен запрос на печать через invoke:', { config });
  
    try {
      const client = new net.Socket();
      let connected = false;
    
      // Подключаемся к принтеру
      await new Promise((resolve, reject) => {
        client.setTimeout(config.timeout || 5000);
      
        client.on('connect', () => {
          console.log('Подключено к принтеру:', config.host);
          connected = true;
          resolve();
        });
      
        client.on('timeout', () => {
          console.error('Таймаут подключения к принтеру');
          client.destroy();
          reject(new Error('Таймаут подключения к принтеру'));
        });
      
        client.on('error', (err) => {
          console.error('Ошибка подключения к принтеру:', err.message);
          reject(err);
        });
      
        client.connect(config.port || 9100, config.host);
      });
    
      if (connected) {
        await new Promise((resolve) => {
          client.write(data, () => {
            setTimeout(() => {
              client.end(() => {
                resolve();
              });
            }, 1000);
          });
        });
      
        return { success: true };
      }
    
      return { success: false, message: 'Не удалось подключиться к принтеру' };
    } catch (error) {
      console.error('Ошибка при печати:', error);
      return { success: false, message: error.message };
    }
  });
  // Добавьте обработчик для тестирования соединения с принтером
  ipcMain.handle('test-printer-connection', async (event, config) => {
    console.log('Тестирование соединения с принтером:', config);
    
    try {
      const client = new net.Socket();
      
      // Подключаемся к принтеру
      await new Promise((resolve, reject) => {
        // Устанавливаем таймаут
        client.setTimeout(config.timeout || 5000);
        
        // Обработчики событий
        client.on('connect', () => {
          console.log('Тест: Подключено к принтеру:', config.host);
          client.destroy();
          resolve();
        });
        
        client.on('timeout', () => {
          console.error('Тест: Таймаут подключения к принтеру');
          client.destroy();
          reject(new Error('Таймаут подключения к принтеру'));
        });
        
        client.on('error', (err) => {
          console.error('Тест: Ошибка подключения к принтеру:', err.message);
          reject(err);
        });
        
        // Подключаемся
        client.connect(config.port || 9100, config.host);
      });
      
      return { success: true, message: 'Соединение с принтером установлено успешно' };
    } catch (error) {
      console.error('Тест: Ошибка при подключении к принтеру:', error);
      return { success: false, message: error.message };
    }
  });

// Обработчики событий обновления
autoUpdater.on('checking-for-update', () => {
  log.info('Проверка обновлений...');
  mainWindow.webContents.send('update-checking');
});

autoUpdater.on('update-available', (info) => {
  log.info('Доступно обновление:', info);
  mainWindow.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Обновлений нет:', info);
  mainWindow.webContents.send('update-not-available');
});

autoUpdater.on('error', (err) => {
  log.error('Ошибка при обновлении:', err);
  mainWindow.webContents.send('update-error', err.message);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Скорость загрузки: ${progressObj.bytesPerSecond}`;
  logMessage = `${logMessage} - Загружено ${progressObj.percent}%`;
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
  log.info(logMessage);
  mainWindow.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Обновление загружено:', info);
  mainWindow.webContents.send('update-downloaded', info);
});

// Обработчики IPC для обновлений
ipcMain.handle('check-for-updates', () => {
  log.info('Запрос на проверку обновлений от рендерера');
  return autoUpdater.checkForUpdates();
});

ipcMain.handle('download-update', () => {
  log.info('Запрос на загрузку обновления от рендерера');
  return autoUpdater.downloadUpdate();
});

ipcMain.handle('install-update', () => {
  log.info('Запрос на установку обновления от рендерера');
  return autoUpdater.quitAndInstall();
});

// Добавьте в main.js
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});