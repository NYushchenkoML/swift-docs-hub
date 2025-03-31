/**
 * Service for interacting with Electron APIs
 */

import { Capacitor } from '@capacitor/core';

// Проверяем, запущены ли мы в Electron
export const isElectron = () => {
  return window.electron !== undefined;
};

// Проверяем, запущено ли приложение в Capacitor
export const isCapacitor = () => {
  try {
    return Capacitor.isNativePlatform();
  } catch (e) {
    return false;
  }
};

// Получаем платформу
export const getPlatform = () => {
  if (isElectron()) return 'electron';
  if (isCapacitor()) return 'capacitor';
  return 'web';
};

// Получаем Electron API
export const getElectronAPI = () => {
  if (isElectron()) {
    return window.electron;
  }
  return null;
};

// Экспортируем сервис
export const electronService = {
  isElectron: isElectron(),
  isCapacitor: isCapacitor(),
  getPlatform,
  electronAPI: getElectronAPI()
};

// Для отладки
console.log('Electron service initialized:', electronService);
console.log('Electron API available:', electronService.electronAPI);
if (electronService.electronAPI) {
  console.log('Available methods:', Object.keys(electronService.electronAPI));
}
