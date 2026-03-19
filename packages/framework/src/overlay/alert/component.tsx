/**
 * Alert 弹窗组件
 * @module overlay/alert/component
 */

import { View, Modal, StyleSheet } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui';
import type { AlertOptions } from './types';

type AlertModalProps = AlertOptions & {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

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
  if (!visible) return null;

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
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
