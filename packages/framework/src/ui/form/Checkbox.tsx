import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppView, AppText, AppPressable } from '@/ui/primitives';
import { Icon } from '@/ui/display';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';
import type { ToggleMotionProps } from '../motion';
import { useToggleMotion } from '../motion/hooks/useToggleMotion';
import { type CommonLayoutProps, type LayoutSurface } from '../utils/layout-shortcuts';

export interface CheckboxProps
  extends
    Pick<
      CommonLayoutProps,
      | 'flex'
      | 'p'
      | 'px'
      | 'py'
      | 'pt'
      | 'pb'
      | 'pl'
      | 'pr'
      | 'm'
      | 'mx'
      | 'my'
      | 'mt'
      | 'mb'
      | 'ml'
      | 'mr'
      | 'gap'
      | 'rounded'
      | 'w'
      | 'h'
      | 'minW'
      | 'minH'
      | 'maxW'
      | 'maxH'
    >,
    ToggleMotionProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  bg?: string;
  surface?: LayoutSurface;
  testID?: string;
}

export function Checkbox({
  flex,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  children,
  className,
  bg,
  surface,
  testID,
  motionDuration,
  motionReduceMotion,
}: CheckboxProps) {
  const colors = useThemeColors();
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const toggleMotion = useToggleMotion({
    value: isChecked,
    preset: 'checkbox',
    duration: motionDuration,
    reduceMotion: motionReduceMotion,
  });

  const toggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  const disabledOpacity = 0.4;

  return (
    <AppPressable
      flex={flex}
      row
      items="center"
      p={p}
      px={px}
      py={py}
      pt={pt}
      pb={pb}
      pl={pl}
      pr={pr}
      m={m}
      mx={mx}
      my={my}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      gap={gap ?? 8}
      rounded={rounded}
      w={w}
      h={h}
      minW={minW}
      minH={minH}
      maxW={maxW}
      maxH={maxH}
      bg={bg}
      surface={surface}
      onPress={toggle}
      disabled={disabled}
      className={cn(className)}
      style={disabled ? { opacity: disabledOpacity } : undefined}
      testID={testID}
    >
      <AppView
        className={cn(
          'w-5 h-5 rounded items-center justify-center',
          isChecked ? 'bg-primary-500' : 'bg-white border'
        )}
        style={[
          styles.checkbox,
          {
            backgroundColor: isChecked ? colors.primary : colors.cardElevated,
            borderColor: isChecked ? colors.primary : colors.border,
          },
        ]}
      >
        {isChecked && (
          <Animated.View
            pointerEvents="none"
            style={[styles.iconContainer, toggleMotion.indicatorStyle]}
            testID={`${testID}-icon`}
          >
            <Icon name="check" size={14} color="white" style={styles.icon} />
          </Animated.View>
        )}
      </AppView>
      {children && (
        <AppText size="sm" style={{ color: colors.text }}>
          {children}
        </AppText>
      )}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 0.5,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
