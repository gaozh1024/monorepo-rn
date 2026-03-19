import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

/**
 * Radio 组件属性接口
 */
export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  testID?: string;
}

/**
 * Radio - 单选框组件，支持浅色/深色主题
 */
export function Radio({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  children,
  className,
  testID,
}: RadioProps) {
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
        className={cn('w-5 h-5 rounded-full items-center justify-center', isChecked && 'border-2')}
        style={[
          styles.radio,
          {
            backgroundColor: colors.card,
            borderColor: isChecked ? colors.primary : colors.border,
            borderWidth: isChecked ? 0.5 : 0.5,
          },
        ]}
      >
        {isChecked && (
          <AppView
            className="rounded-full"
            style={[styles.inner, { backgroundColor: colors.primary }]}
          />
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
  radio: {
    borderWidth: 0.5,
  },
  inner: {
    width: 10,
    height: 10,
  },
});
