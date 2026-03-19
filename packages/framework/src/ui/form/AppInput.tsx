import { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
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
    const { isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    // 主题颜色
    const bgColor = isDark ? '#1f2937' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#1f2937';
    const placeholderColor = isDark ? '#6b7280' : '#9ca3af';
    const labelColor = isDark ? '#d1d5db' : '#374151';
    const errorColor = '#ef4444';

    // 边框颜色
    const getBorderColor = () => {
      if (error) return errorColor;
      if (isFocused) return '#f38b32'; // primary-500
      return isDark ? '#4b5563' : '#d1d5db';
    };

    return (
      <AppView className={cn('flex-col gap-1', className)}>
        {label && (
          <AppText size="sm" weight="medium" style={{ color: labelColor }}>
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
              backgroundColor: bgColor,
              borderColor: getBorderColor(),
              opacity: disabled ? 0.6 : 1,
            },
          ]}
        >
          {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            className="flex-1 py-3 text-base"
            style={[styles.input, { color: textColor }, style]}
            placeholderTextColor={placeholderColor}
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
