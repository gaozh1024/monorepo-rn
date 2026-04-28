import type { ReactNode } from 'react';
import { Modal, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { AppPressable, AppView } from '@/ui/primitives';
import type { SheetMotionProps } from '../motion';
import { useWebModalEffects } from '../utils/web-modal-effects';

export interface BottomSheetModalProps extends SheetMotionProps {
  visible: boolean;
  onRequestClose: () => void;
  overlayColor: string;
  surfaceColor: string;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
  maxHeight?: number | `${number}%`;
  showHandle?: boolean;
  contentClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
  swipeToClose?: boolean;
  backdropTestID?: string;
  handleTestID?: string;
}

export function BottomSheetModal({
  visible,
  onRequestClose,
  overlayColor,
  surfaceColor,
  children,
  closeOnBackdropPress = false,
  maxHeight = '70%',
  showHandle = true,
  contentClassName,
  contentStyle,
  backdropTestID = 'bottom-sheet-backdrop',
  handleTestID = 'bottom-sheet-handle',
}: BottomSheetModalProps) {
  useWebModalEffects({ enabled: visible, onRequestClose });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose}>
      <AppView flex justify="end" accessibilityViewIsModal>
        <AppView
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: overlayColor }]}
        />

        {closeOnBackdropPress && (
          <AppPressable testID={backdropTestID} flex onPress={onRequestClose} />
        )}

        <AppView
          className={contentClassName}
          style={[
            styles.sheet,
            {
              backgroundColor: surfaceColor,
              maxHeight,
            },
            contentStyle,
          ]}
        >
          {showHandle && (
            <AppView testID={handleTestID} center className="pt-2 pb-1">
              <AppView style={styles.handle} />
            </AppView>
          )}
          {children}
        </AppView>
      </AppView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  handle: {
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(156,163,175,0.7)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
});
