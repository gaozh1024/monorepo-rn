/**
 * Toast 项组件
 * @module overlay/toast/component
 */

import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { AppView, AppText } from '@/ui';
import type { ToastItem } from './types';

interface ToastItemViewProps extends ToastItem {
  onHide: () => void;
}

/**
 * Toast 项组件
 */
export function ToastItemView({ message, type, onHide }: ToastItemViewProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onHide);
  }, []);

  const bgColors: Record<string, string> = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    warning: 'bg-warning-500',
    info: 'bg-primary-500',
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
      <AppView className={`${bgColors[type]} px-4 py-3 rounded-lg mb-2 mx-4 shadow-lg`}>
        <AppText className="text-white text-center">{message}</AppText>
      </AppView>
    </Animated.View>
  );
}
