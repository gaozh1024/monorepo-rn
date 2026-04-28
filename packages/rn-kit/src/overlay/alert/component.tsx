/**
 * Alert 弹窗组件
 * @module overlay/alert/component
 */

import { PresenceSurface } from '@/ui/motion/components/PresenceSurface';
import { Modal, StyleSheet } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui';
import { useThemeColors } from '@/theme';
import { useMotionConfig, usePresenceMotion } from '@/ui/motion';
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
  motionPreset,
  motionDuration,
  motionEnterDuration,
  motionExitDuration,
  motionDistance,
  motionReduceMotion,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  const motionConfig = useMotionConfig();
  const colors = useThemeColors();
  const presence = usePresenceMotion({
    visible,
    preset: motionPreset ?? motionConfig.defaultPresencePreset ?? 'dialog',
    duration: motionDuration,
    enterDuration: motionEnterDuration,
    exitDuration: motionExitDuration,
    distance: motionDistance,
    reduceMotion: motionReduceMotion,
    unmountOnExit: true,
  });

  if (!presence.mounted) return null;

  return (
    <Modal transparent visible={presence.mounted} animationType="none">
      <AppView style={styles.container}>
        <PresenceSurface style={[styles.overlay, presence.overlayAnimatedStyle]} />
        <PresenceSurface style={[styles.alertBox, presence.animatedStyle]}>
          {title && <AppText className="text-lg font-semibold text-center mb-2">{title}</AppText>}
          {message && <AppText className="text-gray-600 text-center mb-4">{message}</AppText>}
          <AppView row gap={3} className="mt-2">
            {showCancel && (
              <AppPressable
                onPress={onCancel}
                flex
                py={12}
                items="center"
                justify="center"
                rounded="lg"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                <AppText style={{ color: '#374151', textAlign: 'center' }}>
                  {cancelText || '取消'}
                </AppText>
              </AppPressable>
            )}
            <AppPressable
              onPress={onConfirm}
              flex
              py={12}
              items="center"
              justify="center"
              rounded="lg"
              style={{ backgroundColor: colors.primary }}
            >
              <AppText style={{ color: '#ffffff', textAlign: 'center' }}>
                {confirmText || '确定'}
              </AppText>
            </AppPressable>
          </AppView>
        </PresenceSurface>
      </AppView>
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
