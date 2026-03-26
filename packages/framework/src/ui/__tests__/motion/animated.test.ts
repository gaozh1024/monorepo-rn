import { describe, expect, it } from 'vitest';
import {
  Animated,
  Easing,
  Extrapolation,
  getMotionAnimatedCapabilities,
  getMotionAnimatedDriver,
  getMotionScenarioRecommendation,
  interpolate,
  isReanimatedMotionDriver,
  runOnJS,
  shouldPreferReanimatedForScenario,
  supportsMotionCapability,
  withDelay,
  withSequence,
  withTiming,
} from '../../motion/animated';

describe('motion animated adapter', () => {
  it('应该暴露 reanimated runtime', () => {
    expect(Animated).toBeTruthy();
    expect(typeof Animated.createAnimatedComponent).toBe('function');
    expect(Easing).toBeTruthy();
    expect(Extrapolation).toBeTruthy();
    expect(typeof interpolate).toBe('function');
    expect(typeof runOnJS).toBe('function');
    expect(typeof withTiming).toBe('function');
    expect(typeof withDelay).toBe('function');
    expect(typeof withSequence).toBe('function');
  });

  it('应该暴露当前动画 driver 信息', () => {
    expect(getMotionAnimatedDriver()).toBe('reanimated');
    expect(isReanimatedMotionDriver()).toBe(true);
  });

  it('应该暴露当前 driver capability 信息', () => {
    expect(getMotionAnimatedCapabilities()).toMatchObject({
      driver: 'reanimated',
      supports: {
        timing: true,
        sequence: true,
        parallel: true,
        event: true,
        nativeDriver: true,
        gestureDrivenAnimations: true,
        sharedValues: true,
        layoutAnimations: true,
        worklets: true,
      },
      recommendedForComplexGestures: true,
      recommendedForSharedElement: true,
      recommendedForLayoutTransitions: true,
    });

    expect(supportsMotionCapability('timing')).toBe(true);
    expect(supportsMotionCapability('sharedValues')).toBe(true);
  });

  it('应该给出场景级建议', () => {
    expect(getMotionScenarioRecommendation('press-feedback')).toMatchObject({
      scenario: 'press-feedback',
      driver: 'reanimated',
      level: 'recommended',
      shouldWaitForReanimated: false,
      missingCapabilities: [],
    });

    expect(getMotionScenarioRecommendation('complex-gesture')).toMatchObject({
      scenario: 'complex-gesture',
      driver: 'reanimated',
      level: 'recommended',
      shouldWaitForReanimated: false,
      missingCapabilities: [],
    });

    expect(shouldPreferReanimatedForScenario('layout-transition')).toBe(true);
    expect(shouldPreferReanimatedForScenario('sheet-drawer')).toBe(true);
  });
});
