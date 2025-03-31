import React, { useEffect, useState } from 'react';
import { checkForUpdates, downloadAndInstallUpdate } from '../services/updateService';
import { electronService, getPlatform } from '../services/electronService';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface UpdateInfo {
  hasUpdate: boolean;
  version?: string;
  downloadUrl?: string;
  releaseNotes?: string;
  error?: string;
}

const UpdateNotification: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  
  useEffect(() => {
    // Получаем текущую версию приложения
    if (electronService.electronAPI?.getAppVersion) {
      electronService.electronAPI.getAppVersion()
        .then(version => setCurrentVersion(version))
        .catch(err => console.error('Failed to get app version:', err));
    }
    
    // Проверяем обновления при монтировании компонента
    handleCheckForUpdates();
    
    // Настраиваем обработчики событий для Electron
    if (electronService.electronAPI) {
      const api = electronService.electronAPI;
      
      // Очистка предыдущих подписок (если компонент перемонтируется)
      const unsubscribeChecking = api.onUpdateChecking?.(() => {
        setIsChecking(true);
      });
      
      const unsubscribeAvailable = api.onUpdateAvailable?.((info) => {
        setUpdateInfo({
          hasUpdate: true,
          version: info.version,
          releaseNotes: info.releaseNotes
        });
        setIsChecking(false);
        toast.info(`Доступно обновление до версии ${info.version}`);
      });
      
      const unsubscribeNotAvailable = api.onUpdateNotAvailable?.(() => {
        setUpdateInfo(null);
        setIsChecking(false);
        toast.success('У вас установлена последняя версия');
      });
      
      const unsubscribeError = api.onUpdateError?.((error) => {
        console.error('Update error:', error);
        setIsChecking(false);
        setIsDownloading(false);
        toast.error(`Ошибка обновления: ${error}`);
      });
      
      const unsubscribeProgress = api.onDownloadProgress?.((progress) => {
        setDownloadProgress(progress.percent);
      });
      
      const unsubscribeDownloaded = api.onUpdateDownloaded?.((info) => {
        setIsDownloading(false);
        setDownloadProgress(100);
        toast.success('Обновление загружено и готово к установке');
      });
      
      // Очистка обработчиков при размонтировании
      return () => {
        unsubscribeChecking?.();
        unsubscribeAvailable?.();
        unsubscribeNotAvailable?.();
        unsubscribeError?.();
        unsubscribeProgress?.();
        unsubscribeDownloaded?.();
      };
    }
  }, []);
  
  const handleCheckForUpdates = async () => {
    setIsChecking(true);
    
    try {
      const platform = getPlatform();
      console.log('Platform in UpdateNotification:', platform);
      
      if (platform === 'electron' && electronService.electronAPI) {
        console.log('Checking for updates via Electron API');
        await electronService.electronAPI.checkForUpdates();
        // Результат будет получен через события
      } else {
        // Для Android и Web используем наш сервис
        console.log('Checking for updates via updateService');
        const info = await checkForUpdates();
        setUpdateInfo(info);
        setIsChecking(false);
        
        if (info.hasUpdate) {
          toast.info(`Доступно обновление до версии ${info.version}`);
        } else if (!info.error) {
          toast.success('У вас установлена последняя версия');
        } else {
          toast.error(`Ошибка проверки обновлений: ${info.error}`);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      toast.error(`Ошибка: ${error.message}`);
      setIsChecking(false);
    }
  };
  
  const handleInstallUpdate = async () => {
    if (!updateInfo?.hasUpdate) return;
    
    setIsDownloading(true);
    
    try {
      if (getPlatform() === 'electron' && electronService.electronAPI) {
        // Для Electron
        if (downloadProgress === 100) {
          // Если обновление уже загружено
          await electronService.electronAPI.installUpdate();
        } else {
          // Если нужно загрузить
          await electronService.electronAPI.downloadUpdate();
        }
      } else {
        // Для Android
        const success = await downloadAndInstallUpdate(updateInfo);
        if (!success) {
          throw new Error('Не удалось установить обновление');
        }
      }
    } catch (error) {
      console.error('Error installing update:', error);
      toast.error(`Ошибка установки: ${error.message}`);
      setIsDownloading(false);
    }
  };
  
  // Если нет обновлений или проверка еще идет, не показываем ничего
  if (!updateInfo?.hasUpdate && !isChecking) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-md mx-auto mb-4">
      <CardHeader>
        <CardTitle>Обновление приложения</CardTitle>
        {updateInfo?.hasUpdate && (
          <CardDescription>
            {currentVersion && `Текущая версия: ${currentVersion}`}
            {updateInfo.version && ` → Доступна версия ${updateInfo.version}`}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        {isChecking ? (
          <div className="text-center py-2">
            <p>Проверка обновлений...</p>
          </div>
        ) : updateInfo?.hasUpdate ? (
          <>
            {updateInfo.releaseNotes && (
              <div className="mb-4 p-2 bg-secondary/20 rounded-md">
                <h4 className="font-medium mb-1">Что нового:</h4>
                <p className="text-sm whitespace-pre-line">{updateInfo.releaseNotes}</p>
              </div>
            )}
            
            {isDownloading && (
              <div className="mb-4">
                <p className="text-sm mb-1">Загрузка: {Math.round(downloadProgress)}%</p>
                <Progress value={downloadProgress} className="w-full" />
              </div>
            )}
          </>
        ) : (
          <p>У вас установлена последняя версия приложения.</p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleCheckForUpdates} 
          disabled={isChecking || isDownloading}
        >
          Проверить снова
        </Button>
        
        {updateInfo?.hasUpdate && (
          <Button 
            onClick={handleInstallUpdate} 
            disabled={isDownloading && downloadProgress < 100}
          >
            {isDownloading ? 
              (downloadProgress === 100 ? 'Установить' : 'Загрузка...') : 
              'Обновить'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UpdateNotification;
