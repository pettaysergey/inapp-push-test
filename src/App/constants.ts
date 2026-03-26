export const QUERY_OPTIONS = {
  refetchOnMount: false,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};
export const URLS = {
  get: '/nsm/nsm-ui-settings-manager/v1/packages/get',
};
export const IS_DEBUG_MODE = false;

/** cacheTime для использования в опциях react-query запросов */
export const REQUEST_CACHE_TIME_MS = IS_DEBUG_MODE ? 0 : 5 * 60 * 1000;
export const POST_MESSAGE_TYPE_UNP = 'SW::SendUnpEvent';
export const TYPE_SEND_TOKEN_FB = 'SW::SendTokenFB';
export const TYPE_BROADCAST_CHANNAL_SW = 'simple-pwa-web-push-sw';
