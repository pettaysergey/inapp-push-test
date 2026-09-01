/// <reference lib="webworker" />
import { MessageEvent, SelfSW, UnpPush, UnpPushData } from './types';
import { saveValue } from './web-push/indexedDBHelper';
import { webPushService } from './web-push/webPushService';

declare var self: SelfSW;

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  event.stopImmediatePropagation();
  event.waitUntil(
    (async () => {
      try {
        const dataPush = event.data?.json() as UnpPush;
        if (!dataPush) return;

        const title = dataPush.data.title || '';
        const message = dataPush.data.body || '';

        await self.registration.showNotification(title, {
          body: message,
          data: dataPush.data,
        });
        webPushService.sendPushStatus({ data: { pushId: '1', deviceId: '2' } } as UnpPush, 'push.if.test.vtb.ru');
      } catch (error) {
        webPushService.port.postMessage({ type: 'SW::ErrorParsingData' });
      }
    })(),
  );
});

self.addEventListener('notificationclick', (e) => {
  console.log('SW notificationclick', e);
  e.notification.close();

  const { data }: { data: UnpPushData } = e.notification;

  console.log('data: ', data);

  if (!data) return;

  e.waitUntil(
    webPushService.getTarget(data).then((deeplink) =>
      saveValue('deeplink-store', deeplink).then(async () => {
        return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            const isSameHost = new URL(client.url).host === new URL(deeplink).host;
            // если хост совпадает
            if (isSameHost && client.focused) {
              const target = `${new URL(client.url).origin}/connect-simple-push/deeplink-runner?redirect=deeplink-runner&deviceId=${data.deviceId}`;
              console.log('1 target: ', target);
              client.navigate(target);
              webPushService.port.postMessage({
                type: 'SW:Redirect',
                payload: `/deeplink-runner?deviceId=${data.deviceId}`,
              });
              return;
            }
          }

          const target = `${new URL(deeplink).origin}/connect-simple-push?redirect=deeplink-runner&deviceId=${data.deviceId}`;
          console.log('2 target', target);
          // TODO-Pettay в этом случае открыть simple-pwa (адрес уточнить у Дани)
          return self.clients.openWindow(target);
        });
      }),
    ),
  );
});

self.addEventListener('message', (event: MessageEvent) => {
  console.log('event: ', event.data.type);
  // TODO-Pettay удалить после теста
  if (event.data.type === 'SW::SendTestPush') {
    self.registration.showNotification('Тестовый пуш', {
      body: 'Привет из тестового пуша',
      data: {
        deviceId: '123',
        link: 'https://sturdy-basket.surge.sh/connect-simple-push/',
      },
    });
  }

  if (event.data.type === 'SW::SendUnpEvent') {
    if (!self.firebase) {
      return;
    }

    const firebaseApp = !self.firebase.apps.length ? self.firebase.initializeApp(event.data.payload) : undefined;
    const messaging = self.firebase.messaging(firebaseApp);

    console.log('SW messaging: ', messaging);

    return event.waitUntil(
      messaging
        .getToken({ vapidKey: event.data.payload.vapidKey })
        .then((currentToken: string) =>
          webPushService.port.postMessage({ type: 'SW::SendTokenFB', payload: currentToken }),
        )
        .catch(() => webPushService.port.postMessage({ type: 'SW::ErrorSendTokenFB' })),
    );
  }

  if (event.data.type === 'SW::SendRemovingTokenFB') {
    if (!self.firebase || !self.firebase.apps.length) {
      return;
    }

    const messaging = self.firebase.messaging();

    const currentToken = event.data.payload;
    event.waitUntil(messaging.deleteToken(currentToken));
  }
});

importScripts('/connect-simple-push/firebase-web-push/firebase-app.js');
importScripts('/connect-simple-push/firebase-web-push/firebase-messaging.js');
