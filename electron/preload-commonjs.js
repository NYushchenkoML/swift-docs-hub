const { contextBridge, ipcRenderer } = require('electron');

// Убедитесь, что все API, которые вы используете в приложении, экспортированы здесь
contextBridge.exposeInMainWorld(
  'electron', {
    printDocument: (documentData) => {
      return new Promise((resolve) => {
        ipcRenderer.send('print-document', documentData);
        ipcRenderer.once('print-response', (_, response) => {
          resolve(response);
        });
      });
    },
    getPrinterConfig: () => {
      return new Promise((resolve) => {
        ipcRenderer.send('get-printer-config');
        ipcRenderer.once('printer-config', (_, config) => {
          resolve(config);
        });
      });
    },
    updatePrinterConfig: (config) => {
      return new Promise((resolve) => {
        ipcRenderer.send('update-printer-config', config);
        ipcRenderer.once('printer-config-updated', (_, response) => {
          resolve(response);
        });
      });
    }
  }
);