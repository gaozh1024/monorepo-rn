/**
 * Toast 项组件
 * @module overlay/toast/component
 */

import { useEffect, useState } from 'react';
import { PresenceSurface } from '@/ui/motion/components/PresenceSurface';
import { AppView, AppText } from '@/ui';
import { useOptionalTheme } from '@/theme';
import { useMotionConfig, usePresenceMotion } from '@/ui/motion';
import type { ToastItem } from './types';

interface ToastItemViewProps extends ToastItem {
  onHide: () => void;
}

/**
 * Toast 项组件
 */
export function ToastItemView({
  message,
  type,
  onHide,
  duration = 3000,
  motionPreset,
  motionDuration,
  motionEnterDuration,
  motionExitDuration,
  motionDistance,
  motionReduceMotion,
}: ToastItemViewProps) {
  const { theme } = useOptionalTheme();
  const motionConfig = useMotionConfig();
  const [visible, setVisible] = useState(true);
  const presence = usePresenceMotion({
    visible,
    preset: motionPreset ?? motionConfig.defaultPresencePreset ?? 'toast',
    duration: motionDuration,
    enterDuration: motionEnterDuration,
    exitDuration: motionExitDuration,
    distance: motionDistance,
    reduceMotion: motionReduceMotion,
    unmountOnExit: true,
    onExited: onHide,
  });

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setVisible(false);
      },
      Math.max(0, duration - 200)
    );

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

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

  const bgStyles: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return (
    <PresenceSurface style={presence.animatedStyle}>
      <AppView
        testID={`toast-item-${type}`}
        className={`${bgStyles[type]} px-4 py-3 rounded-lg mb-2 mx-4 shadow-lg`}
        style={{ backgroundColor: currentPalette.backgroundColor }}
      >
        <AppText className="text-center" style={{ color: currentPalette.textColor }}>
          {message}
        </AppText>
      </AppView>
    </PresenceSurface>
  );
}
