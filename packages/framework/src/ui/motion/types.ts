import type { TextStyle, ViewStyle } from 'react-native';
import type {
  AnimatedStyle,
  BaseAnimationBuilder,
  EntryOrExitLayoutType,
  LayoutAnimationFunction,
  ScrollHandlerProcessed,
  SharedValue,
} from 'react-native-reanimated';

export type MotionDurationPreset = 'instant' | 'fast' | 'normal' | 'medium' | 'slow' | 'slower';

export type MotionSpringPreset = 'snappy' | 'smooth' | 'bouncy';
export type MotionAnimatedDriver = 'reanimated';
export type MotionCapabilityKey =
  | 'timing'
  | 'sequence'
  | 'parallel'
  | 'event'
  | 'nativeDriver'
  | 'gestureDrivenAnimations'
  | 'sharedValues'
  | 'layoutAnimations'
  | 'worklets';

export type MotionScenario =
  | 'press-feedback'
  | 'presence-transition'
  | 'progress-feedback'
  | 'toggle-control'
  | 'sheet-drawer'
  | 'stagger-list'
  | 'collapsible-header'
  | 'complex-gesture'
  | 'shared-element'
  | 'layout-transition';

export type MotionScenarioRecommendationLevel = 'recommended' | 'supported' | 'not-recommended';

export interface MotionAnimatedCapabilities {
  driver: MotionAnimatedDriver;
  supports: Record<MotionCapabilityKey, boolean>;
  recommendedForComplexGestures: boolean;
  recommendedForSharedElement: boolean;
  recommendedForLayoutTransitions: boolean;
}

export interface MotionScenarioRecommendation {
  scenario: MotionScenario;
  driver: MotionAnimatedDriver;
  level: MotionScenarioRecommendationLevel;
  shouldWaitForReanimated: boolean;
  requiredCapabilities: MotionCapabilityKey[];
  missingCapabilities: MotionCapabilityKey[];
  reason: string;
}

export type PresencePreset =
  | 'fade'
  | 'fadeUp'
  | 'fadeDown'
  | 'scale'
  | 'scaleFade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'dialog'
  | 'toast'
  | 'sheet';

export type PressMotionPreset = 'soft' | 'strong' | 'none';

export type ToggleMotionPreset = 'switch' | 'checkbox' | 'radio';

export type SheetPlacement = 'bottom' | 'left' | 'right';

export type MotionSharedValue<T = number> = SharedValue<T>;
export type MotionAnimatedStyle<Style = ViewStyle> = AnimatedStyle<Style>;
export type MotionAnimatedViewStyle = MotionAnimatedStyle<ViewStyle>;
export type MotionAnimatedTextStyle = MotionAnimatedStyle<TextStyle>;
export type MotionAnimatedScrollHandler<
  Context extends Record<string, unknown> = Record<string, unknown>,
> = ScrollHandlerProcessed<Context>;
export type MotionEntryExitAnimation = EntryOrExitLayoutType;
export type MotionLayoutAnimation =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | LayoutAnimationFunction;

export interface MotionStyleReturn {
  animatedStyle: MotionAnimatedViewStyle;
}

export interface MotionTextStyleReturn {
  animatedStyle: MotionAnimatedTextStyle;
}
