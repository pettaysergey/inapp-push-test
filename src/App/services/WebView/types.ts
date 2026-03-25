import { WEB_VIEW_PLATFORMS } from './constants';

type ValueOf<T> = T[keyof T];

export type WebViewPlatform = ValueOf<typeof WEB_VIEW_PLATFORMS>;
