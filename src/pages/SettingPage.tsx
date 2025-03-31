import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { electronService } from '@/services/electronService';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { ZebraPrinter } from '@/plugins/zebra-printer';




// // Определите интерфейс для вашего плагина
// interface ZebraPrinterPlugin {
//   calibrate(options: { ip: string; port: number; timeout: number }): Promise<{ success: boolean; message?: string }>;
//   print(options: { ip: string; port: number; zpl: string; timeout: number }): Promise<{ success: boolean; message?: string }>;
//   getPrinterStatus(options: { ip: string; port: number; timeout: number }): Promise<{ success: boolean; message?: string; isReadyToPrint?: boolean; isPaused?: boolean; isHeadOpen?: boolean; isPaperOut?: boolean; isRibbonOut?: boolean }>;
// }

// // Регистрируем плагин
// const ZebraPrinter = registerPlugin<ZebraPrinterPlugin>('ZebraPrinter');

const SettingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Добавляем состояния для настроек принтера
  const [host, setHost] = useState('192.168.88.110');
  const [port, setPort] = useState('9100');
  const [timeout, setTimeout] = useState('5000');
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Загружаем сохраненные настройки при монтировании компонента
  useEffect(() => {
    const savedConfig = localStorage.getItem('printerConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setHost(config.host || '192.168.88.110');
        setPort(config.port?.toString() || '9100');
        setTimeout(config.timeout?.toString() || '5000');
      } catch (error) {
        console.error('Ошибка при загрузке настроек принтера:', error);
      }
    }
  }, []);

  const handleBack = () => {
    navigate('/')
  };

  // Добавляем функцию сохранения настроек
  const handleSaveSettings = () => {
    try {
      const portNum = parseInt(port, 10);
      const timeoutNum = parseInt(timeout, 10);
      
      if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
        toast.error('Порт должен быть числом от 1 до 65535');
        return;
      }
      
      if (isNaN(timeoutNum) || timeoutNum <= 0) {
        toast.error('Таймаут должен быть положительным числом');
        return;
      }
      
      const config = { 
        host, 
        port: portNum, 
        timeout: timeoutNum
      };
      
      // Сохраняем настройки в localStorage
      localStorage.setItem('printerConfig', JSON.stringify(config));
      
      toast.success('Настройки принтера сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении настроек принтера:', error);
      toast.error('Ошибка при сохранении настроек');
    }
  };

  

  const handlePrinterCalibration = async () => {
    // Используем безопасный способ проверки доступных плагинов
    console.log('ZebraPrinter доступен:', Capacitor.isPluginAvailable('ZebraPrinter'));
    
    // Если вам нужно получить список всех плагинов, используйте приведение типов
    // @ts-ignore или as any для обхода проверки типов
    console.log('Доступные плагины:', Object.keys((Capacitor as any).Plugins || {}));
    
    const platform = electronService.getPlatform();
    console.log('Текущая платформа:', platform);
    
    // Явно проверяем, запущено ли приложение на Android
    const isAndroid = Capacitor.getPlatform() === 'android';
    console.log('Запущено на Android:', isAndroid);
    
    setIsCalibrating(true);
    
    try {
      if (platform === 'electron') {
        // Проверяем доступность electronAPI
        if (!electronService.electronAPI) {
          toast.error('Ошибка: Electron API недоступен');
          setIsCalibrating(false);
          return;
        }
      
        // Отправляем команду калибровки на принтер
        const result = await electronService.electronAPI.printDocument({
          data: "~JC",
          config: {
            host: host,
            port: parseInt(port, 10),
            timeout: parseInt(timeout, 10)
          }
        });
      
        if (result.success) {
          toast.success('Команда калибровки отправлена на принтер');
        } else {
          toast.error(`Ошибка калибровки: ${result?.message || 'Неизвестная ошибка'}`);
        }
      } 
      else if (platform === 'capacitor' || isAndroid) {
        console.log('Выполняем калибровку через Capacitor/Android');
        
        if (!Capacitor.isPluginAvailable('ZebraPrinter')) {
          toast.error('Плагин ZebraPrinter недоступен');
          setIsCalibrating(false);
          return;
        }
        
        // Отправляем команду калибровки
        const result = await ZebraPrinter.calibrate({
          ip: host,
          port: parseInt(port, 10),
          timeout: parseInt(timeout, 10)
        });
        
        if (result.success) {
          toast.success('Команда калибровки отправлена на принтер');
        } else {
          toast.error(`Ошибка калибровки: ${result.message || 'Неизвестная ошибка'}`);
        }
      }
      else {
        toast.info('Калибровка принтера доступна только в нативных приложениях');
      }
    } catch (error) {
      console.error('Ошибка при калибровке принтера:', error);
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsCalibrating(false);
    }
  };

  // Обновляем UI, добавляя поля ввода для настроек принтера
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 border-b">
        <h1 className="text-2xl font-medium text-center">Настройки</h1>
      </header>
      
      <div className="p-4 flex-1">
        <div className="space-y-4">
          <div className="bg-muted/20 p-4 rounded-md">
            <h2 className="text-lg font-medium mb-2">Настройки принтера</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Управление настройками принтера этикеток GoDEX DT2x
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="host">IP-адрес принтера</Label>
                <Input 
                  id="host" 
                  value={host} 
                  onChange={(e) => setHost(e.target.value)} 
                  placeholder="192.168.88.110" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Порт</Label>
                  <Input 
                    id="port" 
                    value={port} 
                    onChange={(e) => setPort(e.target.value)} 
                    placeholder="9100" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout">Таймаут (мс)</Label>
                  <Input 
                    id="timeout" 
                    value={timeout} 
                    onChange={(e) => setTimeout(e.target.value)} 
                    placeholder="5000" 
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleSaveSettings}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить настройки
                </Button>
                
                <Button 
                  onClick={handlePrinterCalibration}
                  className="flex-1"
                  disabled={isCalibrating}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {isCalibrating ? 'Калибровка...' : 'Калибровка принтера'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
