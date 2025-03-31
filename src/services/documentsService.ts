  import { SelectedItem } from './itemsService';
  import { electronService } from './electronService';
  import { toast } from 'sonner';
  import { ZebraPrinter } from '../plugins/zebra-printer';


  export interface Document {
    id: string;
    type: string;
    items: SelectedItem[];
    createdAt: Date;
    sent?: boolean;
  }

  // Функция для получения конфигурации принтера
  const getPrinterConfig = () => {
    // Значения по умолчанию
    const defaultConfig = {
      host: '192.168.88.110',
      port: 9100,
      timeout: 5000
    };

    // Пытаемся загрузить настройки из localStorage
    try {
      const savedConfig = localStorage.getItem('printerConfig');
      if (savedConfig) {
        return { ...defaultConfig, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек принтера:', error);
    }

    return defaultConfig;
  };

  export const getUnsentDocuments = (): Document[] => {
    try {
      // Получаем все документы
      const allDocuments = getDocuments();
    
      // Фильтруем только неотправленные документы
      return allDocuments.filter(doc => !doc.sent);
    } catch (error) {
      console.error('Ошибка при получении неотправленных документов:', error);
      return [];
    }
  };

  export const getDocuments = (): Document[] => {
    try {
      // Получаем документы из локального хранилища
      const documentsJson = localStorage.getItem('documents');
      if (!documentsJson) {
        return [];
      }
    
      // Парсим JSON и преобразуем строковые даты в объекты Date
      const documents: Document[] = JSON.parse(documentsJson);
    
      // Преобразуем строковые даты в объекты Date
      return documents.map(doc => ({
        ...doc,
        createdAt: new Date(doc.createdAt)
      }));
    } catch (error) {
      console.error('Ошибка при получении документов:', error);
      return [];
    }
  };

  export const getDocumentById = (id: string): Document | null => {
    try {
      // Получаем все документы
      const documents = getDocuments();
    
      // Находим документ с указанным id
      const document = documents.find(doc => doc.id === id);
    
      return document || null;
    } catch (error) {
      console.error(`Ошибка при получении документа с id ${id}:`, error);
      return null;
    }
  };

  export const saveDocument = (items: SelectedItem[]): Document => {
    const doc: Document = {
      id: Date.now().toString(),
      type: 'production-act',
      items,
      createdAt: new Date()
    };

    // Сохраняем документ в локальное хранилище
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    documents.push(doc);
    localStorage.setItem('documents', JSON.stringify(documents));

    return doc;
  };

  export const sendToPrinter = async (document: Document): Promise<boolean> => {
    // Форматируем данные для печати в формате ZPL
    const zplData = formatDocumentToZPL(document);

    // Получаем конфигурацию принтера
    const printerConfig = getPrinterConfig();

    // Определяем платформу и используем соответствующий метод печати
    const platform = electronService.getPlatform();

    try {
      if (platform === 'electron') {
        console.log('Отправка на печать через Electron...');
  
        // Проверяем доступность electronAPI
        if (!electronService.electronAPI) {
          console.error('Electron API недоступен');
          toast.error('Ошибка печати: Electron API недоступен');
          return false;
        }
  
        // Отправляем на принтер через printDocument
        const result = await electronService.electronAPI.printDocument({
          data: zplData,
          config: printerConfig
        });
  
        console.log('Результат печати:', result);
  
        if (!result.success) {
          toast.error(`Ошибка печати: ${result?.message || 'Неизвестная ошибка'}`);
        } else {
          toast.success('Документ успешно отправлен на печать');
        }
  
        return result.success;
      } 
      else if (platform === 'capacitor') {
        // Используем заглушку для печати на Android
        return await printViaCapacitor(zplData);
      } 
      else {
        // Для веб-версии просто возвращаем true, т.к. печать не требуется
        console.log('Печать в веб-версии не поддерживается');
        toast.info('Печать в веб-версии не поддерживается');
        return true;
      }
    } catch (error) {
      console.error('Ошибка при отправке на принтер:', error);
      toast.error(`Не удалось отправить документ на печать: ${error.message}`);
      return false;
    }
  };

  const printViaCapacitor = async (zplData: string): Promise<boolean> => {
    try {
      const printerConfig = getPrinterConfig();
    
      // Отправляем данные на принтер через наш новый плагин
      const result = await ZebraPrinter.print({
        ip: printerConfig.host,
        port: printerConfig.port,
        zpl: zplData,
        timeout: printerConfig.timeout
      });
    
      if (!result.success) {
        console.error('Ошибка при печати:', result.message);
        toast.error(`Ошибка печати: ${result.message}`);
        return false;
      }
    
      toast.success('Документ успешно отправлен на печать');
      return true;
    } catch (error) {
      console.error('Ошибка при печати через Capacitor:', error);
      toast.error(`Ошибка печати: ${error.message}`);
      return false;
    }
  };

  // Заглушка для печати через Capacitor
  const printViaCapacitorFallback = async (zplData: string): Promise<boolean> => {
    try {
      console.log('Печать через Capacitor (заглушка):', zplData);
      
      // Сохраняем данные для печати локально
      const pendingPrints = JSON.parse(localStorage.getItem('pendingPrints') || '[]');
      pendingPrints.push({
        data: zplData,
        config: getPrinterConfig(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pendingPrints', JSON.stringify(pendingPrints));
      
      toast.info('Документ сохранен для последующей печати. Печать на мобильных устройствах в разработке.');
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении данных для печати:', error);
      toast.error('Не удалось сохранить документ для печати');
      return false;
    }
  };

  // Функция для форматирования документа в ZPL
  const formatDocumentToZPL = (document: Document): string => {
    // Начало ZPL документа
    let zpl = "^XA";

    // Настройка шрифта и позиции для заголовка
    zpl += "^CF0,60";
    zpl += "^FO50,50^FDАКТ ПРИГОТОВЛЕНИЯ^FS";

    // Дата и время
    const date = new Date(document.createdAt);
    const dateStr = `Дата: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    zpl += "^CF0,30";
    zpl += `^FO50,120^FD${dateStr}^FS`;

    // Разделительная линия
    zpl += "^FO50,150^GB700,1,3^FS";

    // Заголовки таблицы
    zpl += "^CF0,30";
    zpl += "^FO50,180^FDНАИМЕНОВАНИЕ^FS";
    zpl += "^FO550,180^FDКОЛ-ВО^FS";

    // Разделительная линия
    zpl += "^FO50,210^GB700,1,3^FS";

    // Список позиций
    let yPosition = 240;
    document.items.forEach((item, index) => {
      // Ограничиваем длину наименования
      const name = item.name.length > 40 ? item.name.substring(0, 37) + "..." : item.name;
  
      zpl += `^FO50,${yPosition}^FD${name}^FS`;
      zpl += `^FO550,${yPosition}^FD${item.quantity}^FS`;
  
      yPosition += 40;
  
      // Если список длинный, добавляем новую страницу
      if (index > 0 && index % 15 === 0 && index < document.items.length - 1) {
        zpl += "^XZ^XA"; // Конец текущей страницы и начало новой
        yPosition = 50;
      }
    });

    // Завершение ZPL документа
    zpl += "^XZ";

    return zpl;
  };

  // Функция для калибровки принтера
  export const calibratePrinter = async (): Promise<boolean> => {
    const platform = electronService.getPlatform();
    const printerConfig = getPrinterConfig();

    try {
      if (platform === 'electron') {
        // Проверяем доступность electronAPI
        if (!electronService.electronAPI) {
          toast.error('Ошибка: Electron API недоступен');
          return false;
        }
    
        // Используем printDocument для отправки команды калибровки
        const result = await electronService.electronAPI.printDocument({
          data: "~JC",
          config: printerConfig
        });
    
        console.log('Результат калибровки принтера:', result);
    
        if (result.success) {
          toast.success('Команда калибровки отправлена на принтер');
        } else {
          toast.error(`Ошибка калибровки: ${result?.message || 'Неизвестная ошибка'}`);
        }
    
        return result.success;
      } 
      else if (platform === 'capacitor') {
        // Используем наш новый метод calibrate для Android
        const result = await ZebraPrinter.calibrate({
          ip: printerConfig.host,
          port: printerConfig.port,
          timeout: printerConfig.timeout
        });
        
        console.log('Результат калибровки принтера:', result);
        
        if (result.success) {
          toast.success('Команда калибровки отправлена на принтер');
        } else {
          toast.error(`Ошибка калибровки: ${result.message || 'Неизвестная ошибка'}`);
        }
        
        return result.success;
      }
      else {
        toast.info('Калибровка принтера доступна только в Electron и на Android');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при калибровке принтера:', error);
      toast.error(`Ошибка: ${error.message}`);
      return false;
    }
  };