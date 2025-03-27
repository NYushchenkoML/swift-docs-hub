
/**
 * Service for interacting with Electron APIs
 */
export const electronService = {
  /**
   * Check if running in Electron
   */
  isElectron: () => {
    return window && 'electron' in window;
  },

  /**
   * Check if running in Capacitor (Android/iOS)
   */
  isCapacitor: () => {
    return window && 'Capacitor' in window;
  },

  /**
   * Get current platform
   */
  getPlatform: () => {
    if (electronService.isElectron()) return 'electron';
    if (electronService.isCapacitor()) return 'capacitor';
    return 'web';
  },

  /**
   * Send document to printer via TCP connection
   * @param documentData Document data to print
   * @returns Promise that resolves when printing is complete
   */
  printDocument: async (documentData: any): Promise<{success: boolean}> => {
    if (!electronService.isElectron()) {
      console.warn('Not running in Electron, printing functionality disabled');
      return { success: false };
    }
    
    try {
      const result = await window.electron.printDocument(documentData);
      return result;
    } catch (error) {
      console.error('Error printing document:', error);
      return { success: false };
    }
  }
};
