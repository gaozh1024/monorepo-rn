/**
 * Loading 弹窗组件
 * @module overlay/loading/component
 */

import { useEffect, useState } from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { AppText, AppPressable } from '@/ui';
import { Icon } from '@/ui/display';
import type { LoadingState } from './types';

const LOADING_CLOSE_DELAY = 30_000;

/**
 * Loading 弹窗组件
 */
export function LoadingModal({
  visible,
  text,
  onRequestClose,
}: LoadingState & { onRequestClose?: () => void }) {
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowCloseButton(false);
      return;
    }

    setShowCloseButton(false);
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, LOADING_CLOSE_DELAY);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.loadingBox, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <ActivityIndicator size="large" color="#fff" />
          {text && <AppText className="text-white mt-3 text-sm">{text}</AppText>}
          {showCloseButton && onRequestClose && (
            <AppPressable testID="loading-close" className="mt-3 p-1" onPress={onRequestClose}>
              <Icon name="close" size="md" color="#ffffff" />
            </AppPressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
});
