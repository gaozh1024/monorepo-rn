import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';
import { cn } from '@/utils';
import {
  type CommonLayoutProps,
  resolveLayoutStyle,
  resolveRoundedStyle,
  resolveSizingStyle,
  resolveSpacingStyle,
} from '../utils/layout-shortcuts';

export interface GradientViewProps
  extends Omit<LinearGradientProps, 'colors' | 'style' | 'children'>, CommonLayoutProps {
  /** 渐变色列表，至少两个颜色 */
  colors: readonly [string, string, ...string[]];
  /** 子元素 */
  children?: React.ReactNode;
  /** NativeWind 类名 */
  className?: string;
  /** 自定义容器样式 */
  style?: StyleProp<ViewStyle>;
}

/**
 * GradientView - 渐变背景容器
 *
 * 对 expo-linear-gradient 的轻量封装，用于页面级/卡片级渐变背景。
 *
 * @example
 * ```tsx
 * <GradientView
 *   colors={['#f38b32', '#fb923c']}
 *   style={{ padding: 24, borderRadius: 16 }}
 * >
 *   <AppText color="white">渐变标题</AppText>
 * </GradientView>
 * ```
 */
export function GradientView({
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
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  className,
  style,
  ...props
}: GradientViewProps) {
  return (
    <LinearGradient
      className={cn(className)}
      colors={[...colors]}
      start={start}
      end={end}
      style={[
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
    </LinearGradient>
  );
}
