import { electronService } from './electronService';
import { toast } from 'sonner';
import { ZebraPrinter } from '../plugins/zebra-printer';

// Получение конфигурации принтера из localStorage
export const getPrinterConfig = () => {
  const defaultConfig = {
    host: '192.168.88.110',
    port: 9100,
    timeout: 5000
  };

  try {
    const savedConfig = localStorage.getItem('printerConfig');
    if (savedConfig) {
      return { ...defaultConfig, ...JSON.parse(savedConfig) };
    }
  } catch (error) {
    console.error('Ошибка при загрузке конфигурации принтера:', error);
  }

  return defaultConfig;
};

// Функция для печати ZPL
export const printZPL = async (zplData: string): Promise<boolean> => {
  const platform = electronService.getPlatform();
  const config = getPrinterConfig();

  try {
    if (platform === 'electron') {
      // Печать через Electron
      if (!electronService.electronAPI) {
        toast.error('Ошибка: Electron API недоступен');
        return false;
      }

      const result = await electronService.electronAPI.printDocument({
        data: zplData,
        config
      });

      if (!result.success) {
        toast.error(`Ошибка печати: ${result.message}`);
        return false;
      }

      toast.success('Документ успешно отправлен на печать');
      return true;
    } 
    else if (platform === 'capacitor') {
      // Печать через Capacitor плагин
      const result = await ZebraPrinter.print({
        ip: config.host,
        port: config.port,
        zpl: zplData,
        timeout: config.timeout
      });

      if (!result.success) {
        toast.error(`Ошибка печати: ${result.message}`);
        return false;
      }

      toast.success('Документ успешно отправлен на печать');
      return true;
    } 
    else {
      // Для веб-версии
      toast.info('Печать в веб-версии не поддерживается');
      return true;
    }
  } catch (error) {
    console.error('Ошибка при отправке на принтер:', error);
    toast.error(`Ошибка печати: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    return false;
  }
};

// Функция для калибровки принтера
export const calibratePrinter = async (): Promise<boolean> => {
  const platform = electronService.getPlatform();
  const config = getPrinterConfig();

  try {
    if (platform === 'electron') {
      // Калибровка через Electron
      if (!electronService.electronAPI) {
        toast.error('Ошибка: Electron API недоступен');
        return false;
      }

      const result = await electronService.electronAPI.printDocument({
        data: "~JC",
        config
      });

      if (!result.success) {
        toast.error(`Ошибка калибровки: ${result.message}`);
        return false;
      }

      toast.success('Команда калибровки отправлена на принтер');
      return true;
    } 
    else if (platform === 'capacitor') {
      // Калибровка через Capacitor плагин
      const result = await ZebraPrinter.calibrate({
        ip: config.host,
        port: config.port,
        timeout: config.timeout
      });

      if (!result.success) {
        toast.error(`Ошибка калибровки: ${result.message}`);
        return false;
      }

      toast.success('Команда калибровки отправлена на принтер');
      return true;
    } 
    else {
      toast.info('Калибровка принтера в веб-версии не поддерживается');
      return false;
    }
  } catch (error) {
    console.error('Ошибка при калибровке принтера:', error);
    toast.error(`Ошибка калибровки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    return false;
  }
};
