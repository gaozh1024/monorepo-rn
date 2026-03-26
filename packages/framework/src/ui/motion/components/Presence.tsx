import React, { useMemo } from 'react';
import Animated from 'react-native-reanimated';
import { usePresenceMotion } from '../hooks/usePresenceMotion';
import type { PresencePreset } from '../types';
import type { PresenceMotionProps } from '../props';

export interface PresenceProps extends Omit<PresenceMotionProps, 'motionPreset'> {
  visible: boolean;
  preset?: PresencePreset;
  motionPreset?: PresencePreset;
  children: React.ReactNode;
}

export function Presence({
  visible,
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
}: PresenceProps) {
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
      {children}
    </Animated.View>
  );
}
