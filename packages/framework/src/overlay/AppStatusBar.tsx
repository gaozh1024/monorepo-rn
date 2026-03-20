import { StatusBar, type StatusBarProps, type StatusBarStyle } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@/theme';

export interface AppStatusBarProps extends Omit<
  StatusBarProps,
  'barStyle' | 'backgroundColor' | 'translucent'
> {
  /** 状态栏文字样式，auto 表示跟随当前主题 */
  barStyle?: StatusBarStyle | 'auto';
  /** Android 状态栏背景色，默认跟随主题背景色 */
  backgroundColor?: string;
  /** 是否启用沉浸式状态栏，默认 false */
  translucent?: boolean;
  /** 测试标识 */
  testID?: string;
}

/**
 * 全局状态栏组件
 *
 * - 默认根据当前主题自动切换明暗文字
 * - 默认跟随主题背景色
 * - 页面可通过手动渲染该组件进行局部覆盖
 */
export function AppStatusBar({
  barStyle = 'auto',
  backgroundColor,
  translucent = false,
  ...props
}: AppStatusBarProps) {
  const { theme, isDark } = useTheme();

  const resolvedBarStyle =
    barStyle === 'auto' ? (isDark ? 'light-content' : 'dark-content') : barStyle;
  const resolvedBackgroundColor =
    backgroundColor ?? (translucent ? 'transparent' : theme.colors.background?.[500] || '#ffffff');

  return (
    <StatusBar
      barStyle={resolvedBarStyle}
      backgroundColor={resolvedBackgroundColor}
      translucent={translucent}
      {...props}
    />
  );
}

export function AppFocusedStatusBar(props: AppStatusBarProps) {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return <AppStatusBar {...props} />;
}
