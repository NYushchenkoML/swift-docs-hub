import { registerPlugin } from '@capacitor/core';

export interface ZebraPrinterPlugin {
  print(options: { ip: string; port: number; zpl: string; timeout: number }): Promise<{ success: boolean; message?: string }>;
  calibrate(options: { ip: string; port: number; timeout: number }): Promise<{ success: boolean; message?: string }>;
  getPrinterStatus(options: { ip: string; port: number; timeout: number }): Promise<{ success: boolean; message?: string; isReadyToPrint?: boolean }>;
}

const ZebraPrinter = registerPlugin<ZebraPrinterPlugin>('ZebraPrinter');

export { ZebraPrinter };