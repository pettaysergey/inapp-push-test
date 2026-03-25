import { WEB_VIEW_PLATFORMS } from './constants';
import { WebViewPlatform } from './types';

export const isPlatform = (value: string): value is WebViewPlatform => {
  return Object.values(WEB_VIEW_PLATFORMS).includes(value as WebViewPlatform);
};
