import { AppPressable, type AppPressableProps } from '@/ui/primitives';
import { useMotionConfig } from '../context';
import type { PressMotionPreset } from '../types';

export interface MotionPressableProps extends AppPressableProps {
  motionPreset?: PressMotionPreset;
}

export function MotionPressable({ motionPreset, ...rest }: MotionPressableProps) {
  const motionConfig = useMotionConfig();

  return (
    <AppPressable
      motionPreset={motionPreset ?? motionConfig.defaultPressPreset ?? 'soft'}
      {...rest}
    />
  );
}
