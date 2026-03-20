import { StyleSheet, Text, TextProps } from 'react-native';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import {
  hasExplicitTextColorClass,
  resolveNamedColor,
  resolveTextTone,
} from '../utils/theme-color';

/**
 * AppText 组件属性接口
 */
export interface AppTextProps extends TextProps {
  /** 字体大小：xs(12px)、sm(14px)、md(16px)、lg(18px)、xl(20px)、2xl(24px)、3xl(30px) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** 字重：normal(400)、medium(500)、semibold(600)、bold(700) */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** 文字颜色，支持 Tailwind 颜色类名 */
  color?: string;
  /** 语义化文字色 */
  tone?:
    | 'default'
    | 'muted'
    | 'inverse'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error';
  /** 自定义类名 */
  className?: string;
}

/**
 * AppText - 基础文本组件
 *
 * 基于 React Native 的 Text 组件封装，提供预设的字体大小、字重和颜色选项
 * 支持 Tailwind CSS 类名，简化文本样式定义
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppText>默认文本</AppText>
 *
 * // 不同大小
 * <AppText size="xs">超小文本</AppText>
 * <AppText size="lg">大文本</AppText>
 * <AppText size="2xl">超大文本</AppText>
 *
 * // 不同字重
 * <AppText weight="bold">粗体文本</AppText>
 * <AppText weight="semibold">半粗文本</AppText>
 *
 * // 自定义颜色
 * <AppText color="primary-500">主题色文本</AppText>
 * <AppText color="red-500">红色文本</AppText>
 *
 * // 组合使用
 * <AppText size="xl" weight="bold" color="gray-800">
 *   标题文本
 * </AppText>
 * ```
 */
export function AppText({
  size = 'md',
  weight = 'normal',
  color,
  tone,
  className,
  children,
  style,
  ...props
}: AppTextProps) {
  const { theme, isDark } = useOptionalTheme();
  const flattenedStyle = StyleSheet.flatten(style);
  const hasExplicitStyleColor = flattenedStyle?.color !== undefined;
  const hasExplicitClassColor = hasExplicitTextColorClass(className);
  const sizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  const weightMap: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  const fallbackTone =
    tone ??
    (color || hasExplicitStyleColor || hasExplicitClassColor ? undefined : ('default' as const));
  const resolvedColor =
    resolveTextTone(fallbackTone, theme, isDark) ?? resolveNamedColor(color, theme, isDark);
  const shouldUseClassColor = !!color && !resolvedColor;

  return (
    <Text
      className={cn(
        sizeMap[size],
        weightMap[weight],
        shouldUseClassColor && `text-${color}`,
        className
      )}
      style={[resolvedColor ? { color: resolvedColor } : undefined, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
