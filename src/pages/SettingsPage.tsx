import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { checkForUpdates } from '../services/updateService';
import { toast } from 'react-toastify';
import { Capacitor } from '@capacitor/core';
import { electronService } from '../services/electronService';

const SettingsPage: React.FC = () => {
  const [isChecking, setIsChecking] = React.useState(false);
  
  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    
    try {
      if (Capacitor.getPlatform() === 'electron' && electronService.electronAPI) {
        // Для Electron
        await electronService.electronAPI.checkForUpdates();
        toast.info('Проверка обновлений...');
      } else {
        // Для Android
        const updateInfo = await checkForUpdates();
        
        if (updateInfo.hasUpdate) {
          toast.info(`Доступно обновление до версии ${updateInfo.version}`);
        } else if (!updateInfo.error) {
          toast.success('У вас установлена последняя версия');
        } else {
          toast.error(`Ошибка проверки обновлений: ${updateInfo.error}`);
        }
      }
    } catch (error) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Настройки</h1>
      
      {/* Другие настройки */}
      
      {/* Секция обновлений */}
      <Card>
        <CardHeader>
          <CardTitle>Обновления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p>Проверить наличие обновлений</p>
            </div>
            <Button 
              onClick={handleCheckForUpdates} 
              disabled={isChecking}
            >
              {isChecking ? 'Проверка...' : 'Проверить'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
