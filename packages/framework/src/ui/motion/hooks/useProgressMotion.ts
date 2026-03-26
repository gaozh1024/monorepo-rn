import { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { MotionAnimatedViewStyle, MotionSharedValue, MotionSpringPreset } from '../types';
import { motionDurations } from '../tokens';
import { normalizeProgress, resolveDuration } from '../utils';
import { useReducedMotion } from './useReducedMotion';

export interface UseProgressMotionOptions {
  value: number;
  min?: number;
  max?: number;
  duration?: number;
  spring?: MotionSpringPreset;
  reduceMotion?: boolean;
}

export interface UseProgressMotionReturn {
  progress: MotionSharedValue<number>;
  animatedValue: MotionSharedValue<number>;
  barStyle: MotionAnimatedViewStyle;
}

export function useProgressMotion({
  value,
  min = 0,
  max = 100,
  duration,
  reduceMotion: reduceMotionOverride,
}: UseProgressMotionOptions): UseProgressMotionReturn {
  const { reduceMotion: systemReduceMotion, durationScale } = useReducedMotion();
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const progress = useSharedValue(normalizeProgress(value, min, max));
  const animatedValue = useSharedValue(value);
  const resolvedDuration = resolveDuration(
    duration,
    motionDurations.medium,
    reduceMotion,
    durationScale
  );

  useEffect(() => {
    const nextProgress = normalizeProgress(value, min, max);

    progress.value = withTiming(nextProgress, { duration: resolvedDuration });
    animatedValue.value = withTiming(value, { duration: resolvedDuration });
  }, [animatedValue, max, min, progress, resolvedDuration, value]);

  const barStyle = useAnimatedStyle(
    () => ({
      width: `${progress.value * 100}%`,
    }),
    []
  ) satisfies MotionAnimatedViewStyle;

  return { progress, animatedValue, barStyle };
}
