import type { PresencePreset, PressMotionPreset } from './types';
import { motionDistances, motionOpacity, motionScales } from './tokens';

export interface PresenceResolvedPreset {
  fromOpacity: number;
  toOpacity: number;
  fromTranslateX: number;
  toTranslateX: number;
  fromTranslateY: number;
  toTranslateY: number;
  fromScale: number;
  toScale: number;
}

export function resolvePresencePreset(
  preset: PresencePreset,
  distance: number = motionDistances.md
): PresenceResolvedPreset {
  switch (preset) {
    case 'fade':
      return {
        fromOpacity: 0,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: 0,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'fadeUp':
      return {
        fromOpacity: 0,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: distance,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'fadeDown':
      return {
        fromOpacity: 0,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: -distance,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'scale':
      return {
        fromOpacity: 1,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: 0,
        toTranslateY: 0,
        fromScale: motionScales.dialogEnter,
        toScale: 1,
      };
    case 'scaleFade':
    case 'dialog':
      return {
        fromOpacity: 0,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: 16,
        toTranslateY: 0,
        fromScale: motionScales.dialogEnter,
        toScale: 1,
      };
    case 'slideUp':
    case 'sheet':
      return {
        fromOpacity: 1,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: distance,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'slideDown':
      return {
        fromOpacity: 1,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: -distance,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'slideLeft':
      return {
        fromOpacity: 1,
        toOpacity: 1,
        fromTranslateX: distance,
        toTranslateX: 0,
        fromTranslateY: 0,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'slideRight':
      return {
        fromOpacity: 1,
        toOpacity: 1,
        fromTranslateX: -distance,
        toTranslateX: 0,
        fromTranslateY: 0,
        toTranslateY: 0,
        fromScale: 1,
        toScale: 1,
      };
    case 'toast':
      return {
        fromOpacity: 0,
        toOpacity: 1,
        fromTranslateX: 0,
        toTranslateX: 0,
        fromTranslateY: -12,
        toTranslateY: 0,
        fromScale: motionScales.toastEnter,
        toScale: 1,
      };
  }
}

export function resolvePressPreset(preset: PressMotionPreset) {
  switch (preset) {
    case 'strong':
      return { scaleTo: motionScales.pressStrong, opacityTo: motionOpacity.press };
    case 'none':
      return { scaleTo: 1, opacityTo: 1 };
    case 'soft':
    default:
      return { scaleTo: motionScales.pressSoft, opacityTo: motionOpacity.press };
  }
}
