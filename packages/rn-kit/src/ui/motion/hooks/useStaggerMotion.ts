import { motionDurations } from '../tokens';
import type { PresencePreset } from '../types';
import { usePresenceMotion } from './usePresenceMotion';

export interface UseStaggerMotionOptions {
  visible: boolean;
  index: number;
  preset?: Extract<PresencePreset, 'fade' | 'fadeUp' | 'fadeDown' | 'scaleFade'>;
  staggerMs?: number;
  baseDelayMs?: number;
  duration?: number;
  distance?: number;
  reduceMotion?: boolean;
}

export function useStaggerMotion({
  visible,
  index,
  preset = 'fadeUp',
  staggerMs = 40,
  baseDelayMs = 0,
  duration = motionDurations.medium,
  distance,
  reduceMotion,
}: UseStaggerMotionOptions) {
  return usePresenceMotion({
    visible,
    preset,
    delay: baseDelayMs + index * staggerMs,
    duration,
    distance,
    reduceMotion,
  });
}
