import { POST_MESSAGE_TYPE_UNP } from '@src/App/constants';

export const getHcmsUrl = () => {
  return window._VTB?.cmsUrl || 'https://h.if.vtb.ru';
};

export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
};

/**
 * возвращает куки с указанным name, или undefined, если ничего не найдено
 *
 * @param {string} name
 * @returns {*}
 */
export const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const initFireBaseForPushUnp = () => {
  if (!window._VTB?.webPushUnp) {
    return;
  }

  const {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    vapidKey,
  } = window._VTB.webPushUnp;

  const config = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    vapidKey,
  };

  // Шаг 2: Отправка post-message в сервис-воркер
  // Далее в сервис-воркере получаем актуальный токен и отдаем на "Шаг 3" в useInitUnpPush
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({
      type: POST_MESSAGE_TYPE_UNP,
      payload: config,
    });
  });
};
