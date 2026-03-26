import { useMemo } from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type {
  MotionAnimatedScrollHandler,
  MotionAnimatedTextStyle,
  MotionAnimatedViewStyle,
  MotionSharedValue,
} from '../types';

export interface UseCollapsibleHeaderMotionOptions {
  minHeight: number;
  maxHeight: number;
  fadeTitle?: boolean;
  scaleTitle?: boolean;
}

export interface UseCollapsibleHeaderMotionReturn {
  scrollY: MotionSharedValue<number>;
  onScroll: MotionAnimatedScrollHandler;
  headerStyle: MotionAnimatedViewStyle;
  backgroundStyle: MotionAnimatedViewStyle;
  titleStyle: MotionAnimatedTextStyle;
  progress: MotionSharedValue<number>;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useCollapsibleHeaderMotion({
  minHeight,
  maxHeight,
  fadeTitle = true,
  scaleTitle = true,
}: UseCollapsibleHeaderMotionOptions): UseCollapsibleHeaderMotionReturn {
  const scrollY = useSharedValue(0);
  const progress = useSharedValue(0);
  const range = useMemo(() => Math.max(1, maxHeight - minHeight), [maxHeight, minHeight]);

  const onScroll = useAnimatedScrollHandler(
    event => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;
      progress.value = clamp(offsetY / range, 0, 1);
    },
    [range]
  );

  const headerStyle = useAnimatedStyle(
    () => ({
      height: interpolate(scrollY.value, [0, range], [maxHeight, minHeight], Extrapolation.CLAMP),
    }),
    [maxHeight, minHeight, range]
  ) satisfies MotionAnimatedViewStyle;

  const backgroundStyle = useAnimatedStyle(
    () => ({
      opacity: progress.value,
    }),
    []
  ) satisfies MotionAnimatedViewStyle;

  const titleStyle = useAnimatedStyle(
    () => ({
      opacity: fadeTitle ? interpolate(progress.value, [0, 1], [1, 0.88]) : 1,
      transform: scaleTitle
        ? [
            {
              scale: interpolate(progress.value, [0, 1], [1.06, 1]),
            },
          ]
        : undefined,
    }),
    [fadeTitle, scaleTitle]
  ) satisfies MotionAnimatedTextStyle;

  return {
    scrollY,
    onScroll,
    headerStyle,
    backgroundStyle,
    titleStyle,
    progress,
  };
}
