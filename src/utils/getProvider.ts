import { PhantomProvider } from '../lib/types';

/**
 * Retrieves the Phantom Provider from the window object
 * @returns {PhantomProvider | undefined} a Phantom provider if one exists in the window
 */
const getProvider = (): PhantomProvider | undefined => {
  if (typeof window === 'undefined') {
    console.error('getProvider can only be called in a browser environment');
    return undefined;
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if ('phantom' in window) {
    const anyWindow: any = window;
    const provider = anyWindow.phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  if (isMobile) {
    window.open('https://phantom.app/download-mobile', '_blank');
  } else {
    window.open('https://phantom.app/', '_blank');
  }
};

export default getProvider;