import { WebPlugin } from '@capacitor/core';
import type { ZebraPrinterPlugin } from './definitions';

export class ZebraPrinterWeb extends WebPlugin implements ZebraPrinterPlugin {
  async print(options: { 
    ip: string; 
    port?: number; 
    zpl: string;
    timeout?: number;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log('Web implementation not available', options);
    return {
      success: false,
      message: 'Printing is not supported in web environment'
    };
  }
  
  async calibrate(options: {
    ip: string;
    port?: number;
    timeout?: number;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log('Web implementation not available', options);
    return {
      success: false,
      message: 'Calibration is not supported in web environment'
    };
  }
}
