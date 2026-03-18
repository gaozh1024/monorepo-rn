/**
 * 导航提供者组件
 *
 * @module navigation/provider
 * @description 提供 NavigationContainer 配置，管理导航状态和主题
 */

import React from 'react';
import {
  NavigationContainer,
  type LinkingOptions,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { useTheme } from '@/theme';
import { createNavigationTheme } from './utils/navigation-theme';

/**
 * 导航提供者组件 Props
 */
export interface NavigationProviderProps {
  /** 子元素（导航器组件） */
  children: React.ReactNode;
  /** 深度链接配置（可选） */
  linking?: LinkingOptions<any>;
  /** 加载时的回退组件 */
  fallback?: React.ReactNode;
  /** 导航准备就绪时的回调 */
  onReady?: () => void;
  /** 状态变化时的回调 */
  onStateChange?: (state: any) => void;
  /** 未处理动作时的回调 */
  onUnhandledAction?: (action: any) => void;
  /** 自定义导航主题（覆盖默认主题） */
  theme?: NavigationTheme;
}

/**
 * 导航提供者组件
 *
 * 封装 NavigationContainer，自动集成应用主题。
 * 所有导航器必须包裹在 NavigationProvider 内。
 *
 * @example
 * ```tsx
 * // 基础使用
 * export default function App() {
 *   return (
 *     <NavigationProvider>
 *       <StackNavigator>
 *         <StackNavigator.Screen name="Home" component={HomeScreen} />
 *       </StackNavigator>
 *     </NavigationProvider>
 *   );
 * }
 *
 * // 带深度链接
 * export default function App() {
 *   return (
 *     <NavigationProvider
 *       linking={{
 *         prefixes: ['myapp://', 'https://myapp.com'],
 *         config: {
 *           screens: {
 *             Home: 'home',
 *             Detail: 'detail/:id',
 *           },
 *         },
 *       }}
 *       fallback={<LoadingScreen />}
 *     >
 *       <RootNavigator />
 *     </NavigationProvider>
 *   );
 * }
 * ```
 */
export function NavigationProvider({
  children,
  linking,
  fallback,
  onReady,
  onStateChange,
  onUnhandledAction,
  theme: customTheme,
}: NavigationProviderProps) {
  const { theme, isDark } = useTheme();

  // 生成导航主题
  const navigationTheme = React.useMemo(
    () => customTheme || createNavigationTheme(theme, isDark),
    [customTheme, theme, isDark]
  );

  return (
    <NavigationContainer
      theme={navigationTheme}
      linking={linking}
      fallback={fallback}
      onReady={onReady}
      onStateChange={onStateChange}
      onUnhandledAction={onUnhandledAction}
    >
      {children}
    </NavigationContainer>
  );
}
