const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
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

// Add console logging to help debug
console.log('Preload script loaded successfully');