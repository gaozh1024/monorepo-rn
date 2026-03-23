/**
 * Alert 弹窗组件
 * @module overlay/alert/component
 */

import { useEffect, useRef } from 'react';
import { View, Modal, StyleSheet, Animated } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui';
import type { AlertOptions } from './types';

type AlertModalProps = AlertOptions & {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

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
 * Alert 弹窗组件
 */
export function AlertModal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  showCancel,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  const progress = useRef(createAnimatedValue(0)).current;

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return;
    }

    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [progress, visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none">
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: progress }]} />
        <Animated.View
          style={[
            styles.alertBox,
            {
              opacity: progress,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {title && <AppText className="text-lg font-semibold text-center mb-2">{title}</AppText>}
          {message && <AppText className="text-gray-600 text-center mb-4">{message}</AppText>}
          <AppView row gap={3} className="mt-2">
            {showCancel && (
              <AppPressable onPress={onCancel} className="flex-1 py-3 bg-gray-100 rounded-lg">
                <AppText className="text-center text-gray-700">{cancelText || '取消'}</AppText>
              </AppPressable>
            )}
            <AppPressable onPress={onConfirm} className="flex-1 py-3 bg-primary-500 rounded-lg">
              <AppText className="text-center text-white">{confirmText || '确定'}</AppText>
            </AppPressable>
          </AppView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 32,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
