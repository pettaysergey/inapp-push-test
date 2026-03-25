import noop from 'lodash/noop';
import { v4 as uuidv4 } from 'uuid';

import { WEB_VIEW_PLATFORMS } from './constants';
import { WebViewPlatform } from './types';
import { isPlatform } from './utils';

type WebViewEvent<T = any> = MessageEvent<{ type: string; data: T }>;
type PromiseResolve = <T>(value: T | PromiseLike<T>) => void;
type PromiseReject = (reason?: any) => void;
type Subscription<T = any> = {
  id: string;
  promise?: {
    resolve: PromiseResolve;
    reject: PromiseReject;
  };
  isOnce: boolean;
  timeout?: number;
  timeoutId?: number;
  callback?: (data: T) => void;
};

type SubscribeWithoutCallback = {
  types: string | string[];
  platforms?: WebViewPlatform | WebViewPlatform[];
  isOnce?: boolean;
  timeout?: number;
};

type SubscribeWithCallback<T> = SubscribeWithoutCallback & {
  callback: (data: T) => void;
};

export const WEBVIEW_LISTEN_ERRORS = {
  TIMEOUT_ERROR: 'WEBVIEW_LISTEN.TIMEOUT_ERROR',
} as const;

export class WebViewAdapter {
  private subscriptionsMap = new Map<string, Set<Subscription>>();

  private currentPlatform: WebViewPlatform | undefined;

  readonly isSapphireIos: boolean;

  readonly isSapphireAndroid: boolean;

  readonly isSapphire: boolean;

  readonly isAurora: boolean;

  readonly isHybridIos: boolean;

  readonly isHybridAndroid: boolean;

  readonly isHybrid: boolean;

  readonly isSapphireOrHybrid: boolean;

  constructor(private _platforms = WEB_VIEW_PLATFORMS) {
    window.addEventListener('message', this.listener.bind(this));

    const platform = this.getCurrentPlatform();

    this.isSapphireIos = platform === this._platforms.LUNA_IOS;
    this.isSapphireAndroid = platform === this._platforms.LUNA_ANDROID;
    this.isSapphire = this.isSapphireIos || this.isSapphireAndroid;
    this.isAurora = platform === this._platforms.AURORA;
    this.isHybridIos = platform === this._platforms.HYBRID_IOS;
    this.isHybridAndroid = platform === this._platforms.HYBRID_ANDROID;
    this.isHybrid = this.isHybridIos || this.isHybridAndroid;
    this.isSapphireOrHybrid = this.isSapphire || this.isHybrid;
  }

  /**
   * Функция слушатель события MessageEvent<{ type: string; data: T, platform: 'ios_h' }>.
   * Событие обязательно должно иметь type - по нему производится подписка, и поле data, которое может быть
   * типизировано пользователем через Generic
   * @param {WebViewEvent} event - прослушиваемое событие
   * @private
   */
  private listener(event: WebViewEvent): void {
    const currentPlatform = this.getCurrentPlatform();
    if (!currentPlatform) {
      return;
    }

    if (this.subscriptionsMap.has(event.data.type)) {
      const subscriptions = this.subscriptionsMap.get(event.data.type);

      subscriptions?.forEach((subscription) => {
        if (subscription.timeoutId) {
          clearTimeout(subscription.timeoutId);
        }

        if (subscription.isOnce) {
          subscriptions.delete(subscription);
        } else if (subscription.timeout) {
          subscription.timeoutId = this.registerEventTimeout(event.data.type, subscription);
        }

        if (subscription.callback) {
          subscription.callback(event.data.data);
        } else {
          subscription.promise?.resolve(event.data.data);
        }
      });
    }
  }

