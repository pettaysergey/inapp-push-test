// =============== Механизм итерации диплинков ===============

import { deletePushDeviceApi } from '@src/App/requests';

import { clearPendingDeeplink } from './indexedDBHelper';

/**
* Попытка открыть одну глубокую ссылку через window.location.href.
* iOS Safari игнорирует пользовательские схемы в скрытых iframe —
* только прямое изменение местоположения запускает системное диалоговое окно.
*

* Возвращает промис, который разрешается в true, если приложение открылось,
* (сработали viibilitychange/pagehide), или в false после истечения таймаута.
*/
const tryDeeplink = async (url: string, timeout: number) => {
  return new Promise((resolve) => {
    let settled = false;

    function onLeave() {
      if (document.hidden || document.visibilityState === 'hidden') {
        settled = true;
        cleanup();
        resolve(true);
      }
    }

    function cleanup() {
      document.removeEventListener('visibilitychange', onLeave);
      window.removeEventListener('pagehide', onLeave);
    }

    document.addEventListener('visibilitychange', onLeave);
    window.addEventListener('pagehide', onLeave);

    // Прямое назначение местоположения — единственный способ запустить
    // Диалоговое окно Safari «Открыть в приложении?» для пользовательских схем
    window.location.href = url;

    setTimeout(() => {
      cleanup();
      if (!settled) resolve(false);
    }, timeout);
  });
};

export const getDeeplinksWithFullPath = (fullPath: string) => {
  const ulrParams = new URLSearchParams(new URL(fullPath).search);
  const apps = ulrParams.getAll('app');

  if (apps.length) {
    const link = `${new URL(fullPath).hostname}${new URL(fullPath).pathname}`;

    return apps.map((app) => `${app}://${link}`);
  }

  return [];
};

/**
 * Проход по массиву диплинков, первый успешный завершает перебор
 */
export const runDeeplinks = async (link: string, deviceId: string) => {
  const deeplinks = getDeeplinksWithFullPath(link);
  console.log('deeplinks: ', deeplinks);

  if (!deeplinks.length) return;

  const total = deeplinks.length;

  for (let i = 0; i < total; i++) {
    const url = deeplinks[i];
    const step = i + 1;

    const opened = await tryDeeplink(url, 600);

    if (opened) {
      console.log('[' + step + '] App opened!', 'ok');
      clearPendingDeeplink();
      return; // успех, завершаем перебор
    }

    console.log('[' + step + '] No response — skipping', 'fail');
  }

  // в случае неуспеха
  console.log('All deeplinks failed. Going to fallback.', 'fail');
  await deletePushDeviceApi({ deviceId });
  clearPendingDeeplink();
};
