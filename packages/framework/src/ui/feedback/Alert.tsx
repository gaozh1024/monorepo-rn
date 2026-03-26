import { useCallback } from 'react';
import { Modal, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';
import { useMotionConfig, type PresenceMotionProps } from '../motion';
import { usePresenceMotion } from '../motion/hooks/usePresenceMotion';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertProps extends PresenceMotionProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  onClose?: () => void;
}

export function Alert({
  visible,
  title,
  message,
  buttons,
  onClose,
  motionPreset,
  motionDuration,
  motionEnterDuration,
  motionExitDuration,
  motionDistance,
  motionReduceMotion,
}: AlertProps) {
  const { theme, isDark } = useTheme();
  const motionConfig = useMotionConfig();
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

  const modalBgColor = isDark ? '#1f2937' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const messageColor = isDark ? '#9ca3af' : '#6b7280';
  const borderColor = isDark ? '#374151' : '#e5e7eb';
  const cancelButtonBg = isDark ? '#374151' : '#f3f4f6';
  const cancelButtonText = isDark ? '#ffffff' : '#374151';
  const destructiveColor = theme.colors.error?.[500] || '#ef4444';

  const handleButtonPress = useCallback(
    (button: AlertButton) => (e: GestureResponderEvent) => {
      e.stopPropagation();
      button.onPress?.();
      onClose?.();
    },
    [onClose]
  );

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

  const getButtonTextColor = (button: AlertButton) => {
    if (button.style === 'destructive') {
      return destructiveColor;
    }
    if (button.style === 'cancel') {
      return cancelButtonText;
    }
    return '#ffffff';
  };

  if (!presence.mounted) return null;

  return (
    <Modal
      visible={presence.mounted}
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
            },
            presence.overlayAnimatedStyle,
          ]}
        />
        <Animated.View
          className="rounded-xl mx-8 min-w-[280px]"
          style={[{ backgroundColor: modalBgColor }, presence.animatedStyle]}
        >
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

          <AppView className="border-t" style={{ borderTopColor: borderColor }}>
            {buttons.length === 1 ? (
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
