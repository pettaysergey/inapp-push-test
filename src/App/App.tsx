import { Button } from '@omega/ui-retail';
import React, { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { isPWA } from './common/helpers';
import { ErrorPage } from './components/ErrorPage';
import { MainPage } from './components/MainPage';
import { PwaPages } from './components/PwaPages';

const queryClient = new QueryClient();

const loadConfig = async () =>
  new Promise(() => {
    const script = document.createElement('script');
    script.src = `${window.location.origin}/config.js`;

    script.onload = () => {
      console.log('Конфиг успешно загружен');
    };

    document.head.appendChild(script);
  });

export const App = () => {
  useEffect(() => {
    loadConfig();
  }, []);

  const sendTestPush = () => {
    if (window?.Notification.permission === 'granted') {
      console.log('Отсылаем тестовый пуш');

      navigator.serviceWorker.getRegistration('/connect-simple-push/').then((reg) => {
        console.log('reg: ', reg);

        reg.active?.postMessage({
          type: 'SW::SendTestPush',
        });
      });
    }
  };

  if (window.innerWidth > 768) {
    // TODO-Pettay или перекидывать на https://online.if.test.vtb.ru/404
    return <ErrorPage />;
  }

  return (
    <BrowserRouter basename="/connect-simple-push">
      <Button onClick={sendTestPush} type="button">
        Кинуть тестовый пуш
      </Button>
      <QueryClientProvider client={queryClient}>{isPWA() ? <PwaPages /> : <MainPage />}</QueryClientProvider>
    </BrowserRouter>
  );
};
