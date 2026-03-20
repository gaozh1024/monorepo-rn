import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { resolveNamedColor } from '../utils/theme-color';

export interface SafeScreenProps extends ViewProps {
  /** 是否包含顶部安全区域 */
  top?: boolean;
  /** 是否包含底部安全区域 */
  bottom?: boolean;
  /** 是否包含左侧安全区域 */
  left?: boolean;
  /** 是否包含右侧安全区域 */
  right?: boolean;
  /** 背景颜色 */
  bg?: string;
  /** 是否使用 flex: 1 */
  flex?: boolean;
  /** 自定义样式类 */
  className?: string;
  /** 子元素 */
  children: React.ReactNode;
}

/**
 * 安全屏幕组件 - 自动适配刘海屏/全面屏的安全区域
 *
 * @example
 * ```tsx
 * <SafeScreen flex bg="white">
 *   <AppText>内容在安全区域内</AppText>
 * </SafeScreen>
 * ```
 */
export function SafeScreen({
  top = true,
  bottom = true,
  left = false,
  right = false,
  bg,
  flex = true,
  className,
  children,
  style,
  ...props
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor = resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;

  return (
    <View
      className={cn(flex && 'flex-1', shouldUseClassBg && `bg-${bg}`, className)}
      style={[
        flex && styles.flex,
        resolvedBgColor ? { backgroundColor: resolvedBgColor } : undefined,
        {
          paddingTop: top ? insets.top : 0,
          paddingBottom: bottom ? insets.bottom : 0,
          paddingLeft: left ? insets.left : 0,
          paddingRight: right ? insets.right : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

/**
 * 页面容器组件 - 包含安全区域和基础布局
 *
 * @example
 * ```tsx
 * <AppScreen>
 *   <AppHeader title="首页" />
 *   <AppView flex p={4}>
 *     <AppText>页面内容</AppText>
 *   </AppView>
 * </AppScreen>
 * ```
 */
export function AppScreen({
  children,
  className,
  ...props
}: Omit<SafeScreenProps, 'top' | 'bottom' | 'left' | 'right'>) {
  return (
    <SafeScreen flex bg="background" {...props} className={className}>
      {children}
    </SafeScreen>
  );
}

/**
 * 底部安全区域组件 - 只在底部添加安全距离
 * 注意：此组件不会铺满全屏，只占据内容高度
 *
 * @example
 * ```tsx
 * <SafeBottom>
 *   <AppButton>底部按钮</AppButton>
 * </SafeBottom>
 * ```
 */
export function SafeBottom({
  children,
  className,
  ...props
}: Omit<SafeScreenProps, 'top' | 'bottom' | 'left' | 'right'>) {
  return (
    <SafeScreen bottom left right flex={false} {...props} className={className}>
      {children}
    </SafeScreen>
  );
}
