import React from 'react';
import { BackHandler, Modal, PanResponder, StyleSheet } from 'react-native';
import { useThemeColors } from '@/theme';
import { AppPressable, AppScrollView, AppText, AppView } from '@/ui/primitives';
import { Icon } from './Icon';

export interface PageDrawerProps {
  /** 是否显示 */
  visible: boolean;
  /** 关闭回调 */
  onClose?: () => void;
  /** 标题 */
  title?: string;
  /** 自定义头部 */
  header?: React.ReactNode;
  /** 自定义底部 */
  footer?: React.ReactNode;
  /** 抽屉位置 */
  placement?: 'left' | 'right';
  /** 抽屉宽度 */
  width?: number;
  /** 是否启用手势关闭 */
  swipeEnabled?: boolean;
  /** 关闭阈值 */
  swipeThreshold?: number;
  /** 点击遮罩是否关闭 */
  closeOnBackdropPress?: boolean;
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean;
  /** 内容 */
  children?: React.ReactNode;
  /** 测试 ID */
  testID?: string;
  /** 内容测试 ID */
  contentTestID?: string;
  /** 遮罩测试 ID */
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
  swipeEnabled = true,
  swipeThreshold = 80,
  closeOnBackdropPress = true,
  showCloseButton = true,
  children,
  testID,
  contentTestID = 'page-drawer-content',
  backdropTestID = 'page-drawer-backdrop',
}: PageDrawerProps) {
  const colors = useThemeColors();
  const [translateX, setTranslateX] = React.useState(0);

  if (!visible) return null;

  const handleClose = React.useCallback(() => {
    setTranslateX(0);
    onClose?.();
  }, [onClose]);

  React.useEffect(() => {
    if (!visible) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });

    return () => subscription.remove();
  }, [handleClose, visible]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (!swipeEnabled) return false;

          const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          const reachesThreshold = Math.abs(gestureState.dx) > 8;

          return isHorizontal && reachesThreshold;
        },
        onPanResponderMove: (_event, gestureState) => {
          if (!swipeEnabled) return;

          const nextTranslateX =
            placement === 'right'
              ? Math.min(0, Math.max(-width, gestureState.dx))
              : Math.max(0, Math.min(width, gestureState.dx));

          setTranslateX(nextTranslateX);
        },
        onPanResponderRelease: (_event, gestureState) => {
          if (!swipeEnabled) {
            setTranslateX(0);
            return;
          }

          const reachedCloseThreshold =
            placement === 'right'
              ? gestureState.dx <= -swipeThreshold
              : gestureState.dx >= swipeThreshold;

          if (reachedCloseThreshold) {
            handleClose();
            return;
          }

          setTranslateX(0);
        },
        onPanResponderTerminate: () => {
          setTranslateX(0);
        },
      }),
    [handleClose, placement, swipeEnabled, swipeThreshold, width]
  );

  const drawerContent = (
    <AppView
      testID={contentTestID}
      className="h-full"
      {...panResponder.panHandlers}
      style={[
        styles.drawer,
        {
          width,
          backgroundColor: colors.card,
          borderLeftWidth: placement === 'right' ? 0.5 : 0,
          borderRightWidth: placement === 'left' ? 0.5 : 0,
          borderLeftColor: colors.border,
          borderRightColor: colors.border,
          transform: [{ translateX }],
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
              className="p-1"
              pressedClassName="opacity-70"
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
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <AppView
        testID={testID}
        flex
        row
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        justify={placement === 'right' ? 'end' : 'start'}
      >
        {placement === 'left' && drawerContent}

        <AppPressable
          testID={backdropTestID}
          className="flex-1"
          onPress={closeOnBackdropPress ? handleClose : undefined}
        />

        {placement === 'right' && drawerContent}
      </AppView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
