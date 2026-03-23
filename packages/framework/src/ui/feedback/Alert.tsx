import { useCallback, useEffect, useRef } from 'react';
import { Modal, TouchableOpacity, StyleSheet, GestureResponderEvent, Animated } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

/**
 * Alert 按钮配置
 */
export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Alert 组件属性接口
 */
export interface AlertProps {
  /** 是否显示 */
  visible: boolean;
  /** 标题 */
  title: string;
  /** 消息内容 */
  message?: string;
  /** 按钮配置 */
  buttons: AlertButton[];
  /** 关闭回调 */
  onClose?: () => void;
}

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
 * Alert - 对话框组件，支持浅色/深色主题
 */
export function Alert({ visible, title, message, buttons, onClose }: AlertProps) {
  const { theme, isDark } = useTheme();
  const progress = useRef(createAnimatedValue(0)).current;

  // 主题颜色
  const modalBgColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const messageColor = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const cancelButtonBg = isDark ? '#374151' : '#f3f4f6';
  const cancelButtonText = isDark ? '#ffffff' : '#374151';
  const destructiveColor = theme.colors.error?.[500] || '#ef4444';

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

  const handleButtonPress = useCallback(
    (button: AlertButton) => (e: GestureResponderEvent) => {
      e.stopPropagation();
      button.onPress?.();
      onClose?.();
    },
    [onClose]
  );

  // 获取按钮样式
  const getButtonStyle = (button: AlertButton) => {
    if (button.style === 'destructive') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: destructiveColor,
      };
    }
    if (button.style === 'cancel') {
      return {
        backgroundColor: cancelButtonBg,
        borderWidth: 0.5,
        borderColor: isDark ? '#4b5563' : '#d1d5db',
      };
    }
    return {
      backgroundColor: theme.colors.primary?.[500] || '#f38b32',
      borderWidth: 0,
    };
  };

  // 获取按钮文字颜色
  const getButtonTextColor = (button: AlertButton) => {
    if (button.style === 'destructive') {
      return destructiveColor;
    }
    if (button.style === 'cancel') {
      return cancelButtonText;
    }
    return '#ffffff';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <AppView className="flex-1" center>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: progress,
            },
          ]}
        />
        <Animated.View
          className="rounded-xl mx-8 min-w-[280px]"
          style={[
            {
              backgroundColor: modalBgColor,
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
          {/* 内容区域 */}
          <AppView className="px-6 py-5">
            <AppText
              size="lg"
              weight="semibold"
              className="text-center mb-2"
              style={{ color: textColor }}
            >
              {title}
            </AppText>
            {message && (
              <AppText size="sm" style={{ color: messageColor }} className="text-center leading-5">
                {message}
              </AppText>
            )}
          </AppView>

          {/* 按钮区域 */}
          <AppView className="border-t" style={{ borderTopColor: borderColor }}>
            {buttons.length === 1 ? (
              // 单个按钮
              <TouchableOpacity
                onPress={handleButtonPress(buttons[0])}
                className="py-3 rounded-b-xl"
                style={[styles.singleButton, getButtonStyle(buttons[0])]}
              >
                <AppText
                  weight="medium"
                  className="text-center"
                  style={{ color: getButtonTextColor(buttons[0]) }}
                >
                  {buttons[0].text}
                </AppText>
              </TouchableOpacity>
            ) : buttons.length === 2 ? (
              // 两个按钮横向排列
              <AppView row style={styles.twoButtonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={handleButtonPress(button)}
                    className={cn(
                      'py-3 flex-1',
                      index === 0 && 'rounded-bl-xl',
                      index === 1 && 'rounded-br-xl'
                    )}
                    style={[
                      styles.twoButton,
                      index > 0 && { borderLeftColor: borderColor },
                      getButtonStyle(button),
                    ]}
                  >
                    <AppText
                      weight="medium"
                      className="text-center"
                      style={{ color: getButtonTextColor(button) }}
                    >
                      {button.text}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </AppView>
            ) : (
              // 多个按钮纵向排列
              <AppView className="gap-2 pb-4 px-4">
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={handleButtonPress(button)}
                    className="py-3 rounded-lg"
                    style={getButtonStyle(button)}
                  >
                    <AppText
                      weight="medium"
                      className="text-center"
                      style={{ color: getButtonTextColor(button) }}
                    >
                      {button.text}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </AppView>
            )}
          </AppView>
        </Animated.View>
      </AppView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  singleButton: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  twoButtonContainer: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  twoButton: {
    borderLeftWidth: 0.5,
  },
});
