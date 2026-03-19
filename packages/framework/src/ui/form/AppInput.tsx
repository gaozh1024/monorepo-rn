import { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

/**
 * AppInput 组件属性接口
 */
export interface AppInputProps extends Omit<TextInputProps, 'editable'> {
  /** 标签文本 */
  label?: string;
  /** 错误信息 */
  error?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 左侧图标 */
  leftIcon?: React.ReactNode;
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
  /** 自定义样式 */
  className?: string;
}

/**
 * AppInput - 输入框组件，支持浅色/深色主题
 */
export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, error, disabled = false, leftIcon, rightIcon, className, style, ...props }, ref) => {
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);

    const errorColor = '#ef4444';

    // 边框颜色
    const getBorderColor = () => {
      if (error) return errorColor;
      if (isFocused) return colors.primary;
      return colors.border;
    };

    return (
      <AppView className={cn('flex-col gap-1', className)}>
        {label && (
          <AppText size="sm" weight="medium" style={{ color: colors.textSecondary }}>
            {label}
          </AppText>
        )}
        <AppView
          row
          items="center"
          className="rounded-lg px-3"
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderColor: getBorderColor(),
              opacity: disabled ? 0.6 : 1,
            },
          ]}
        >
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            className="flex-1 py-3 text-base"
            style={[styles.input, { color: colors.text }, style]}
            placeholderTextColor={colors.textMuted}
            editable={!disabled}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </AppView>
        {error && (
          <AppText size="xs" style={{ color: errorColor }}>
            {error}
          </AppText>
        )}
      </AppView>
    );
  }
);

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 0.5,
    minHeight: 48,
  },
  input: {
    padding: 0,
    margin: 0,
  },
  icon: {
    marginHorizontal: 4,
  },
});
