import { motionSprings } from './tokens';
import type { MotionSpringPreset } from './types';

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeProgress(value: number, min: number, max: number) {
  if (max <= min) return 0;

  return clamp((value - min) / (max - min), 0, 1);
}

export function resolveDuration(
  duration: number | undefined,
  fallback: number,
  reduceMotion: boolean,
  durationScale: number = 1
) {
  if (reduceMotion || durationScale <= 0) return 0;

  return Math.round((duration ?? fallback) * durationScale);
}

export function resolveSpringConfig(preset: MotionSpringPreset) {
  return motionSprings[preset];
}
