import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useMotionConfig } from '../context';
import type { MotionAnimatedViewStyle, MotionSharedValue, PresencePreset } from '../types';
import { motionDistances, motionDurations } from '../tokens';
import { resolvePresencePreset } from '../presets';
import { resolveDuration } from '../utils';
import { useReducedMotion } from './useReducedMotion';

export interface UsePresenceMotionOptions {
  visible: boolean;
  preset?: PresencePreset;
  duration?: number;
  enterDuration?: number;
  exitDuration?: number;
  delay?: number;
  distance?: number;
  unmountOnExit?: boolean;
  reduceMotion?: boolean;
  onEntered?: () => void;
  onExited?: () => void;
}

export interface UsePresenceMotionReturn {
  mounted: boolean;
  progress: MotionSharedValue<number>;
  animatedStyle: MotionAnimatedViewStyle;
  overlayAnimatedStyle: MotionAnimatedViewStyle;
  enter: () => void;
  exit: () => void;
  setVisible: (next: boolean) => void;
}

export function usePresenceMotion({
  visible,
  preset,
  duration,
  enterDuration,
  exitDuration,
  delay = 0,
  distance = motionDistances.md,
  unmountOnExit = true,
  reduceMotion: reduceMotionOverride,
  onEntered,
  onExited,
}: UsePresenceMotionOptions): UsePresenceMotionReturn {
  const motionConfig = useMotionConfig();
  const { reduceMotion: systemReduceMotion, durationScale } = useReducedMotion();
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const resolvedPresetName = preset ?? motionConfig.defaultPresencePreset ?? 'fade';
  const resolvedPreset = useMemo(
    () => resolvePresencePreset(resolvedPresetName, distance),
    [distance, resolvedPresetName]
  );

  const resolvedEnterDuration = resolveDuration(
    enterDuration ?? duration,
    motionDurations.medium,
    reduceMotion,
    durationScale
  );
  const resolvedExitDuration = resolveDuration(
    exitDuration ?? duration,
    motionDurations.normal,
    reduceMotion,
    durationScale
  );

  const enter = useCallback(() => {
    setMounted(true);
    progress.value = reduceMotion ? 1 : 0;

    const animation = withTiming(1, { duration: resolvedEnterDuration }, finished => {
      if (finished && onEntered) {
        runOnJS(onEntered)();
      }
    });

    progress.value = reduceMotion || delay <= 0 ? animation : withDelay(delay, animation);
  }, [delay, onEntered, progress, reduceMotion, resolvedEnterDuration]);

  const exit = useCallback(() => {
    if (reduceMotion) {
      progress.value = 0;
      if (unmountOnExit) setMounted(false);
      onExited?.();
      return;
    }

    progress.value = withTiming(0, { duration: resolvedExitDuration }, finished => {
      if (finished && unmountOnExit) {
        runOnJS(setMounted)(false);
      }
      if (finished && onExited) {
        runOnJS(onExited)();
      }
    });
  }, [onExited, progress, reduceMotion, resolvedExitDuration, unmountOnExit]);

  const setVisible = useCallback(
    (next: boolean) => {
      if (next) {
        enter();
      } else {
        exit();
      }
    },
    [enter, exit]
  );

  useEffect(() => {
    setVisible(visible);
  }, [setVisible, visible]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        progress.value,
        [0, 1],
        [resolvedPreset.fromOpacity, resolvedPreset.toOpacity]
      ),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [resolvedPreset.fromTranslateX, resolvedPreset.toTranslateX]
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [resolvedPreset.fromTranslateY, resolvedPreset.toTranslateY]
          ),
        },
        {
          scale: interpolate(
            progress.value,
            [0, 1],
            [resolvedPreset.fromScale, resolvedPreset.toScale]
          ),
        },
      ],
    }),
    [resolvedPreset]
  ) satisfies MotionAnimatedViewStyle;

  const overlayAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: progress.value,
    }),
    []
  ) satisfies MotionAnimatedViewStyle;

  return { mounted, progress, animatedStyle, overlayAnimatedStyle, enter, exit, setVisible };
}
