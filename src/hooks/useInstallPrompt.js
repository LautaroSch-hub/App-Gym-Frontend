import { useCallback, useEffect, useState } from 'react';

/** Maneja la instalación de la app (PWA) en el celular o la computadora. */
export function useInstallPrompt() {
  const [evento, setEvento] = useState(null);
  const [instalada, setInstalada] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
  );

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault(); // guardamos el evento para ofrecer un botón propio
      setEvento(e);
    };
    const onInstalled = () => {
      setInstalada(true);
      setEvento(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const instalar = useCallback(async () => {
    if (!evento) return;
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  }, [evento]);

  // iPhone y iPad no tienen botón de instalación: hay que hacerlo desde el menú de Safari.
  const esIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return { puedeInstalar: !!evento, instalar, instalada, esIOS };
}
