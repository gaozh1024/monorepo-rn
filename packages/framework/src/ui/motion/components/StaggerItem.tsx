import React, { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import type { StaggerMotionProps } from '../props';
import { useStaggerMotion } from '../hooks/useStaggerMotion';

export interface StaggerItemProps extends StaggerMotionProps {
  index: number;
  visible?: boolean;
  children: React.ReactNode;
}

export function StaggerItem({
  index,
  visible = true,
  staggerPreset,
  staggerMs,
  staggerBaseDelayMs,
  staggerDuration,
  staggerDistance,
  staggerReduceMotion,
  motionEntering,
  motionExiting,
  motionLayout,
  children,
}: StaggerItemProps) {
  const motion = useStaggerMotion({
    index,
    visible,
    preset: staggerPreset,
    staggerMs,
    baseDelayMs: staggerBaseDelayMs,
    duration: staggerDuration,
    distance: staggerDistance,
    reduceMotion: staggerReduceMotion,
  });

  const layoutAnimationProps = useMemo(
    () =>
      staggerReduceMotion
        ? undefined
        : {
            entering: motionEntering,
            exiting: motionExiting,
            layout: motionLayout,
          },
    [motionEntering, motionExiting, motionLayout, staggerReduceMotion]
  );

  if (!motion.mounted) return null;

  return (
    <Animated.View style={motion.animatedStyle} {...layoutAnimationProps}>
      {children}
    </Animated.View>
  );
}
