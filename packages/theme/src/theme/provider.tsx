import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

/** 基础颜色配置（最简版本） */
export interface BaseColors {
  primary: string;
  background: string;
  text: string;
}

/** 主题上下文类型（支持泛型） */
export interface ThemeContextType<T = BaseColors> {
  colors: T;
  isDark: boolean;
  toggleTheme: () => void;
}

/** 主题 Provider 属性 */
interface ThemeProviderProps<T> {
  children: ReactNode;
  lightColors: T;
  darkColors: T;
}

/** 创建主题上下文 */
const ThemeContext = createContext<ThemeContextType<any> | undefined>(undefined);

/**
 * 主题 Provider 组件
 *
 * 通用主题 Provider，通过泛型支持自定义颜色配置。
 * 项目只需传入 lightColors 和 darkColors 配置即可。
 *
 * @example
 * ```tsx
 * // 定义项目颜色
 * interface AppColors {
 *   primary: string;
 *   background: string;
 *   // ... 其他颜色
 * }
 *
 * const lightColors: AppColors = {
 *   primary: '#f38b32',
 *   background: '#FFFFFF',
 * };
 *
 * const darkColors: AppColors = {
 *   primary: '#f38b32',
 *   background: '#000000',
 * };
 *
 * // 使用 Provider
 * <ThemeProvider lightColors={lightColors} darkColors={darkColors}>
 *   <App />
 * </ThemeProvider>
 *
 * // 在组件中使用
 * const { colors, isDark } = useTheme<AppColors>();
 * ```
 */
export function ThemeProvider<T = BaseColors>({
  children,
  lightColors,
  darkColors
}: ThemeProviderProps<T>) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark, lightColors, darkColors]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const value = useMemo(
    () => ({
      colors,
      isDark,
      toggleTheme,
    }),
    [colors, isDark, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * 使用主题钩子
 * @template T - 颜色配置类型
 * @returns 主题上下文值
 */
export function useTheme<T = BaseColors>(): ThemeContextType<T> {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context as ThemeContextType<T>;
}
