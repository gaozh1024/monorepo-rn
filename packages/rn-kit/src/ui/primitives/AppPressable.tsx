import * as React from 'react';
import Animated from 'react-native-reanimated';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import type { MotionAnimatedViewStyle, PressMotionProps } from '../motion';
import { useMotionConfig } from '../motion/context';
import { usePressMotion } from '../motion/hooks/usePressMotion';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';
import {
  type CommonLayoutProps,
  type LayoutSurface,
  resolveLayoutStyle,
  resolveRoundedStyle,
  resolveSizingStyle,
  resolveSpacingStyle,
} from '../utils/layout-shortcuts';

export interface AppPressableProps extends PressableProps, CommonLayoutProps, PressMotionProps {
  bg?: string;
  surface?: LayoutSurface;
  className?: string;
  pressedClassName?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AppPressableResolvedStyleItem = StyleProp<ViewStyle> | MotionAnimatedViewStyle | undefined;
type AppPressableResolvedStyle = AppPressableResolvedStyleItem[];

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
  motionPreset,
  motionDuration,
  motionReduceMotion,
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: AppPressableProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const motionConfig = useMotionConfig();
  const { theme, isDark } = useOptionalTheme();
  const resolvedMotionPreset = motionPreset ?? motionConfig.defaultPressPreset ?? 'none';
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;
  const pressMotion = usePressMotion({
    preset: resolvedMotionPreset,
    duration: motionDuration,
    disabled: props.disabled === true,
    reduceMotion: motionReduceMotion,
  });
  const baseStyle = React.useMemo<AppPressableResolvedStyle>(
    () => [
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
      pressMotion.animatedStyle,
    ],
    [
      between,
      center,
      flex,
      gap,
      h,
      items,
      justify,
      m,
      maxH,
      maxW,
      mb,
      minH,
      minW,
      ml,
      mr,
      mt,
      mx,
      my,
      p,
      pb,
      pl,
      pr,
      pressMotion.animatedStyle,
      pt,
      px,
      py,
      resolvedBgColor,
      rounded,
      row,
      w,
      wrap,
    ]
  );
  const resolvedStyle =
    typeof style === 'function'
      ? React.useCallback(
          (state: PressableStateCallbackType): AppPressableResolvedStyle => [
            ...(baseStyle as any[]),
            style(state),
          ],
          [baseStyle, style]
        )
      : ([...(baseStyle as any[]), style] as AppPressableResolvedStyle);

  return (
    <AnimatedPressable
      className={cn(shouldUseClassBg && `bg-${bg}`, className, isPressed && pressedClassName)}
      style={resolvedStyle}
      onPressIn={e => {
        setIsPressed(true);
        pressMotion.onPressIn();
        onPressIn?.(e);
      }}
      onPressOut={e => {
        setIsPressed(false);
        pressMotion.onPressOut();
        onPressOut?.(e);
      }}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
