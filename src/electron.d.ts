// Type definitions for Electron API
interface Window {
  electron: {
    printDocument: (documentData: any) => Promise<{success: boolean}>;
    getPrinterConfig: () => Promise<any>;
    updatePrinterConfig: (config: any) => Promise<{success: boolean}>;
  }
}
