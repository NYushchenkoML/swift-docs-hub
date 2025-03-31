// Type definitions for Electron API
interface Window {
  electron?: {
    printDocument: (documentData: any) => Promise<{ success: boolean; message?: string }>;
    getPrinterConfig: () => Promise<any>;
    updatePrinterConfig: (config: any) => Promise<{ success: boolean }>;
    getAppVersion: () => Promise<string>;
    quitApp: () => Promise<void>;
    
    // Методы для обновлений
    checkForUpdates: () => Promise<void>;
    downloadUpdate: () => Promise<void>;
    installUpdate: () => Promise<void>;
    
    // События обновления
    onUpdateChecking: (callback: () => void) => () => void;
    onUpdateAvailable: (callback: (info: any) => void) => () => void;
    onUpdateNotAvailable: (callback: () => void) => () => void;
    onUpdateError: (callback: (error: string) => void) => () => void;
    onDownloadProgress: (callback: (progress: any) => void) => () => void;
    onUpdateDownloaded: (callback: (info: any) => void) => () => void;
  };
  process?: any;
  require?: any;
  Capacitor?: any;
}
