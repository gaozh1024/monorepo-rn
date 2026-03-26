import { useCallback, useEffect, useMemo, useState } from 'react';
import { PanResponder, type PanResponderInstance } from 'react-native';
import {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { MotionAnimatedViewStyle, MotionSharedValue, SheetPlacement } from '../types';
import { motionDurations } from '../tokens';
import { resolveDuration } from '../utils';
import { useReducedMotion } from './useReducedMotion';

export interface UseSheetMotionOptions {
  visible: boolean;
  placement?: SheetPlacement;
  distance?: number;
  overlayOpacity?: number;
  closeOnSwipe?: boolean;
  swipeThreshold?: number;
  velocityThreshold?: number;
  reduceMotion?: boolean;
  onRequestClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
}

export interface UseSheetMotionReturn {
  mounted: boolean;
  progress: MotionSharedValue<number>;
  overlayStyle: MotionAnimatedViewStyle;
  sheetStyle: MotionAnimatedViewStyle;
  panHandlers?: PanResponderInstance['panHandlers'];
  open: () => void;
  close: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function useSheetMotion({
  visible,
  placement = 'bottom',
  distance = 240,
  overlayOpacity = 0.45,
  closeOnSwipe = true,
  swipeThreshold = 72,
  velocityThreshold = 1,
  reduceMotion: reduceMotionOverride,
  onRequestClose,
  onOpened,
  onClosed,
}: UseSheetMotionOptions): UseSheetMotionReturn {
  const { reduceMotion: systemReduceMotion, durationScale } = useReducedMotion();
  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(visible ? 1 : 0);
  const sheetTranslate = useSharedValue(visible ? 0 : distance);

  const openDuration = resolveDuration(
    undefined,
    motionDurations.medium,
    reduceMotion,
    durationScale
  );
  const closeDuration = resolveDuration(
    undefined,
    motionDurations.normal,
    reduceMotion,
    durationScale
  );

  const syncDragProgress = useCallback(
    (translate: number) => {
      const safeDistance = Math.max(distance, 1);
      const nextProgress = reduceMotion ? (translate === 0 ? 1 : 0) : 1 - translate / safeDistance;
      progress.value = clamp(nextProgress, 0, 1);
      sheetTranslate.value = translate;
    },
    [distance, progress, reduceMotion, sheetTranslate]
  );

  const animateOpen = useCallback(() => {
    setMounted(true);

    if (reduceMotion) {
      progress.value = 1;
      sheetTranslate.value = 0;
      onOpened?.();
      return;
    }

    progress.value = 0;
    sheetTranslate.value = distance;
    progress.value = withTiming(1, { duration: openDuration });
    sheetTranslate.value = withTiming(0, { duration: openDuration }, finished => {
      if (finished && onOpened) {
        runOnJS(onOpened)();
      }
    });
  }, [distance, onOpened, openDuration, progress, reduceMotion, sheetTranslate]);

  const animateClose = useCallback(() => {
    if (reduceMotion) {
      progress.value = 0;
      sheetTranslate.value = distance;
      setMounted(false);
      onClosed?.();
      return;
    }

    progress.value = withTiming(0, { duration: closeDuration });
    sheetTranslate.value = withTiming(distance, { duration: closeDuration }, finished => {
      if (!finished) return;
      runOnJS(setMounted)(false);
      if (onClosed) {
        runOnJS(onClosed)();
      }
    });
  }, [closeDuration, distance, onClosed, progress, reduceMotion, sheetTranslate]);

  useEffect(() => {
    if (visible) {
      animateOpen();
      return;
    }

    if (!mounted) return;
    animateClose();
  }, [animateClose, animateOpen, mounted, visible]);

  const animateBackToOpen = useCallback(() => {
    if (reduceMotion) {
      syncDragProgress(0);
      return;
    }

    progress.value = withTiming(1, { duration: openDuration });
    sheetTranslate.value = withTiming(0, { duration: openDuration });
  }, [openDuration, progress, reduceMotion, sheetTranslate, syncDragProgress]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (!visible || !closeOnSwipe) return false;

          if (placement === 'bottom') {
            return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && gestureState.dy > 6;
          }

          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 6
          );
        },
        onPanResponderMove: (_event, gestureState) => {
          if (!visible || !closeOnSwipe) return;

          if (placement === 'bottom') {
            syncDragProgress(clamp(gestureState.dy, 0, distance));
            return;
          }

          if (placement === 'left') {
            syncDragProgress(clamp(-gestureState.dx, 0, distance));
            return;
          }

          syncDragProgress(clamp(gestureState.dx, 0, distance));
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (!visible || !closeOnSwipe) return;

          const shouldClose =
            placement === 'bottom'
              ? gestureState.dy >= swipeThreshold || gestureState.vy >= velocityThreshold
              : Math.abs(gestureState.dx) >= swipeThreshold ||
                Math.abs(gestureState.vx) >= velocityThreshold;

          if (shouldClose) {
            onRequestClose?.();
            return;
          }

          animateBackToOpen();
        },
        onPanResponderTerminate: () => {
          animateBackToOpen();
        },
      }),
    [
      animateBackToOpen,
      closeOnSwipe,
      distance,
      onRequestClose,
      placement,
      swipeThreshold,
      syncDragProgress,
      velocityThreshold,
      visible,
    ]
  );

  const sheetStyle = useAnimatedStyle(() => {
    if (placement === 'left') {
      return {
        transform: [
          {
            translateX: interpolate(sheetTranslate.value, [0, distance], [0, -distance]),
          },
        ],
      };
    }

    if (placement === 'right') {
      return {
        transform: [
          {
            translateX: sheetTranslate.value,
          },
        ],
      };
    }

    return {
      transform: [
        {
          translateY: sheetTranslate.value,
        },
      ],
    };
  }, [distance, placement]) satisfies MotionAnimatedViewStyle;

  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(progress.value, [0, 1], [0, overlayOpacity]),
    }),
    [overlayOpacity]
  ) satisfies MotionAnimatedViewStyle;

  return {
    mounted,
    progress,
    overlayStyle,
    sheetStyle,
    panHandlers: closeOnSwipe ? panResponder.panHandlers : undefined,
    open: animateOpen,
    close: animateClose,
  };
}
