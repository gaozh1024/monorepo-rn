import { View, ViewProps } from 'react-native';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';
import {
  type CommonLayoutProps,
  type LayoutSurface,
  resolveLayoutStyle,
  resolveRoundedStyle,
  resolveSizingStyle,
  resolveSpacingStyle,
} from '../utils/layout-shortcuts';

/**
 * AppView 组件属性接口
 */
export interface AppViewProps extends ViewProps, CommonLayoutProps {
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: LayoutSurface;
  /** 自定义类名 */
  className?: string;
}

/**
 * AppView - 基础视图容器组件
 *
 * 基于 React Native 的 View 组件封装，提供便捷的 Flexbox 布局属性
 * 和 Tailwind CSS 类名支持，简化日常布局开发
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppView>
 *   <Text>内容</Text>
 * </AppView>
 *
 * // Flex 布局
 * <AppView flex row>
 *   <Text>左侧</Text>
 *   <Text>右侧</Text>
 * </AppView>
 *
 * // 居中对齐
 * <AppView center className="h-full">
 *   <Text>居中内容</Text>
 * </AppView>
 *
 * // 带间距和背景
 * <AppView p={4} gap={2} bg="gray-100" rounded="lg">
 *   <Text>带样式的容器</Text>
 * </AppView>
 * ```
 */
export function AppView({
  flex,
  row,
  wrap,
  center,
  between,
  items,
  justify,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  bg,
  surface,
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  className,
  children,
  style,
  ...props
}: AppViewProps) {
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;

  return (
    <View
      className={cn(shouldUseClassBg && `bg-${bg}`, className)}
      style={[
        resolvedBgColor ? { backgroundColor: resolvedBgColor } : undefined,
        resolveLayoutStyle({
          flex,
          row,
          wrap,
          center,
          between,
          items,
          justify,
          gap,
        }),
        resolveSpacingStyle({
          p,
          px,
          py,
          pt,
          pb,
          pl,
          pr,
          m,
          mx,
          my,
          mt,
          mb,
          ml,
          mr,
        }),
        resolveSizingStyle({
          w,
          h,
          minW,
          minH,
          maxW,
          maxH,
        }),
        resolveRoundedStyle(rounded),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
