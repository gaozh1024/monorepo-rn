import { useCallback } from 'react';
import { ActivityIndicator, Keyboard } from 'react-native';
import { useOptionalTheme } from '@/theme';
import { AppPressable, AppText } from '@/ui/primitives';
import { cn } from '@/utils';

/**
 * AppButton 组件属性接口
 */
export type AppButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'error'
  | 'danger'
  | 'muted';

export interface AppButtonProps {
  /** 按钮样式变体：solid(实心)、outline(描边)、ghost(透明) */
  variant?: 'solid' | 'outline' | 'ghost';
  /** 按钮尺寸：sm(小)、md(中)、lg(大) */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮颜色主题 */
  color?: AppButtonColor;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调 */
  onPress?: () => void;
  /** 点击前是否先收起键盘 */
  dismissKeyboardOnPress?: boolean;
  /** 按钮内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
}

/**
 * AppButton - 按钮组件
 *
 * 功能完善的按钮组件，支持多种样式变体、尺寸和颜色主题
 * 内置加载状态和禁用状态处理，提供统一的用户交互体验
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppButton onPress={handlePress}>确定</AppButton>
 *
 * // 不同变体
 * <AppButton variant="solid">实心按钮</AppButton>
 * <AppButton variant="outline">描边按钮</AppButton>
 * <AppButton variant="ghost">透明按钮</AppButton>
 *
 * // 不同尺寸
 * <AppButton size="sm">小按钮</AppButton>
 * <AppButton size="md">中按钮</AppButton>
 * <AppButton size="lg">大按钮</AppButton>
 *
 * // 不同颜色
 * <AppButton color="primary">主题色</AppButton>
 * <AppButton color="secondary">次要色</AppButton>
 * <AppButton color="success">成功操作</AppButton>
 * <AppButton color="warning">警告操作</AppButton>
 * <AppButton color="info">提示操作</AppButton>
 * <AppButton color="danger">危险操作</AppButton>
 *
 * // 加载状态
 * <AppButton loading>加载中</AppButton>
 *
 * // 禁用状态
 * <AppButton disabled>不可用</AppButton>
 *
 * // 组合使用
 * <AppButton
 *   variant="outline"
 *   color="danger"
 *   size="lg"
 *   onPress={handleDelete}
 * >
 *   删除账号
 * </AppButton>
 * ```
 */
export function AppButton({
  variant = 'solid',
  size = 'md',
  color = 'primary',
  loading,
  disabled,
  onPress,
  dismissKeyboardOnPress = true,
  children,
  className,
}: AppButtonProps) {
  const { theme, isDark } = useOptionalTheme();
  const isDisabled = disabled || loading;

  const sizeClasses = { sm: 'px-3 py-2', md: 'px-4 py-3', lg: 'px-6 py-4' };
  const buttonColors: Record<AppButtonColor, string> = {
    primary: theme.colors.primary?.[500] || '#f38b32',
    secondary: theme.colors.secondary?.[500] || '#3b82f6',
    success: theme.colors.success?.[500] || '#22c55e',
    warning: theme.colors.warning?.[500] || '#f59e0b',
    info: theme.colors.info?.[500] || theme.colors.secondary?.[500] || '#3b82f6',
    error: theme.colors.error?.[500] || '#ef4444',
    danger: theme.colors.error?.[500] || '#ef4444',
    muted: isDark ? '#6b7280' : '#9ca3af',
  };
  const ghostTextColor = isDark ? '#ffffff' : theme.colors.text?.[500] || '#1f2937';
  const ghostBackgroundColor = isDark ? 'rgba(255,255,255,0.04)' : 'transparent';

  // 根据变体设置 loading 指示器颜色
  // solid: 白色（因为背景是彩色的）
  // outline/ghost: 对应主题色（因为背景是透明的）
  const loadingColor = variant === 'solid' ? 'white' : buttonColors[color];
  const textColor =
    variant === 'solid' ? '#ffffff' : variant === 'ghost' ? ghostTextColor : buttonColors[color];

  const handlePress = useCallback(() => {
    if (dismissKeyboardOnPress) {
      Keyboard.dismiss();
    }

    onPress?.();
  }, [dismissKeyboardOnPress, onPress]);

  const buttonStyle =
    variant === 'solid'
      ? { backgroundColor: buttonColors[color] }
      : variant === 'outline'
        ? { borderWidth: 0.5, borderColor: buttonColors[color], backgroundColor: 'transparent' }
        : { backgroundColor: ghostBackgroundColor };

  return (
    <AppPressable
      onPress={onPress ? handlePress : undefined}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-lg',
        sizeClasses[size],
        isDisabled && 'opacity-50',
        className
      )}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <AppText weight="semibold" style={{ color: textColor }}>
          {children}
        </AppText>
      )}
    </AppPressable>
  );
}
