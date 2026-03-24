import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
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
 * AppPressable 组件属性接口
 */
export interface AppPressableProps extends PressableProps, CommonLayoutProps {
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: LayoutSurface;
  /** 自定义类名 */
  className?: string;
  /** 按下状态时的类名 */
  pressedClassName?: string;
}

/**
 * AppPressable - 可按压组件
 *
 * 基于 React Native 的 Pressable 组件封装，支持按下状态样式切换
 * 自动管理按下状态，支持自定义普通状态和按下状态的样式
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppPressable onPress={() => console.log('pressed')}>
 *   <Text>点击我</Text>
 * </AppPressable>
 *
 * // 带按下效果
 * <AppPressable
 *   className="p-4 bg-blue-500"
 *   pressedClassName="bg-blue-600"
 *   onPress={handlePress}
 * >
 *   <Text className="text-white">按钮</Text>
 * </AppPressable>
 *
 * // 带透明度变化
 * <AppPressable
 *   className="p-3 rounded-lg"
 *   pressedClassName="opacity-70"
 *   onPress={handlePress}
 * >
 *   <Icon name="arrow-forward" />
 * </AppPressable>
 * ```
 */
export function AppPressable({
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
  bg,
  surface,
  className,
  pressedClassName,
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: AppPressableProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;
  const interactionState = React.useMemo<PressableStateCallbackType>(
    () => ({
      pressed: isPressed,
      hovered: false,
      focused: false,
    }),
    [isPressed]
  );
  const resolvedUserStyle: StyleProp<ViewStyle> =
    typeof style === 'function' ? style(interactionState) : style;

  return (
    <Pressable
      className={cn(shouldUseClassBg && `bg-${bg}`, className, isPressed && pressedClassName)}
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
        resolvedUserStyle,
      ]}
      onPressIn={e => {
        setIsPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        setIsPressed(false);
        onPressOut?.(e);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}
