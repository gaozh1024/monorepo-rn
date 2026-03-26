import { useEffect } from 'react';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type {
  MotionAnimatedViewStyle,
  MotionSharedValue,
  MotionSpringPreset,
  ToggleMotionPreset,
} from '../types';
import { motionDurations } from '../tokens';
import { resolveDuration, resolveSpringConfig } from '../utils';
import { useReducedMotion } from './useReducedMotion';

export interface UseToggleMotionOptions {
  value: boolean;
  preset?: ToggleMotionPreset;
  duration?: number;
  spring?: MotionSpringPreset;
  reduceMotion?: boolean;
  trackWidth?: number;
  thumbSize?: number;
  trackPadding?: number;
}

export interface UseToggleMotionReturn {
  progress: MotionSharedValue<number>;
  trackStyle?: MotionAnimatedViewStyle;
  thumbStyle?: MotionAnimatedViewStyle;
  indicatorStyle?: MotionAnimatedViewStyle;
}

export function useToggleMotion({
  value,
  preset = 'switch',
  duration,
  spring,
  reduceMotion: reduceMotionOverride,
  trackWidth,
  thumbSize,
  trackPadding = 2,
}: UseToggleMotionOptions): UseToggleMotionReturn {
  const { reduceMotion: systemReduceMotion, durationScale } = useReducedMotion();
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const progress = useSharedValue(value ? 1 : 0);
  const resolvedDuration = resolveDuration(
    duration,
    motionDurations.normal,
    reduceMotion,
    durationScale
  );
  const springConfig = spring && !reduceMotion ? resolveSpringConfig(spring) : undefined;

  useEffect(() => {
    if (springConfig) {
      progress.value = withSpring(value ? 1 : 0, springConfig);
      return;
    }

    progress.value = withTiming(value ? 1 : 0, { duration: resolvedDuration });
  }, [progress, resolvedDuration, springConfig, value]);

  const maxTranslateX =
    trackWidth !== undefined && thumbSize !== undefined
      ? Math.max(0, trackWidth - thumbSize - trackPadding * 2)
      : 0;

  const thumbStyle = useAnimatedStyle(() => {
    if (preset !== 'switch') return {};

    return {
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [0, maxTranslateX]),
        },
      ],
    };
  }, [maxTranslateX, preset]) satisfies MotionAnimatedViewStyle;

  const indicatorStyle = useAnimatedStyle(() => {
    if (preset === 'switch') return {};

    return {
      opacity: progress.value,
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.6, 1]),
        },
      ],
    };
  }, [preset]) satisfies MotionAnimatedViewStyle;

  return {
    progress,
    trackStyle: undefined,
    thumbStyle: preset === 'switch' ? thumbStyle : undefined,
    indicatorStyle: preset === 'switch' ? undefined : indicatorStyle,
  };
}
