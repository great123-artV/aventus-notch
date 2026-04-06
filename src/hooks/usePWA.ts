import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // Force isInstallable to true for testing if we are in a dev/test environment
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // For manual testing/verification in environments where beforeinstallprompt doesn't fire
    if (window.location.search.includes('force-pwa')) {
      setIsInstallable(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (window.location.search.includes('force-pwa') && !deferredPrompt) {
        alert('Simulated Install Prompt');
        return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installApp };
};
