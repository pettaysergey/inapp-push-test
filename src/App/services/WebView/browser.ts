/* eslint-disable prefer-destructuring */
// Отключена из-за неправильной генерации типов для констант

import { webViewAdapter } from './webViewAdapter';

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isSapphireIos} через `webViewAdapter.isSapphireIos`.
 */
export const isSapphireIos = webViewAdapter.isSapphireIos;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isSapphireAndroid} через `webViewAdapter.isSapphireAndroid`.
 */
export const isSapphireAndroid = webViewAdapter.isSapphireAndroid;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isSapphire} через `webViewAdapter.isSapphire`.
 */
export const isSapphire = webViewAdapter.isSapphire;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isAurora} через `webViewAdapter.isAurora`.
 */
export const isAurora = webViewAdapter.isAurora;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isHybridIos} через `webViewAdapter.isHybridIos`.
 */
export const isHybridIos = webViewAdapter.isHybridIos;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isHybridAndroid} через `webViewAdapter.isHybridAndroid`.
 */
export const isHybridAndroid = webViewAdapter.isHybridAndroid;
/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isHybrid} через `webViewAdapter.isHybrid`.
 */
export const isHybrid = webViewAdapter.isHybrid;

/**
 * @deprecated Вычисляется единожды при инициализации модуля — небезопасно при SSR.
 * Используйте {@link WebViewAdapter.isSapphireOrHybrid} через `webViewAdapter.isSapphireOrHybrid`.
 */
export const isSapphireOrHybrid = webViewAdapter.isSapphireOrHybrid;
