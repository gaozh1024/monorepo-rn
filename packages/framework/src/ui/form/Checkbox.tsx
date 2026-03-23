import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { Icon } from '@/ui/display';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

/**
 * Checkbox 组件属性接口
 */
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  testID?: string;
}

/**
 * Checkbox - 复选框组件，支持浅色/深色主题
 */
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  children,
  className,
  testID,
}: CheckboxProps) {
  const colors = useThemeColors();
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  // 主题颜色
  const disabledOpacity = 0.4;

  return (
    <TouchableOpacity
      onPress={toggle}
      disabled={disabled}
      className={cn('flex-row items-center gap-2', className)}
      style={disabled ? { opacity: disabledOpacity } : undefined}
      testID={testID}
      activeOpacity={0.7}
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
          <AppView pointerEvents="none" style={styles.iconContainer} testID={`${testID}-icon`}>
            <Icon name="check" size={14} color="white" style={styles.icon} />
          </AppView>
        )}
      </AppView>
      {children && (
        <AppText size="sm" style={{ color: colors.text }}>
          {children}
        </AppText>
      )}
    </TouchableOpacity>
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
