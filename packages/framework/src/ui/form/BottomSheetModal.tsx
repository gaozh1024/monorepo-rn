import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { AppPressable, AppView } from '@/ui/primitives';

const SHEET_OPEN_DURATION = 220;
const SHEET_CLOSE_DURATION = 180;
const OVERLAY_OPEN_DURATION = 180;
const OVERLAY_CLOSE_DURATION = 160;
const SHEET_INITIAL_OFFSET = 24;
const SHEET_CLOSED_OFFSET = 240;
const SHEET_DRAG_CLOSE_THRESHOLD = 72;
const SHEET_DRAG_VELOCITY_THRESHOLD = 1;

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

function startAnimations(
  animations: Array<{ start: (callback?: (result?: { finished?: boolean }) => void) => void }>,
  onComplete?: () => void
) {
  if (animations.length === 0) {
    onComplete?.();
    return;
  }

  let completed = 0;

  animations.forEach(animation => {
    animation.start(() => {
      completed += 1;
      if (completed >= animations.length) {
        onComplete?.();
      }
    });
  });
}

export interface BottomSheetModalProps {
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
  swipeToClose = true,
  backdropTestID = 'bottom-sheet-backdrop',
  handleTestID = 'bottom-sheet-handle',
}: BottomSheetModalProps) {
  const [renderVisible, setRenderVisible] = useState(visible);
  const overlayOpacity = useRef(createAnimatedValue(0)).current;
  const sheetTranslateY = useRef(createAnimatedValue(SHEET_INITIAL_OFFSET)).current;
  const isDraggingRef = useRef(false);

  const handlePanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (!visible || !swipeToClose) return false;

          const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
          return isVertical && gestureState.dy > 6;
        },
        onPanResponderGrant: () => {
          isDraggingRef.current = true;
        },
        onPanResponderMove: (_event, gestureState) => {
          if (!visible || !swipeToClose) return;
          sheetTranslateY.setValue(Math.max(0, Math.min(SHEET_CLOSED_OFFSET, gestureState.dy)));
        },
        onPanResponderRelease: (_event, gestureState) => {
          isDraggingRef.current = false;

          if (!visible || !swipeToClose) {
            sheetTranslateY.setValue(0);
            return;
          }

          const shouldClose =
            gestureState.dy >= SHEET_DRAG_CLOSE_THRESHOLD ||
            gestureState.vy >= SHEET_DRAG_VELOCITY_THRESHOLD;

          if (shouldClose) {
            onRequestClose();
            return;
          }

          Animated.timing(sheetTranslateY, {
            toValue: 0,
            duration: SHEET_OPEN_DURATION,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          isDraggingRef.current = false;
          Animated.timing(sheetTranslateY, {
            toValue: 0,
            duration: SHEET_OPEN_DURATION,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onRequestClose, sheetTranslateY, swipeToClose, visible]
  );

  useEffect(() => {
    if (visible) {
      setRenderVisible(true);
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(SHEET_INITIAL_OFFSET);

      startAnimations([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: OVERLAY_OPEN_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: SHEET_OPEN_DURATION,
          useNativeDriver: true,
        }),
      ]);

      return;
    }

    if (!renderVisible) return;
    isDraggingRef.current = false;

    startAnimations(
      [
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: OVERLAY_CLOSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: SHEET_CLOSED_OFFSET,
          duration: SHEET_CLOSE_DURATION,
          useNativeDriver: true,
        }),
      ],
      () => {
        setRenderVisible(false);
      }
    );
  }, [overlayOpacity, renderVisible, sheetTranslateY, visible]);

  return (
    <Modal visible={renderVisible} transparent animationType="none" onRequestClose={onRequestClose}>
      <AppView flex justify="end">
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: overlayColor, opacity: overlayOpacity },
          ]}
        />

        {closeOnBackdropPress && (
          <AppPressable testID={backdropTestID} className="flex-1" onPress={onRequestClose} />
        )}

        <Animated.View
          className={contentClassName}
          style={[
            styles.sheet,
            {
              backgroundColor: surfaceColor,
              maxHeight,
              transform: [{ translateY: sheetTranslateY }],
            },
            contentStyle,
          ]}
        >
          {showHandle && (
            <AppView
              testID={handleTestID}
              center
              className="pt-2 pb-1"
              {...(swipeToClose ? handlePanResponder.panHandlers : undefined)}
            >
              <AppView style={styles.handle} />
            </AppView>
          )}
          {children}
        </Animated.View>
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
