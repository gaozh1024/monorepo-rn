import React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { useThemeColors } from '@/theme';
import { useMotionConfig, type PressMotionProps, type SheetMotionProps } from '@/ui/motion';
import { AppPressable, AppScrollView, AppText, AppView } from '@/ui/primitives';
import { useWebModalEffects } from '../utils/web-modal-effects';
import { Icon } from './Icon';

export interface PageDrawerProps extends SheetMotionProps, PressMotionProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  placement?: 'left' | 'right';
  width?: number;
  swipeEnabled?: boolean;
  swipeThreshold?: number;
  closeOnBackdropPress?: boolean;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  testID?: string;
  contentTestID?: string;
  backdropTestID?: string;
}

export function PageDrawer({
  visible,
  onClose,
  title,
  header,
  footer,
  placement = 'right',
  width = 320,
  closeOnBackdropPress = true,
  showCloseButton = true,
  motionPreset,
  motionDuration,
  motionReduceMotion,
  children,
  testID,
  contentTestID = 'page-drawer-content',
  backdropTestID = 'page-drawer-backdrop',
}: PageDrawerProps) {
  const motionConfig = useMotionConfig();
  const colors = useThemeColors();
  const resolvedMotionPreset = motionPreset ?? motionConfig.defaultPressPreset ?? 'soft';
  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  useWebModalEffects({ enabled: visible, onRequestClose: handleClose });

  if (!visible) return null;

  const drawerContent = (
    <AppView
      testID={contentTestID}
      accessibilityViewIsModal
      className="h-full"
      style={[
        styles.drawer,
        {
          width,
          backgroundColor: colors.card,
          borderLeftWidth: placement === 'right' ? 0.5 : 0,
          borderRightWidth: placement === 'left' ? 0.5 : 0,
          borderLeftColor: colors.border,
          borderRightColor: colors.border,
        },
      ]}
    >
      {(header || title || showCloseButton) && (
        <AppView
          row
          items="center"
          between
          className="px-4 py-4"
          style={[styles.header, { borderBottomColor: colors.divider }]}
        >
          <AppView flex>
            {header ||
              (title ? (
                <AppText size="lg" weight="semibold">
                  {title}
                </AppText>
              ) : null)}
          </AppView>
          {showCloseButton && (
            <AppPressable
              testID="page-drawer-close"
              accessibilityRole="button"
              accessibilityLabel="关闭抽屉"
              p={4}
              pressedClassName="opacity-70"
              motionPreset={resolvedMotionPreset}
              motionDuration={motionDuration}
              motionReduceMotion={motionReduceMotion}
              onPress={handleClose}
            >
              <Icon name="close" size="md" color={colors.textSecondary} />
            </AppPressable>
          )}
        </AppView>
      )}

      <AppScrollView flex className="px-4 py-4">
        {children}
      </AppScrollView>

      {footer && (
        <AppView className="px-4 py-4" style={[styles.footer, { borderTopColor: colors.divider }]}>
          {footer}
        </AppView>
      )}
    </AppView>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <AppView
        testID={testID}
        flex
        row
        style={styles.root}
        justify={placement === 'right' ? 'end' : 'start'}
      >
        <AppView pointerEvents="none" style={styles.backdropFill} />

        {placement === 'left' && drawerContent}

        <AppPressable
          testID={backdropTestID}
          flex
          onPress={closeOnBackdropPress ? handleClose : undefined}
          motionPreset="none"
          motionReduceMotion
        />

        {placement === 'right' && drawerContent}
      </AppView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9997,
    backgroundColor: 'transparent',
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    height: '100%',
  },
  header: {
    borderBottomWidth: 0.5,
  },
  footer: {
    borderTopWidth: 0.5,
  },
});
