import { useCallback } from 'react';
import { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useMotionConfig } from '../context';
import type { MotionAnimatedViewStyle, MotionSharedValue, PressMotionPreset } from '../types';
import { motionDurations } from '../tokens';
import { resolvePressPreset } from '../presets';
import { resolveDuration } from '../utils';
import { useReducedMotion } from './useReducedMotion';

export interface UsePressMotionOptions {
  disabled?: boolean;
  preset?: PressMotionPreset;
  scaleTo?: number;
  opacityTo?: number;
  duration?: number;
  reduceMotion?: boolean;
}

export interface UsePressMotionReturn {
  pressed: MotionSharedValue<number>;
  animatedStyle: MotionAnimatedViewStyle;
  onPressIn: () => void;
  onPressOut: () => void;
}

export function usePressMotion({
  disabled = false,
  preset = 'soft',
  scaleTo,
  opacityTo,
  duration,
  reduceMotion: reduceMotionOverride,
}: UsePressMotionOptions = {}): UsePressMotionReturn {
  const motionConfig = useMotionConfig();
  const { reduceMotion: systemReduceMotion, durationScale } = useReducedMotion();
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const pressed = useSharedValue(0);
  const resolvedPresetName = preset ?? motionConfig.defaultPressPreset ?? 'soft';
  const resolvedPreset = resolvePressPreset(resolvedPresetName);
  const resolvedScaleTo = scaleTo ?? resolvedPreset.scaleTo;
  const resolvedOpacityTo = opacityTo ?? resolvedPreset.opacityTo;
  const resolvedDuration = resolveDuration(
    duration,
    motionDurations.fast,
    reduceMotion,
    durationScale
  );

  const animateTo = useCallback(
    (toValue: number) => {
      if (disabled || resolvedPresetName === 'none') {
        pressed.value = 0;
        return;
      }

      pressed.value = withTiming(toValue, { duration: resolvedDuration });
    },
    [disabled, pressed, resolvedDuration, resolvedPresetName]
  );

  const onPressIn = useCallback(() => {
    animateTo(1);
  }, [animateTo]);

  const onPressOut = useCallback(() => {
    animateTo(0);
  }, [animateTo]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(pressed.value, [0, 1], [1, resolvedOpacityTo]),
      transform: [
        {
          scale: interpolate(pressed.value, [0, 1], [1, resolvedScaleTo]),
        },
      ],
    }),
    [resolvedOpacityTo, resolvedScaleTo]
  ) satisfies MotionAnimatedViewStyle;

  return { pressed, animatedStyle, onPressIn, onPressOut };
}
