import { Keyboard, ScrollView, TouchableWithoutFeedback, type ScrollViewProps } from 'react-native';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';

export interface AppScrollViewProps extends ScrollViewProps {
  /** 是否使用 flex 布局 */
  flex?: boolean;
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: 'background' | 'card' | 'muted';
  /** 内边距 */
  p?: number;
  /** 水平内边距 */
  px?: number;
  /** 垂直内边距 */
  py?: number;
  /** 子元素间距 */
  gap?: number;
  /** 圆角大小 */
  rounded?: string;
  /** 自定义类名 */
  className?: string;
  /** 点击非输入区域时是否收起键盘 */
  dismissKeyboardOnPressOutside?: boolean;
}

/**
 * AppScrollView - 带 Tailwind/快捷布局能力的滚动容器
 */
export function AppScrollView({
  flex,
  bg,
  p,
  px,
  py,
  gap,
  surface,
  rounded,
  className,
  dismissKeyboardOnPressOutside = false,
  children,
  style,
  ...props
}: AppScrollViewProps) {
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;

  const content = (
    <ScrollView
      className={cn(
        flex && 'flex-1',
        shouldUseClassBg && `bg-${bg}`,
        p !== undefined && `p-${p}`,
        px !== undefined && `px-${px}`,
        py !== undefined && `py-${py}`,
        gap !== undefined && `gap-${gap}`,
        rounded && `rounded-${rounded}`,
        className
      )}
      {...props}
      style={[resolvedBgColor ? { backgroundColor: resolvedBgColor } : undefined, style]}
      keyboardShouldPersistTaps={
        dismissKeyboardOnPressOutside
          ? (props.keyboardShouldPersistTaps ?? 'handled')
          : props.keyboardShouldPersistTaps
      }
    >
      {children}
    </ScrollView>
  );

  if (!dismissKeyboardOnPressOutside) {
    return content;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  );
}
