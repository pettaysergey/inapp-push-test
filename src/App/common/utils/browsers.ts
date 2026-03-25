import { webViewAdapter } from "@src/App/services/WebView";

const isMiBrowser = (): boolean => navigator.userAgent.indexOf('Mi') > -1;

const isYandexBrowser = (): boolean => navigator.userAgent.indexOf('YaBrowser') > -1;

const isSapphireIos = () => webViewAdapter.getCurrentPlatform() === webViewAdapter.platforms.LUNA_IOS;

const isSapphireAndroid = () => webViewAdapter.getCurrentPlatform() === webViewAdapter.platforms.LUNA_ANDROID;

const isAurora = () => webViewAdapter.getCurrentPlatform() === webViewAdapter.platforms.AURORA;

const isHybridIos = () => webViewAdapter.getCurrentPlatform() === webViewAdapter.platforms.HYBRID_IOS;

const isAndroidWebView = () => webViewAdapter.getCurrentPlatform() === webViewAdapter.platforms.HYBRID_ANDROID;

const isEdg = (): boolean => navigator.userAgent.indexOf('Edg') > -1;

const isOpera = (): boolean => navigator.userAgent.indexOf('OPR') > -1;

const isChrome = (): boolean => {
  const chromeAgent = navigator.userAgent.indexOf('Chrome') > -1;
  const chromeIOSAgent = navigator.userAgent.indexOf('CriOS') > -1;

  const isChromeAgent = chromeAgent || chromeIOSAgent;

  return !isYandexBrowser() && !isEdg() && !isOpera() && isChromeAgent;
};

const isSafari = (): boolean => {
  const isAppleVendor = navigator.vendor.indexOf('Apple') > -1;
  const isCriOS = navigator.userAgent.indexOf('CriOS') === -1;
  const isFxiOS = navigator.userAgent.indexOf('FxiOS') === -1;

  return isAppleVendor && isCriOS && isFxiOS;
};

const isFirefox = (): boolean => {
  const firefoxAgent = navigator.userAgent.indexOf('Firefox') > -1;
  const firefoxIOSAgent = navigator.userAgent.indexOf('FxiOS') > -1;

  const isFirefoxAgent = firefoxAgent || firefoxIOSAgent;

  return !isChrome() && isFirefoxAgent;
};

const isSamsungBrowser = (): boolean => navigator.userAgent.indexOf('SamsungBrowser') > -1;

const isOtherBrowser = (): boolean => {
  return !isChrome() && !isSafari() && !isFirefox() && !isYandexBrowser();
};

const isYandexStartBrowser = (): boolean =>
  navigator.userAgent.indexOf('YaApp_Android') > -1 || navigator.userAgent.indexOf('YaSearchBrowser') > -1;

const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
};

export const browser = {
  isMiBrowser,
  isYandexBrowser,
  isChrome,
  isSafari,
  isFirefox,
  isOpera,
  isSapphireIos,
  isSapphireAndroid,
  isAndroidWebView,
  isSamsungBrowser,
  isYandexStartBrowser,
  isOtherBrowser,
  isHybridIos,
  isAurora,
  isPWA,
};
