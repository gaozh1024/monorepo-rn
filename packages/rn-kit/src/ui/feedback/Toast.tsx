import { PresenceSurface } from '../motion/components/PresenceSurface';
import { AppView, AppText } from '../primitives';
import { useOptionalTheme } from '@/theme';
import { useMotionConfig, type PresenceMotionProps } from '../motion';
import { usePresenceMotion } from '../motion/hooks/usePresenceMotion';

/**
 * Toast 组件属性接口
 */
export interface ToastProps extends PresenceMotionProps {
  /** 提示消息内容 */
  message: string;
  /** 提示类型，决定背景颜色 */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** 是否显示 */
  visible?: boolean;
  /** 测试 ID */
  testID?: string;
}

export function Toast({
  message,
  type = 'info',
  visible = true,
  testID,
  motionPreset,
  motionDuration,
  motionEnterDuration,
  motionExitDuration,
  motionDistance,
  motionReduceMotion,
}: ToastProps) {
  const { theme } = useOptionalTheme();
  const motionConfig = useMotionConfig();
  const presence = usePresenceMotion({
    visible,
    preset: motionPreset ?? motionConfig.defaultPresencePreset ?? 'toast',
    duration: motionDuration,
    enterDuration: motionEnterDuration,
    exitDuration: motionExitDuration,
    distance: motionDistance,
    reduceMotion: motionReduceMotion,
    unmountOnExit: true,
  });

  if (!presence.mounted) return null;

  const palette = {
    success: {
      backgroundColor: theme.colors.success?.[500] || '#22c55e',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: theme.colors.error?.[500] || '#ef4444',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: theme.colors.warning?.[500] || '#f59e0b',
      textColor: '#111827',
    },
    info: {
      backgroundColor: theme.colors.info?.[500] || theme.colors.primary?.[500] || '#3b82f6',
      textColor: '#ffffff',
    },
  } as const;

  const currentPalette = palette[type];

  return (
    <PresenceSurface style={presence.animatedStyle}>
      <AppView
        testID={testID}
        className="px-4 py-3 rounded-lg"
        style={{ backgroundColor: currentPalette.backgroundColor }}
      >
        <AppText style={{ color: currentPalette.textColor }}>{message}</AppText>
      </AppView>
    </PresenceSurface>
  );
}
