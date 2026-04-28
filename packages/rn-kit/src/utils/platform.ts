import { Platform } from 'react-native';

/** 当前是否为 Web 平台 */
export const isWeb = Platform.OS === 'web';

/** 当前是否为 iOS/Android 原生平台 */
export const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

/** 当前是否可能支持 hover 指针 */
export function supportsHover(): boolean {
  if (!isWeb || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(hover: hover)').matches;
}

/** 当前是否可能支持精确指针，如鼠标/触控板 */
export function supportsFinePointer(): boolean {
  if (!isWeb || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(pointer: fine)').matches;
}

/** Web 用户是否请求减少动画 */
export function prefersReducedMotion(): boolean {
  if (!isWeb || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 检查当前是否为开发环境
 *
 * 通过检查 process.env.NODE_ENV 是否为 'development' 来判断
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
