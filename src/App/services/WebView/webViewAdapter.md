# WebViewAdapter

Это сервис для работы с webView браузера Sapphire(переим. в Луну) и гибридными приложениями.

Поддерживаемые платформы (системы)

```typescript
const WEB_VIEW_PLATFORMS = {
  LUNA_IOS: 'LUNA_IOS',
  LUNA_ANDROID: 'LUNA_ANDROID',
  HYBRID_ANDROID: 'HYBRID_ANDROID',
  HYBRID_IOS: 'HYBRID_IOS',
  AURORA: 'AURORA',
} as const;
```

Если платформа не поддерживается, то сервис не будет с ней работать. Для поддержки новой платформы необходимо обратиться в команду Платформа.

## Методы

```typescript
class WebViewAdapter {
  /**
   * Метод для отправки сообщения от ИБ к WebView.
   * Перед отправкой переданные данные(data) будут преобразованы в JSON с помощью JSON.stringify.
   * @param {string} key - название хэндлера
   * @param data - данные для отправки.
   */
  send(key: string, data: any = {}): void {}

  /**
   * Метод подписки на события от WebView.
   * Событие должно иметь вид {type: string; data: T}. Параметр data можно типизировать через Generic.
   *
   * Подписка осуществляется по type. Можно передать строку для подписки на одно событие
   * или массив строк для подписки на несколько событий.
   * @param props
   * @property {object} props
   * @property {string | string[]} props.types - типы события или тип события
   * @property {WebViewPlatform | WebViewPlatform[] | undefined} props.platforms - параметр позволяющий задать платформу или набор платформ для которых будет осуществлена подписка. Если = undefined, то все платформы считаются разрешенными.
   * @property {boolean | undefined} props.isOnce - частота прослушивания события. Если передан callback, то можно указать прослушивается событие единожды при isOnce=true (default) или будет прослушиваться постоянно при isOnce=false. Если callback не передан, то будет возвращаться Promise, и isOnce будет автоматически = true.
   * @property {number | undefined} props.timeout - таймаут в мс, по истечению которого, если не будет получено событие, вернется ошибка. В случае подписки с callback возвращается ошибка new Error, в случае подписки без callback - Promise.reject.
   * @property {(data: T) => void} props.callback - callback функция, которая будет вызвана при получении события типа type.
   * @return {[(() => void), Promise<T> | undefined]} - возвращается кортеж из функции unsubscribe и Promise<T> (если не был передан callback) или undefined (если был передан callback или currentPlatform === undefined). Promise разрешится при получении события или будет отклонен по истечении timeout (если передан)
   */
  subscribe<T>(props: SubscribeWithoutCallback): [() => void, Promise<T> | undefined];
  subscribe<T>(props: SubscribeWithCallback<T>): [() => void, undefined];
  subscribe<T>(props: any): [() => void, any] {}

  /**
   * Геттер, который возвращает константу с поддерживаемыми платформами
   * @returns {{readonly HYBRID_IOS: "HYBRID_IOS", readonly HYBRID_ANDROID: "HYBRID_ANDROID", readonly LUNA_ANDROID: "LUNA_ANDROID", readonly LUNA_IOS: "LUNA_IOS", readonly AURORA: "AURORA"}}
   */
  get platforms(): {
    readonly LUNA_IOS: 'LUNA_IOS';
    readonly LUNA_ANDROID: 'LUNA_ANDROID';
    readonly HYBRID_ANDROID: 'HYBRID_ANDROID';
    readonly HYBRID_IOS: 'HYBRID_IOS';
    readonly AURORA: 'AURORA';
  } {}

  /**
   * Метод позволяет получить текущую платформу
   * @returns {"LUNA_IOS" | "HYBRID_IOS" | "HYBRID_ANDROID" | "LUNA_ANDROID" | "AURORA" | undefined}
   */
  getCurrentPlatform(): WebViewPlatform | undefined {}
}
```

## Примеры использования

### В hook-е

```typescript
import { webViewAdapter } from './webViewAdapter';

type Data = { number: string };

export const useSapphireContacts = (onMessage: (data: Data) => void) => {
  useEffect(() => {
    const [unsubscribe] = webViewAdapter.subscribe<Data>({
      types: ['SAPPHIRE_CONTACTS', 'ANDROID_CONTACTS'],
      isOnce: false,
      callback: onMessage,
    });

    return () => {
      unsubscribe();
    };
  }, [onMessage]);
};
```

### В функции

```typescript
import { WEBVIEW_LISTEN_ERRORS, webViewAdapter } from './webViewAdapter';

type Data = {
  available: boolean;
};

export const executeOnlineCall = () => {
  webViewAdapter.send('AVAILABILITY_CHECK_HANDLER');

  const [, promise] = webViewAdapter.subscribe<Data>({
    platforms: [webViewAdapter.platforms.HYBRID_ANDROID], // пример для подписки только на платформе Hybrid Android
    types: ['AVAILABILITY_CHECK_TYPE'],
    timeout: 3000,
  });

  return promise
    ?.then((response) => {
      console.log(response.available);
    })
    .catch((error) => {
      if (error?.startsWith(WEBVIEW_LISTEN_ERRORS.TIMEOUT_ERROR)) {
        webViewAdapter.send('ERROR_HANDLER', {
          code: 'ERROR_CODE',
        });
      }
    });
};
```

### Для проверки платформы

```typescript
import { webViewAdapter } from './webViewAdapter';

const currentPlatform = webViewAdapter.getCurrentPlatform();
if (currentPlatform === webViewAdapter.platforms.HYBRID_ANDROID) {
  // do something
}
```

### Логирование, отладка

Для отладки взаимодействия с webView в браузере можно включить логирование сообщений в консоль браузера.
Для этого необходимо в административной панели (/function-settings-mf) включить фичатогл WEBCORE2_3359.
Логируются входящие и исходящие postMessage отправленные через webViewAdapter.
