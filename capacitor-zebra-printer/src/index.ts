import { registerPlugin } from '@capacitor/core';
import type { ZebraPrinterPlugin } from './definitions';

const ZebraPrinter = registerPlugin<ZebraPrinterPlugin>('ZebraPrinter');

export * from './definitions';
export { ZebraPrinter };
