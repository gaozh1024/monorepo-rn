import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useMotionConfig } from '../context';

export interface UseReducedMotionOptions {
  enabled?: boolean;
}

export interface UseReducedMotionReturn {
  reduceMotion: boolean;
  durationScale: number;
  shouldAnimate: boolean;
}

export function useReducedMotion(options: UseReducedMotionOptions = {}): UseReducedMotionReturn {
  const { enabled } = options;
  const motionConfig = useMotionConfig();
  const reduceMotionOverride = enabled ?? motionConfig.reduceMotion;
  const [systemReduceMotion, setSystemReduceMotion] = useState(Boolean(reduceMotionOverride));

  useEffect(() => {
    if (reduceMotionOverride !== undefined) {
      setSystemReduceMotion(Boolean(reduceMotionOverride));
      return;
    }

    let active = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(next => {
        if (active) setSystemReduceMotion(next);
      })
      .catch(() => {
        if (active) setSystemReduceMotion(false);
      });

    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', next => {
      setSystemReduceMotion(next);
    });

    return () => {
      active = false;
      subscription?.remove?.();
    };
  }, [reduceMotionOverride]);

  const reduceMotion = reduceMotionOverride ?? systemReduceMotion;
  const durationScale = reduceMotion ? 0 : Math.max(0, motionConfig.durationScale ?? 1);

  return {
    reduceMotion,
    durationScale,
    shouldAnimate: !reduceMotion && durationScale > 0,
  };
}
