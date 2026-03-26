import Reanimated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import type {
  MotionAnimatedCapabilities,
  MotionAnimatedDriver,
  MotionCapabilityKey,
  MotionScenario,
  MotionScenarioRecommendation,
  MotionScenarioRecommendationLevel,
} from './types';

export const Animated = Reanimated;

const MOTION_ANIMATED_CAPABILITIES: MotionAnimatedCapabilities = {
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
};

const MOTION_SCENARIO_REQUIREMENTS: Record<
  MotionScenario,
  {
    requiredCapabilities: MotionCapabilityKey[];
    preferredLevel: MotionScenarioRecommendationLevel;
    reason: string;
  }
> = {
  'press-feedback': {
    requiredCapabilities: ['timing', 'nativeDriver'],
    preferredLevel: 'recommended',
    reason: '按压反馈已切到 reanimated runtime，可继续直接使用。',
  },
  'presence-transition': {
    requiredCapabilities: ['timing', 'nativeDriver'],
    preferredLevel: 'recommended',
    reason: '常规显隐、位移和缩放过渡已适合直接运行在 reanimated 上。',
  },
  'progress-feedback': {
    requiredCapabilities: ['timing'],
    preferredLevel: 'recommended',
    reason: '进度补间已迁移到 reanimated shared value + timing。',
  },
  'toggle-control': {
    requiredCapabilities: ['timing', 'nativeDriver'],
    preferredLevel: 'recommended',
    reason: '表单切换类动效已全部切到 reanimated。',
  },
  'sheet-drawer': {
    requiredCapabilities: ['timing', 'parallel', 'nativeDriver'],
    preferredLevel: 'recommended',
    reason: 'Sheet / Drawer 动画层已运行在 reanimated 上。',
  },
  'stagger-list': {
    requiredCapabilities: ['timing', 'sequence'],
    preferredLevel: 'recommended',
    reason: '错峰入场已可直接使用 reanimated runtime。',
  },
  'collapsible-header': {
    requiredCapabilities: ['event', 'sharedValues', 'worklets'],
    preferredLevel: 'recommended',
    reason: '滚动联动 Header 现已适合直接使用 reanimated scroll handler。',
  },
  'complex-gesture': {
    requiredCapabilities: ['gestureDrivenAnimations', 'sharedValues', 'worklets'],
    preferredLevel: 'recommended',
    reason: '复杂手势场景现在优先建议走 reanimated。',
  },
  'shared-element': {
    requiredCapabilities: ['sharedValues', 'worklets'],
    preferredLevel: 'supported',
    reason: 'runtime 已迁移到 reanimated，但共享元素仍需上层具体方案配合。',
  },
  'layout-transition': {
    requiredCapabilities: ['layoutAnimations', 'worklets'],
    preferredLevel: 'supported',
    reason: 'runtime 已支持布局级动画能力，后续可在组件层逐步放开。',
  },
};

export function getMotionAnimatedDriver(): MotionAnimatedDriver {
  return MOTION_ANIMATED_CAPABILITIES.driver;
}

export function isReanimatedMotionDriver() {
  return true;
}

export function getMotionAnimatedCapabilities(): MotionAnimatedCapabilities {
  return MOTION_ANIMATED_CAPABILITIES;
}

export function supportsMotionCapability(capability: MotionCapabilityKey) {
  return MOTION_ANIMATED_CAPABILITIES.supports[capability];
}

export function getMotionScenarioRecommendation(
  scenario: MotionScenario
): MotionScenarioRecommendation {
  const config = MOTION_SCENARIO_REQUIREMENTS[scenario];
  const missingCapabilities = config.requiredCapabilities.filter(
    capability => !supportsMotionCapability(capability)
  );

  return {
    scenario,
    driver: getMotionAnimatedDriver(),
    level: missingCapabilities.length === 0 ? config.preferredLevel : 'not-recommended',
    shouldWaitForReanimated: false,
    requiredCapabilities: config.requiredCapabilities,
    missingCapabilities,
    reason: config.reason,
  };
}

export function shouldPreferReanimatedForScenario(_scenario: MotionScenario) {
  return true;
}

export { Easing, Extrapolation, interpolate, runOnJS, withDelay, withSequence, withTiming };
