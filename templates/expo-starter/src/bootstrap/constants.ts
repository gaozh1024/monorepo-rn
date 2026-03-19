/**
 * 启动阶段常量
 */

// 缓存 Key
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  FIRST_LAUNCH: 'first_launch',
} as const;

// 主题模式
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = (typeof THEME_MODES)[keyof typeof THEME_MODES];

// 语言
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN: 'en',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// 动画时长
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
