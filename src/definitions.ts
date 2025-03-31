export interface ZebraPrinterPlugin {
    print(options: PrintOptions): Promise<PrintResult>;
    calibrate(options: PrinterOptions): Promise<PrintResult>;
    getPrinterStatus(options: PrinterOptions): Promise<StatusResult>;
  }
  
  export interface PrintOptions {
    ip: string;
    port: number;
    zpl: string;
    timeout: number;
  }
  
  export interface PrinterOptions {
    ip: string;
    port: number;
    timeout: number;
  }
  
  export interface PrintResult {
    success: boolean;
    message?: string;
  }
  
  export interface StatusResult {
    success: boolean;
    message?: string;
    isReadyToPrint?: boolean;
    isPaused?: boolean;
    isHeadOpen?: boolean;
    isPaperOut?: boolean;
    isRibbonOut?: boolean;
  }
  