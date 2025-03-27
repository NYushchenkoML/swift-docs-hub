import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initialize, enable } from '@electron/remote/main/index.js';
import net from 'net';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

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
      preload: path.join(__dirname, 'preload-commonjs.js')
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
  
  // Открываем DevTools для отладки
  mainWindow.webContents.openDevTools();
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

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

ipcMain.on('print-document', (event, documentData) => {
  console.log('Print request received:', documentData);
  console.log('App path:', app.getAppPath());
  console.log('__dirname:', __dirname);
  console.log('Preload path:', path.join(__dirname, 'preload-commonjs.js'));
  console.log('Preload exists:', fs.existsSync(path.join(__dirname, 'preload-commonjs.js')));
  
  const client = new net.Socket();
  let responseData = {
    success: false,
    message: ''
  };
  
  client.setTimeout(printerConfig.timeout);
  
  client.on('timeout', () => {
    responseData.message = 'Connection timeout';
    client.end();
  });
  
  client.on('error', (err) => {
    responseData.message = `Connection error: ${err.message}`;
    event.reply('print-response', responseData);
  });
  
  client.on('close', () => {
    if (!responseData.message) {
      responseData.message = responseData.success ? 
        'Document sent to printer successfully' : 
        'Connection closed without sending data';
    }
    event.reply('print-response', responseData);
  });
  
  client.connect(printerConfig.port, printerConfig.host, () => {
    console.log('Connected to printer');
    try {
      client.write(documentData.data || documentData);
      responseData.success = true;
      client.end();
    } catch (err) {
      responseData.message = `Failed to send data: ${err.message}`;
      client.end();
    }
  });
});