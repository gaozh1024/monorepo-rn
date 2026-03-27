import {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  JumpingTransition,
  LinearTransition,
  type BaseAnimationBuilder,
  Layout,
  type ReduceMotion,
  SequencedTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  StretchInY,
  StretchOutY,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { motionSprings } from './tokens';
import type {
  MotionEntryExitAnimation,
  MotionLayoutAnimation,
  MotionLayoutAnimationPreset,
  MotionLayoutPreset,
  MotionSpringPreset,
} from './types';

export interface MotionLayoutPresetOptions {
  preset: MotionLayoutPreset;
  duration?: number;
  delay?: number;
  spring?: MotionSpringPreset;
}

export interface ResolveMotionLayoutAnimationOptions extends MotionLayoutPresetOptions {
  reduceMotion?: boolean;
}

export interface ResolveMotionLayoutPropsOptions {
  entering?: MotionEntryExitAnimation;
  exiting?: MotionEntryExitAnimation;
  layout?: MotionLayoutAnimation;
  preset?: MotionLayoutPreset;
  duration?: number;
  delay?: number;
  spring?: MotionSpringPreset;
  reduceMotion?: boolean;
}

type MotionBuilder = MotionEntryExitAnimation | MotionLayoutAnimation | undefined;

const motionLayoutPresetFactories: Record<MotionLayoutPreset, () => MotionLayoutAnimationPreset> = {
  fade: () => ({
    entering: FadeIn,
    exiting: FadeOut,
    layout: LinearTransition,
  }),
  'fade-up': () => ({
    entering: FadeInUp,
    exiting: FadeOutDown,
    layout: LinearTransition,
  }),
  'fade-down': () => ({
    entering: FadeInDown,
    exiting: FadeOutUp,
    layout: LinearTransition,
  }),
  'slide-left': () => ({
    entering: SlideInRight,
    exiting: SlideOutLeft,
    layout: SequencedTransition,
  }),
  'slide-right': () => ({
    entering: SlideInLeft,
    exiting: SlideOutRight,
    layout: SequencedTransition,
  }),
  'zoom-fade': () => ({
    entering: ZoomIn,
    exiting: ZoomOut,
    layout: LinearTransition,
  }),
  'list-item': () => ({
    entering: FadeInUp,
    exiting: FadeOutDown,
    layout: SequencedTransition,
  }),
  'list-reorder': () => ({
    entering: FadeIn,
    exiting: FadeOut,
    layout: JumpingTransition,
  }),
  accordion: () => ({
    entering: StretchInY,
    exiting: StretchOutY,
    layout: Layout,
  }),
  dialog: () => ({
    entering: ZoomIn,
    exiting: ZoomOut,
    layout: LinearTransition,
  }),
};

function isBuilderClass(value: MotionBuilder): value is typeof BaseAnimationBuilder {
  return typeof value === 'function';
}

function isBuilderInstance(value: MotionBuilder): value is BaseAnimationBuilder {
  return Boolean(value) && typeof value === 'object';
}

function applyReduceMotion<T extends MotionBuilder>(builder: T, reduceMotion?: boolean): T {
  if (!builder || !reduceMotion) return builder;

  if (isBuilderClass(builder) && typeof builder.reduceMotion === 'function') {
    return builder.reduceMotion('always' as ReduceMotion) as T;
  }

  if (isBuilderInstance(builder) && typeof builder.reduceMotion === 'function') {
    return builder.reduceMotion('always' as ReduceMotion) as T;
  }

  return builder;
}

function applyBuilderConfig<T extends MotionBuilder>(
  builder: T,
  { duration, delay, spring, reduceMotion }: Omit<ResolveMotionLayoutAnimationOptions, 'preset'>
): T {
  if (!builder) return builder;

  let resolved: any = applyReduceMotion(builder, reduceMotion);

  if (duration !== undefined) {
    if (
      (isBuilderClass(resolved as MotionBuilder) || isBuilderInstance(resolved as MotionBuilder)) &&
      typeof resolved.duration === 'function'
    ) {
      resolved = resolved.duration(duration);
    }
  }

  if (delay !== undefined) {
    if (
      (isBuilderClass(resolved as MotionBuilder) || isBuilderInstance(resolved as MotionBuilder)) &&
      typeof resolved.delay === 'function'
    ) {
      resolved = resolved.delay(delay);
    }
  }

  if (spring && !reduceMotion) {
    const springConfig = motionSprings[spring];

    if (
      (isBuilderClass(resolved as MotionBuilder) || isBuilderInstance(resolved as MotionBuilder)) &&
      typeof resolved.springify === 'function'
    ) {
      resolved = resolved
        .springify()
        .damping(springConfig.damping)
        .stiffness(springConfig.stiffness)
        .mass(springConfig.mass);
    }
  }

  return resolved as T;
}

export function resolveMotionLayoutPreset({
  preset,
  duration,
  delay,
  spring,
  reduceMotion,
}: ResolveMotionLayoutAnimationOptions): MotionLayoutAnimationPreset {
  const presetAnimations = motionLayoutPresetFactories[preset]();

  return {
    entering: applyBuilderConfig(presetAnimations.entering, {
      duration,
      delay,
      spring,
      reduceMotion,
    }),
    exiting: applyBuilderConfig(presetAnimations.exiting, {
      duration,
      delay,
      spring,
      reduceMotion,
    }),
    layout: applyBuilderConfig(presetAnimations.layout, {
      duration,
      delay,
      spring,
      reduceMotion,
    }),
  };
}

export function resolveMotionLayoutProps({
  entering,
  exiting,
  layout,
  preset,
  duration,
  delay,
  spring,
  reduceMotion,
}: ResolveMotionLayoutPropsOptions): MotionLayoutAnimationPreset | undefined {
  if (reduceMotion) return undefined;

  const presetAnimations = preset
    ? resolveMotionLayoutPreset({
        preset,
        duration,
        delay,
        spring,
        reduceMotion,
      })
    : undefined;

  const resolved = {
    entering: entering ?? presetAnimations?.entering,
    exiting: exiting ?? presetAnimations?.exiting,
    layout: layout ?? presetAnimations?.layout,
  } satisfies MotionLayoutAnimationPreset;

  if (!resolved.entering && !resolved.exiting && !resolved.layout) {
    return undefined;
  }

  return resolved;
}
