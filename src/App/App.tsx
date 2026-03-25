import React, { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter } from 'react-router-dom';

import { isPWA } from './common/helpers';
import { ErrorPage } from './components/ErrorPage';
import { MainPage } from './components/MainPage';
import { PwaPages } from './components/PwaPages';

const queryClient = new QueryClient();

// const loadConfig = async () =>
//   new Promise(() => {
//     const script = document.createElement('script');
//     script.src = `${window.location.origin}/config.js`;

//     script.onload = () => {
//       console.log('Конфиг успешно загружен');
//     };

//     document.head.appendChild(script);
//   });

export const App = () => {
  console.log('isPWA(): ', isPWA());
  // useEffect(() => {
  //   loadConfig();
  // }, []);

  return (
    <div>
      <h1>Hello from react</h1>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>{isPWA() ? <PwaPages /> : <MainPage />}</QueryClientProvider>
      </BrowserRouter>
    </div>
  );
};
