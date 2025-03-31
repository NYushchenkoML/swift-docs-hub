console.log('Preload script loading...');

const { contextBridge, ipcRenderer } = require('electron');

// Экспортируем API для использования в рендерер-процессе
contextBridge.exposeInMainWorld('electron', {
  // Существующие методы
  printDocument: (data) => ipcRenderer.invoke('print-document', data),
  getPrinterConfig: () => ipcRenderer.invoke('get-printer-config'),
  updatePrinterConfig: (config) => ipcRenderer.invoke('update-printer-config', config),
  
  // Добавляем метод для выхода из приложения
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // Методы для обновлений
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // События обновления
  onUpdateChecking: (callback) => {
    const subscription = (_event) => callback();
    ipcRenderer.on('update-checking', subscription);
    return () => ipcRenderer.removeListener('update-checking', subscription);
  },
  
  onUpdateAvailable: (callback) => {
    const subscription = (_event, info) => callback(info);
    ipcRenderer.on('update-available', subscription);
    return () => ipcRenderer.removeListener('update-available', subscription);
  },
  
  onUpdateNotAvailable: (callback) => {
    const subscription = (_event) => callback();
    ipcRenderer.on('update-not-available', subscription);
    return () => ipcRenderer.removeListener('update-not-available', subscription);
  },
  
  onUpdateError: (callback) => {
    const subscription = (_event, error) => callback(error);
    ipcRenderer.on('update-error', subscription);
    return () => ipcRenderer.removeListener('update-error', subscription);
  },
  
  onDownloadProgress: (callback) => {
    const subscription = (_event, progress) => callback(progress);
    ipcRenderer.on('download-progress', subscription);
    return () => ipcRenderer.removeListener('download-progress', subscription);
  },
  
  onUpdateDownloaded: (callback) => {
    const subscription = (_event, info) => callback(info);
    ipcRenderer.on('update-downloaded', subscription);
    return () => ipcRenderer.removeListener('update-downloaded', subscription);
  }
});

console.log('Preload script loaded, exposed methods:', Object.keys(window.electron));