  /**
   * Вспомогательный метод, который при регистрации подписки на событие создает функцию возвращающую ошибку по таймауту.
   * В случае подписки с callback возвращается ошибка new Error, в случае подписки без callback - Promise.reject.
   * После возникновения ошибки по таймауту подписка удаляется из subscriptionsMap.
   * @param {string} type - тип события
   * @param {Subscription} subscription - объект подписки
   * @return {number} - timeoutId функции setTimeout
   * @private
   */
  private registerEventTimeout(type: string, subscription: Subscription): number | undefined {
    const currentPlatform = this.getCurrentPlatform();
    if (!currentPlatform) {
      return;
    }

    // @ts-ignore // TODO: проблемы с типами, тянутся из ноды
    return setTimeout(() => {
      const subscriptions = this.subscriptionsMap.get(type);
      const error = `${WEBVIEW_LISTEN_ERRORS.TIMEOUT_ERROR}: subscriber with id=${subscription.id} received timeout error after ${subscription.timeout}ms`;

      if (subscriptions) {
        subscriptions.delete(subscription);
      }

      if (subscription.callback) {
        throw new Error(error);
      }

      subscription.promise?.reject(error);
    }, subscription.timeout);
  }

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
   * @property {boolean | undefined} props.isOnce - частота прослушивания события. Если передан callback, то можно указать прослушивается событие единожды при isOnce=true(default) или будет прослушиваться постоянно при isOnce=false. Если callback не передан, то будет возвращаться Promise, и isOnce будет автоматически = true.
   * @property {number | undefined} props.timeout - таймаут в мс, по истечению которого, если не будет получено событие, вернется ошибка. В случае подписки с callback возвращается ошибка new Error, в случае подписки без callback - Promise.reject.
   * @property {(data: T) => void} props.callback - callback функция, которая будет вызвана при получении события типа type.
   * @return {[(() => void), Promise<T>]} - возвращается кортеж из функции unsubscribe и Promise<T> (если не был передан callback) или undefined (если был передан callback). Promise разрешится при получении события или будет отклонен по истечении timeout (если передан)
   */
  subscribe<T>(props: SubscribeWithoutCallback): [() => void, Promise<T> | undefined];

  /**
   * Метод подписки на события от WebView.
   * Событие должно иметь вид {type: string; data: T}. Параметр data можно типизировать через Generic.
   *
   * Подписка осуществляется по type. Можно передать строку для подписки на одно событие
   * или массив строк для подписки на несколько событий.
   *
   * @param props
   * @property {object} props
   * @property {string | string[]} props.types - типы события или тип события
   * @property {WebViewPlatform | WebViewPlatform[] | undefined} props.platforms - параметр позволяющий задать платформу или набор платформ для которых будет осуществлена подписка. Если = undefined, то все платформы считаются разрешенными.
   * @property {boolean | undefined} props.isOnce - частота прослушивания события. Если передан callback, то можно указать прослушивается событие единожды при isOnce=true(default) или будет прослушиваться постоянно при isOnce=false. Если callback не передан, то будет возвращаться Promise, и isOnce будет автоматически = true.
   * @property {number | undefined} props.timeout - таймаут в мс, по истечению которого, если не будет получено событие, вернется ошибка. В случае подписки с callback возвращается ошибка new Error, в случае подписки без callback - Promise.reject.
   * @property {(data: T) => void} props.callback - callback функция, которая будет вызвана при получении события типа type.
   * @return {[(() => void), undefined]} - возвращается кортеж из функции unsubscribe и Promise<T> (если не был передан callback) или undefined (если был передан callback). Promise разрешится при получении события или будет отклонен по истечении timeout (если передан)
   */
  subscribe<T>(props: SubscribeWithCallback<T>): [() => void, undefined];

