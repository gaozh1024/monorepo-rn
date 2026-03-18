/**
 * Loading 弹窗组件
 * @module overlay/loading/component
 */

import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { AppText } from '@/ui';
import type { LoadingState } from './types';

/**
 * Loading 弹窗组件
 */
export function LoadingModal({ visible, text }: LoadingState) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.loadingBox, { backgroundColor: 'rgba(0,0,0,0.8)' }]}>
          <ActivityIndicator size="large" color="#fff" />
          {text && <AppText className="text-white mt-3 text-sm">{text}</AppText>}
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
