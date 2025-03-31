import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
// import { toast } from 'react-toastify';
import { toast } from 'sonner';
import { electronService, getPlatform } from './electronService';

interface UpdateInfo {
  hasUpdate: boolean;
  version?: string;
  downloadUrl?: string;
  releaseNotes?: string;
  error?: string;
}

// Функция для получения текущей версии приложения
async function getCurrentAppVersion() {
  const platform = getPlatform();
  console.log('Current platform:', platform);
  
  // Проверяем, запущены ли мы в Electron
  if (platform === 'electron' && electronService.electronAPI?.getAppVersion) {
    try {
      console.log('Getting version via Electron API');
      return await electronService.electronAPI.getAppVersion();
    } catch (error) {
      console.warn('Failed to get version via Electron API:', error);
    }
  }
  
  // Проверяем Capacitor
  if (platform === 'capacitor' && Capacitor.isPluginAvailable('App')) {
    try {
      console.log('Getting version via Capacitor API');
      const info = await App.getInfo();
      return info.version;
    } catch (error) {
      console.warn('Failed to get version via Capacitor:', error);
    }
  }
  
  // Запасной вариант - возвращаем версию из package.json или константу
  console.log('Using fallback version');
  return '1.0.0'; // Замените на актуальную версию
}

export const checkForUpdates = async (): Promise<UpdateInfo> => {
  try {
    console.log('Checking for updates...');
    const platform = getPlatform();
    console.log('Platform:', platform);
    
    // Получаем информацию о текущей версии
    const currentVersion = await getCurrentAppVersion();
    console.log('Current version:', currentVersion);
    
    // Для Electron используем встроенный механизм
    if (platform === 'electron' && electronService.electronAPI) {
      console.log('Using Electron update mechanism');
      try {
        await electronService.electronAPI.checkForUpdates();
        // Результат будет получен через события, поэтому возвращаем пустой объект
        return { hasUpdate: false };
      } catch (error) {
        console.error('Error checking for updates via Electron:', error);
        return { hasUpdate: false, error: error.message };
      }
    }
    
    // Для Capacitor и Web используем GitHub API
    console.log('Using GitHub API for updates');
    
    // Запрашиваем последний релиз с GitHub
    try {
      // Используем CapacitorHttp
      const response = await CapacitorHttp.get({
        url: 'https://api.github.com/repos/NYushchenkoML/swift-docs-hub/releases/latest',
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.data) {
        return { hasUpdate: false, error: 'Не удалось получить информацию о релизах' };
      }
      
      // CapacitorHttp уже возвращает объект, а не строку
      const release = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const latestVersion = release.tag_name.replace('v', '');
      console.log('Latest version:', latestVersion);
      
      // Сравниваем версии
      if (compareVersions(currentVersion, latestVersion) < 0) {
        console.log('Update available');
        // Находим нужный файл для текущей платформы
        let asset;
        
        if (platform === 'capacitor') {
          asset = release.assets.find((a: any) => a.name.endsWith('.apk'));
        } else if (platform === 'electron') {
          // Для Windows ищем .exe, для macOS - .dmg
          const ext = process.platform === 'win32' ? '.exe' : '.dmg';
          asset = release.assets.find((a: any) => a.name.endsWith(ext));
        }
        
        if (!asset) {
          return { 
            hasUpdate: true, 
            version: latestVersion,
            error: 'Файл установки не найден для вашей платформы' 
          };
        }
        
        return {
          hasUpdate: true,
          version: latestVersion,
          downloadUrl: asset.browser_download_url,
          releaseNotes: release.body
        };
      }
      
      console.log('No updates available');
      return { hasUpdate: false };
    } catch (error) {
      console.error('Error checking GitHub releases:', error);
      return { hasUpdate: false, error: error.message };
    }
  } catch (error) {
    console.error('Error in checkForUpdates:', error);
    return { hasUpdate: false, error: error.message };
  }
};

export const downloadAndInstallUpdate = async (updateInfo: UpdateInfo): Promise<boolean> => {
  if (!updateInfo.hasUpdate || !updateInfo.downloadUrl) {
    console.log('No update to install');
    return false;
  }
  
  const platform = getPlatform();
  console.log('Installing update on platform:', platform);
  
  try {
    if (platform === 'electron') {
      // Для Electron используем встроенный механизм
      if (electronService.electronAPI) {
        console.log('Using Electron update mechanism for installation');
        await electronService.electronAPI.downloadUpdate();
        return true;
      }
      console.log('Electron API not available');
      return false;
    } else if (platform === 'capacitor') {
      // Для Android скачиваем и устанавливаем APK
      console.log('Installing update on Android');
      toast.info('Загрузка обновления...');
      
      // Скачиваем файл
      const fileName = `swift-docs-hub-${updateInfo.version}.apk`;
      console.log('Downloading file:', fileName);
      
      // Используем CapacitorHttp для скачивания
      const downloadResult = await Filesystem.downloadFile({
        url: updateInfo.downloadUrl,
        path: fileName,
        directory: Directory.Cache
      });
      
      if (!downloadResult.path) {
        throw new Error('Не удалось загрузить файл обновления');
      }
      
      console.log('Download complete, installing APK');
      toast.success('Обновление загружено. Установка...');
      
      // Используем Browser.open для открытия файла
      await Browser.open({ url: downloadResult.path });
      return true;
    } else {
      console.log('Updates not supported on this platform');
      toast.warning('Обновление не поддерживается в веб-версии');
      return false;
    }
  } catch (error) {
    console.error('Error installing update:', error);
    toast.error(`Ошибка обновления: ${error.message}`);
    return false;
  }
};

// Вспомогательная функция для сравнения версий
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = i < parts1.length ? parts1[i] : 0;
    const part2 = i < parts2.length ? parts2[i] : 0;
    
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  
  return 0;
}
