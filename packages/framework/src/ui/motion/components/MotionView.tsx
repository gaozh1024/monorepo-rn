import React, { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { AppView, type AppViewProps } from '@/ui/primitives';
import { usePresenceMotion } from '../hooks/usePresenceMotion';
import type { PresencePreset } from '../types';
import type { PresenceMotionProps } from '../props';

export interface MotionViewProps extends AppViewProps, Omit<PresenceMotionProps, 'motionPreset'> {
  visible?: boolean;
  preset?: PresencePreset;
  motionPreset?: PresencePreset;
  children?: React.ReactNode;
}

export function MotionView({
  visible = true,
  preset = 'fade',
  motionPreset,
  motionDuration,
  motionEnterDuration,
  motionExitDuration,
  motionDistance,
  motionReduceMotion,
  motionEntering,
  motionExiting,
  motionLayout,
  children,
  ...rest
}: MotionViewProps) {
  const presence = usePresenceMotion({
    visible,
    preset: motionPreset ?? preset,
    duration: motionDuration,
    enterDuration: motionEnterDuration,
    exitDuration: motionExitDuration,
    distance: motionDistance,
    reduceMotion: motionReduceMotion,
  });

  const layoutAnimationProps = useMemo(
    () =>
      motionReduceMotion
        ? undefined
        : {
            entering: motionEntering,
            exiting: motionExiting,
            layout: motionLayout,
          },
    [motionEntering, motionExiting, motionLayout, motionReduceMotion]
  );

  if (!presence.mounted) return null;

  return (
    <Animated.View style={presence.animatedStyle} {...layoutAnimationProps}>
      <AppView {...rest}>{children}</AppView>
    </Animated.View>
  );
}
