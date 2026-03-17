import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, type ThemeConfig } from '@/theme';
import { NavigationProvider, type NavigationProviderProps } from '@/navigation';
import { OverlayProvider } from './OverlayHost';

// 默认主题配置
const defaultLightTheme: ThemeConfig = {
  colors: {
    primary: '#f38b32',
    secondary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

const defaultDarkTheme: ThemeConfig = {
  colors: {
    primary: '#f38b32',
    secondary: '#60a5fa',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
  },
};

export interface AppProviderProps extends Omit<NavigationProviderProps, 'children'> {
  children: React.ReactNode;
  /**
   * 是否启用导航（默认 true）
   * 使用 Expo Router 等外部导航方案时，请设置为 false
   */
  enableNavigation?: boolean;
  /** 是否启用全局 Overlay（Loading/Toast/Alert，默认 true） */
  enableOverlay?: boolean;
  /** 是否启用主题（默认 true） */
  enableTheme?: boolean;
  /** 是否启用安全区域（默认 true） */
  enableSafeArea?: boolean;
  /** 自定义亮色主题 */
  lightTheme?: ThemeConfig;
  /** 自定义暗色主题 */
  darkTheme?: ThemeConfig;
  /** 默认使用暗色模式 */
  defaultDark?: boolean;
}

/**
 * 统一应用 Provider
 *
 * 整合：SafeAreaProvider + ThemeProvider + NavigationProvider + OverlayProvider
 *
 * @example
 * 标准 React Navigation 使用：
 * ```tsx
 * import { AppProvider } from '@gaozh1024/rn-kit';
 *
 * export default function App() {
 *   return (
 *     <AppProvider>
 *       <RootNavigator />
 *     </AppProvider>
 *   );
 * }
 * ```
 *
 * Expo Router 使用（禁用内置导航）：
 * ```tsx
 * // app/_layout.tsx
 * import { AppProvider } from '@gaozh1024/rn-kit';
 * import { Stack } from 'expo-router';
 *
 * export default function RootLayout() {
 *   return (
 *     <AppProvider enableNavigation={false}>
 *       <Stack />
 *     </AppProvider>
 *   );
 * }
 * ```
 *
 * 按需启用功能：
 * ```tsx
 * <AppProvider
 *   enableNavigation={true}
 *   enableOverlay={true}
 *   enableTheme={true}
 *   enableSafeArea={true}
 * >
 *   <YourApp />
 * </AppProvider>
 * ```
 *
 * ⚠️ 重要提示：
 * 1. 导航配置文件不要放在 Expo Router 的 `app/` 目录内
 * 2. 使用 Expo Router 时，必须设置 enableNavigation={false}
 */
export function AppProvider({
  children,
  enableNavigation = true,
  enableOverlay = true,
  enableTheme = true,
  enableSafeArea = true,
  lightTheme = defaultLightTheme,
  darkTheme = defaultDarkTheme,
  defaultDark = false,
  ...navigationProps
}: AppProviderProps) {
  // 从内到外套娃
  let content = children;

  // 1. Overlay (Loading/Toast/Alert)
  if (enableOverlay) {
    content = <OverlayProvider>{content}</OverlayProvider>;
  }

  // 2. Navigation
  if (enableNavigation) {
    content = <NavigationProvider {...navigationProps}>{content}</NavigationProvider>;
  }

  // 3. Theme
  if (enableTheme) {
    content = (
      <ThemeProvider light={lightTheme} dark={darkTheme} defaultDark={defaultDark}>
        {content}
      </ThemeProvider>
    );
  }

  // 4. SafeArea (最外层)
  if (enableSafeArea) {
    content = <SafeAreaProvider>{content}</SafeAreaProvider>;
  }

  return <>{content}</>;
}
