/**
 * Toast 项组件
 * @module overlay/toast/component
 */

import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { AppView, AppText } from '@/ui';
import { useOptionalTheme } from '@/theme';
import type { ToastItem } from './types';

interface ToastItemViewProps extends ToastItem {
  onHide: () => void;
}

function createAnimatedValue(value: number) {
  const AnimatedValue = Animated.Value as unknown as {
    new (initialValue: number): Animated.Value;
    (initialValue: number): Animated.Value;
  };

  try {
    return new AnimatedValue(value);
  } catch {
    return AnimatedValue(value);
  }
}

/**
 * Toast 项组件
 */
export function ToastItemView({ message, type, onHide }: ToastItemViewProps) {
  const fadeAnim = useRef(createAnimatedValue(0)).current;
  const { theme } = useOptionalTheme();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onHide);
  }, []);

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
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      <AppView
        testID={`toast-item-${type}`}
        className={`${bgStyles[type]} px-4 py-3 rounded-lg mb-2 mx-4 shadow-lg`}
        style={{ backgroundColor: currentPalette.backgroundColor }}
      >
        <AppText className="text-center" style={{ color: currentPalette.textColor }}>
          {message}
        </AppText>
      </AppView>
    </Animated.View>
  );
}