  /**
   * Метод подписки на события от WebView.
   * Событие должно иметь вид {type: string; data: T}. Параметр data можно типизировать через Generic.
   *
   * Подписка осуществляется по type. Можно передать строку для подписки на одно событие
   * или массив строк для подписки на несколько событий.
   *
   * В случае передачи callback, возвращается кортеж из функции отписки от прослушивания событий unsubscribe и undefined.
   *
   * Если callback не передан, то метод возвращает кортеж из функции unsubscribe и Promise<T>. Promise разрешится при
   * получении события или будет отклонен по истечении timeout (если передан). В случае работы с промисами, isOnce всегда считается равным true.
   * @param props
   * @property {object} props
   * @property {string | string[]} props.types - типы события или тип события
   * @property {WebViewPlatform | WebViewPlatform[] | undefined} props.platforms - параметр позволяющий задать платформу или набор платформ для которых будет осуществлена подписка. Если = undefined, то все платформы считаются разрешенными.
   * @property {boolean | undefined} props.isOnce - частота прослушивания события. Если передан callback, то можно указать прослушивается событие единожды при isOnce=true(default) или будет прослушиваться постоянно при isOnce=false. Если callback не передан, то будет возвращаться Promise, и isOnce будет автоматически = true.
   * @property {number | undefined} props.timeout - таймаут в мс, по истечению которого, если не будет получено событие, вернется ошибка. В случае подписки с callback возвращается ошибка new Error, в случае подписки без callback - Promise.reject.
   * @property {(data: T) => void} props.callback - callback функция, которая будет вызвана при получении события типа type.
   * @return {[(() => void), any]} - возвращается кортеж из функции unsubscribe и Promise<T> (если не был передан callback) или undefined (если был передан callback). Promise разрешится при получении события или будет отклонен по истечении timeout (если передан)
   */
  subscribe<T>(props: any): [() => void, any] {
    let promiseResolve: any;
    let promiseReject: any;
    let promise;
    const { types, isOnce, timeout, callback, platforms } = props;
    const currentPlatform = this.getCurrentPlatform();
    // Проверяем что находимся в платформе для которой надо создать подписки
    const needSubscribe =
      currentPlatform &&
      (platforms === undefined ||
        (Array.isArray(platforms) && platforms.includes(currentPlatform)) ||
        (isPlatform(platforms) && platforms === currentPlatform));

    if (!needSubscribe) {
      return [noop, undefined];
    }

    const id = uuidv4();
    const typesArray = Array.isArray(types) ? types : [types];

    if (!callback) {
      promise = new Promise<T>((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
      });
    }

    const newSubscription: Subscription<T> = {
      id,
      promise: callback
        ? undefined
        : {
            resolve: promiseResolve,
            reject: promiseReject,
          },
      isOnce: !!callback && typeof isOnce === 'boolean' ? isOnce : true,
      timeout,
      timeoutId: undefined,
      callback,
    };

    typesArray.forEach((type) => {
      const subscriptions = this.subscriptionsMap.get(type) || new Set();

      if (timeout) {
        newSubscription.timeoutId = this.registerEventTimeout(type, newSubscription);
      }

      this.subscriptionsMap.set(type, subscriptions.add(newSubscription));
    });

    const unsubscribe = () => {
      this.unsubscribe({ types: typesArray, id });
    };

    return [unsubscribe, promise];
  }

  /**
   * Метод отписки от прослушивания событий.
   * @param {string[]} types - типы событий
   * @param {string} id - уникальный идентификатор подписки
   */
  private unsubscribe({ types, id }: { types: string[]; id: string }): void {
    const currentPlatform = this.getCurrentPlatform();
    if (!currentPlatform) {
      return;
    }

    types.forEach((type) => {
      const subscriptions = this.subscriptionsMap.get(type);

      if (subscriptions) {
        const subscription = Array.from(subscriptions.values()).find((sb) => sb.id === id);

        if (subscription) {
          subscriptions.delete(subscription);
        }
      }
    });
  }

  /**
   * Поддерживаемые платформы
   * @returns {{readonly HYBRID_IOS: "HYBRID_IOS", readonly HYBRID_ANDROID: "HYBRID_ANDROID", readonly LUNA_ANDROID: "LUNA_ANDROID", readonly LUNA_IOS: "LUNA_IOS", readonly AURORA: "AURORA"}}
   */
  get platforms() {
    return this._platforms;
  }

  /**
   * Метод позволяет получить текущую платформу
   * @returns {"LUNA_IOS" | "HYBRID_IOS" | "HYBRID_ANDROID" | "LUNA_ANDROID" | "AURORA"}
   */
  getCurrentPlatform() {
    if (this.currentPlatform) {
      return this.currentPlatform;
    }

    if (navigator.userAgent.indexOf('Sapphire') > -1) {
      if (navigator.userAgent.indexOf('Android') > -1) {
        this.currentPlatform = this._platforms.LUNA_ANDROID;
        return this.currentPlatform;
      }

      this.currentPlatform = this._platforms.LUNA_IOS;
      return this.currentPlatform;
    }

    if (navigator.userAgent.indexOf('VtbOnlineAndroidHybrid') > -1) {
      this.currentPlatform = this._platforms.HYBRID_ANDROID;
      return this.currentPlatform;
    }

    if (navigator.userAgent.indexOf('VtbOnlineIosHybrid') > -1) {
      this.currentPlatform = this._platforms.HYBRID_IOS;
      return this.currentPlatform;
    }

    if (navigator.userAgent.indexOf('VtbOnlineAuroraHybrid') > -1) {
      this.currentPlatform = this._platforms.AURORA;
      return this.currentPlatform;
    }
  }
}

export const webViewAdapter = new WebViewAdapter();
