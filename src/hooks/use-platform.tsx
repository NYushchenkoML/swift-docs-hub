
import { useContext } from 'react';
import { PlatformContext } from '../App';

/**
 * Hook to access platform information throughout the app
 * @returns Platform information (electron, capacitor, or web)
 */
export const usePlatform = () => {
  return useContext(PlatformContext);
};
