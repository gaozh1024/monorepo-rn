import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';

export interface GradientViewProps extends Omit<
  LinearGradientProps,
  'colors' | 'style' | 'children'
> {
  /** 渐变色列表，至少两个颜色 */
  colors: readonly [string, string, ...string[]];
  /** 子元素 */
  children?: React.ReactNode;
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
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
  style,
  ...props
}: GradientViewProps) {
  return (
    <LinearGradient colors={[...colors]} start={start} end={end} style={style} {...props}>
      {children}
    </LinearGradient>
  );
}
