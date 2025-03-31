import { WebPlugin } from '@capacitor/core';
import type { ZebraPrinterPlugin, PrintOptions, PrinterOptions, PrintResult, StatusResult } from './definitions';

export class ZebraPrinterWeb extends WebPlugin implements ZebraPrinterPlugin {
  async print(options: PrintOptions): Promise<PrintResult> {
    console.log('Веб-версия не поддерживает печать. Опции:', options);
    return {
      success: false,
      message: 'Печать в веб-версии не поддерживается'
    };
  }

  async calibrate(options: PrinterOptions): Promise<PrintResult> {
    console.log('Веб-версия не поддерживает калибровку. Опции:', options);
    return {
      success: false,
      message: 'Калибровка в веб-версии не поддерживается'
    };
  }

  async getPrinterStatus(options: PrinterOptions): Promise<StatusResult> {
    console.log('Веб-версия не поддерживает проверку статуса. Опции:', options);
    return {
      success: false,
      message: 'Проверка статуса в веб-версии не поддерживается'
    };
  }
}
