import { useEffect } from 'react';
import { View, type StatusBarProps, type StatusBarStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/theme';

export interface AppStatusBarProps extends Omit<
  StatusBarProps,
  'barStyle' | 'backgroundColor' | 'translucent'
> {
  /** 状态栏文字样式，auto 表示跟随当前主题 */
  barStyle?: StatusBarStyle | 'auto';
  /** Android 状态栏背景色，Web 下映射为 theme-color meta */
  backgroundColor?: string;
  /** 是否启用沉浸式状态栏，Web 下无原生状态栏语义 */
  translucent?: boolean;
  /** 测试标识 */
  testID?: string;
}

function setThemeColor(color: string) {
  if (typeof document === 'undefined') return;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = color;
}

/**
 * Web 状态栏适配。
 *
 * 浏览器没有 React Native 原生 StatusBar；这里仅同步 PWA/移动浏览器可识别的
 * `theme-color`，并保持组件 API/测试标识稳定。
 */
export function AppStatusBar({ backgroundColor, translucent = true, testID }: AppStatusBarProps) {
  const { theme } = useTheme();
  const resolvedBackgroundColor =
    backgroundColor ?? (translucent ? 'transparent' : theme.colors.background?.[500] || '#ffffff');

  useEffect(() => {
    if (resolvedBackgroundColor !== 'transparent') {
      setThemeColor(resolvedBackgroundColor);
    }
  }, [resolvedBackgroundColor]);

  if (!testID) return null;

  return <View testID={testID} style={{ display: 'none' }} />;
}

export function AppFocusedStatusBar(props: AppStatusBarProps) {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return <AppStatusBar {...props} />;
}
