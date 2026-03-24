import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { AppPressable, AppView } from '@/ui/primitives';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';
import { type CommonLayoutProps, resolveRoundedStyle } from '../utils/layout-shortcuts';

/**
 * Switch 组件属性接口
 */
export interface SwitchProps extends Pick<
  CommonLayoutProps,
  'flex' | 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr' | 'rounded'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
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
 * Switch - 开关组件，支持浅色/深色主题
 */
export function Switch({
  flex,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  rounded,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  className,
  testID,
  style,
}: SwitchProps) {
  const colors = useThemeColors();
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const [isInteractionLocked, setIsInteractionLocked] = useState(false);
  const isFirstRender = useRef(true);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isChecked = checked !== undefined ? checked : internalChecked;

  // 尺寸配置
  const sizes = {
    sm: { width: 36, height: 20, thumb: 16, padding: 2 },
    md: { width: 48, height: 26, thumb: 22, padding: 2 },
    lg: { width: 60, height: 32, thumb: 28, padding: 2 },
  };

  const config = sizes[size];
  const maxTranslateX = config.width - config.thumb - config.padding * 2;
  const thumbTranslateX = useRef(createAnimatedValue(isChecked ? maxTranslateX : 0)).current;

  const clearUnlockTimer = () => {
    if (!unlockTimerRef.current) return;
    clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = null;
  };

  const animateThumb = (nextChecked: boolean, shouldUnlock = true) => {
    Animated.timing(thumbTranslateX, {
      toValue: nextChecked ? maxTranslateX : 0,
      duration: 180,
      useNativeDriver: true,
    }).start(result => {
      if (result?.finished ?? true) {
        thumbTranslateX.setValue(nextChecked ? maxTranslateX : 0);
      }
      if (shouldUnlock) {
        clearUnlockTimer();
        setIsInteractionLocked(false);
      }
    });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      thumbTranslateX.setValue(isChecked ? maxTranslateX : 0);
      isFirstRender.current = false;
      return;
    }

    animateThumb(isChecked);
  }, [isChecked, maxTranslateX, thumbTranslateX]);

  useEffect(() => {
    return () => {
      clearUnlockTimer();
    };
  }, []);

  const toggle = () => {
    if (disabled || isInteractionLocked) return;

    const newChecked = !isChecked;

    setIsInteractionLocked(true);

    if (checked === undefined) {
      setInternalChecked(newChecked);
    } else {
      animateThumb(newChecked, false);
      unlockTimerRef.current = setTimeout(() => {
        unlockTimerRef.current = null;
        setIsInteractionLocked(false);
      }, 220);
    }

    onChange?.(newChecked);
  };

  const trackBackgroundColor = disabled
    ? isChecked
      ? colors.primarySurface
      : colors.divider
    : isChecked
      ? colors.primary
      : colors.divider;

  const trackBorderColor = disabled
    ? isChecked
      ? colors.primarySurface
      : colors.border
    : isChecked
      ? colors.primary
      : colors.border;

  const thumbBackgroundColor = disabled ? colors.card : colors.textInverse;

  return (
    <AppPressable
      flex={flex}
      m={m}
      mx={mx}
      my={my}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      onPress={toggle}
      disabled={disabled || isInteractionLocked}
      className={cn(className)}
      testID={testID}
    >
      <AppView
        className={cn(rounded === undefined && 'rounded-full')}
        style={[
          styles.track,
          resolveRoundedStyle(rounded ?? 'full'),
          {
            width: config.width,
            height: config.height,
            backgroundColor: trackBackgroundColor,
            borderColor: trackBorderColor,
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: config.thumb,
              height: config.thumb,
              borderRadius: config.thumb / 2,
              backgroundColor: thumbBackgroundColor,
              transform: [{ translateX: thumbTranslateX }],
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.25,
              shadowRadius: 1,
            },
          ]}
        />
      </AppView>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    padding: 2,
    borderWidth: 0.5,
  },
  thumb: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});
