import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

type WebPresencePhase = 'entered' | 'entering-from' | 'exiting' | 'hidden';

type WebPresenceStyle = Record<string, unknown>;

type TimerHandle = ReturnType<typeof setTimeout>;

function requestFrame(callback: () => void) {
  if (typeof requestAnimationFrame === 'function') {
    const frame = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(frame);
  }

  const timer = setTimeout(callback, 16);
  return () => clearTimeout(timer);
}

function toWebTransition(duration: number, delay = 0): WebPresenceStyle | undefined {
  if (duration <= 0 && delay <= 0) return undefined;

  return {
    transitionProperty: 'opacity, transform',
    transitionDuration: `${Math.max(0, duration)}ms`,
    transitionDelay: `${Math.max(0, delay)}ms`,
    transitionTimingFunction: 'ease',
    willChange: 'opacity, transform',
  };
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
  const [mounted, setMounted] = useState(() => visible || !unmountOnExit);
  const [phase, setPhase] = useState<WebPresencePhase>(() => (visible ? 'entered' : 'hidden'));
  const visibleRef = useRef(visible);
  const didMountRef = useRef(false);
  const cancelFrameRef = useRef<(() => void) | undefined>(undefined);
  const timerRef = useRef<TimerHandle | undefined>(undefined);
  const progressRef = useRef({ value: visible ? 1 : 0 } as MotionSharedValue<number>);

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

  const clearScheduledWork = useCallback(() => {
    cancelFrameRef.current?.();
    cancelFrameRef.current = undefined;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const completeEnter = useCallback(() => {
    if (!visibleRef.current) return;
    progressRef.current.value = 1;
    setPhase('entered');
    onEntered?.();
  }, [onEntered]);

  const completeExit = useCallback(() => {
    if (visibleRef.current) return;
    progressRef.current.value = 0;
    setPhase('hidden');
    if (unmountOnExit) {
      setMounted(false);
    }
    onExited?.();
  }, [onExited, unmountOnExit]);

  const enter = useCallback(() => {
    visibleRef.current = true;
    clearScheduledWork();
    setMounted(true);

    if (reduceMotion || resolvedEnterDuration <= 0) {
      completeEnter();
      return;
    }

    progressRef.current.value = 0;
    setPhase('entering-from');

    const totalDuration = Math.max(0, delay) + resolvedEnterDuration;
    cancelFrameRef.current = requestFrame(() => {
      if (!visibleRef.current) return;
      progressRef.current.value = 1;
      setPhase('entered');
      timerRef.current = setTimeout(() => {
        if (visibleRef.current) onEntered?.();
      }, totalDuration);
    });
  }, [clearScheduledWork, completeEnter, delay, onEntered, reduceMotion, resolvedEnterDuration]);

  const exit = useCallback(() => {
    visibleRef.current = false;
    clearScheduledWork();

    if (reduceMotion || resolvedExitDuration <= 0) {
      completeExit();
      return;
    }

    if (!mounted && unmountOnExit) {
      completeExit();
      return;
    }

    progressRef.current.value = 0;
    setPhase('exiting');
    timerRef.current = setTimeout(completeExit, resolvedExitDuration);
  }, [
    clearScheduledWork,
    completeExit,
    mounted,
    reduceMotion,
    resolvedExitDuration,
    unmountOnExit,
  ]);

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
    if (!didMountRef.current) {
      didMountRef.current = true;
      visibleRef.current = visible;
      return;
    }

    if (visible === visibleRef.current) return;

    setVisible(visible);
  }, [setVisible, visible]);

  useEffect(() => clearScheduledWork, [clearScheduledWork]);

  const isEntered = phase === 'entered';
  const activeTransitionDuration =
    phase === 'exiting' ? resolvedExitDuration : resolvedEnterDuration;
  const activeTransitionDelay = phase === 'entered' ? delay : 0;
  const transition = reduceMotion
    ? undefined
    : toWebTransition(activeTransitionDuration, activeTransitionDelay);

  const animatedStyle = useMemo(
    () =>
      ({
        opacity: isEntered ? resolvedPreset.toOpacity : resolvedPreset.fromOpacity,
        transform: [
          {
            translateX: isEntered ? resolvedPreset.toTranslateX : resolvedPreset.fromTranslateX,
          },
          {
            translateY: isEntered ? resolvedPreset.toTranslateY : resolvedPreset.fromTranslateY,
          },
          {
            scale: isEntered ? resolvedPreset.toScale : resolvedPreset.fromScale,
          },
        ],
        ...(transition ?? {}),
      }) as MotionAnimatedViewStyle,
    [isEntered, resolvedPreset, transition]
  );

  const overlayAnimatedStyle = useMemo(
    () =>
      ({
        opacity: isEntered ? 1 : 0,
        ...(transition ?? {}),
      }) as MotionAnimatedViewStyle,
    [isEntered, transition]
  );

  return {
    mounted,
    progress: progressRef.current,
    animatedStyle,
    overlayAnimatedStyle,
    enter,
    exit,
    setVisible,
  };
}
