const { contextBridge, ipcRenderer } = require('electron');

// Убедитесь, что все API, которые вы используете в приложении, экспортированы здесь
contextBridge.exposeInMainWorld(
  'electron', {
    printDocument: (documentData) => {
      console.log('preload: вызов printDocument с данными:', documentData);
      return ipcRenderer.invoke('print-document', documentData);
    },
    getPrinterConfig: () => {
      return ipcRenderer.invoke('get-printer-config');
    },
    updatePrinterConfig: (config) => {
      return ipcRenderer.invoke('update-printer-config', config);
    }
  }
);

console.log('Preload script loaded successfully');