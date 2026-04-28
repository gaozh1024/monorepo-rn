import React, { useMemo } from 'react';
import { PresenceSurface } from './PresenceSurface';
import { AppView, type AppViewProps } from '@/ui/primitives';
import { usePresenceMotion } from '../hooks/usePresenceMotion';
import { resolveMotionLayoutProps } from '../layout';
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
  motionLayoutPreset,
  motionLayoutDuration,
  motionLayoutDelay,
  motionLayoutSpring,
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
      resolveMotionLayoutProps({
        entering: motionEntering,
        exiting: motionExiting,
        layout: motionLayout,
        preset: motionLayoutPreset,
        duration: motionLayoutDuration,
        delay: motionLayoutDelay,
        spring: motionLayoutSpring,
        reduceMotion: motionReduceMotion,
      }),
    [
      motionEntering,
      motionExiting,
      motionLayout,
      motionLayoutDelay,
      motionLayoutDuration,
      motionLayoutPreset,
      motionLayoutSpring,
      motionReduceMotion,
    ]
  );

  if (!presence.mounted) return null;

  return (
    <PresenceSurface style={presence.animatedStyle} {...layoutAnimationProps}>
      <AppView {...rest}>{children}</AppView>
    </PresenceSurface>
  );
}
