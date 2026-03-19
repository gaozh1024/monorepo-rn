import { create } from 'zustand';
import { appConfig } from '../bootstrap/app-config';
import { THEME_MODES, LANGUAGES, type ThemeMode, type Language } from '../bootstrap/constants';

/**
 * UI Store 状态
 */
interface UIState {
  // 主题
  themeMode: ThemeMode;

  // 语言
  language: Language;

  // 动作
  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
}

/**
 * UI Store
 * 管理主题模式、当前语言、局部 UI 标记
 */
export const useUIStore = create<UIState>(set => ({
  // 初始状态
  themeMode: appConfig.defaultThemeMode,
  language: appConfig.defaultLanguage as Language,

  // 设置主题模式
  setThemeMode: mode => {
    set({ themeMode: mode });
  },

  // 设置语言
  setLanguage: lang => {
    set({ language: lang });
  },

  // 切换主题
  toggleTheme: () => {
    set(state => ({
      themeMode: state.themeMode === THEME_MODES.DARK ? THEME_MODES.LIGHT : THEME_MODES.DARK,
    }));
  },
}));
