import { ActivityIndicator } from 'react-native';
import { AppPressable, AppText } from '@/ui/primitives';
import { cn } from '@/utils';

/**
 * 按钮组件
 * @example
 * ```tsx
 * <AppButton onPress={handlePress}>确定</AppButton>
 * <AppButton variant="outline" color="danger">删除</AppButton>
 * ```
 */

export interface AppButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AppButton({
  variant = 'solid',
  size = 'md',
  color = 'primary',
  loading,
  disabled,
  onPress,
  children,
  className,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const sizeClasses = { sm: 'px-3 py-2', md: 'px-4 py-3', lg: 'px-6 py-4' };
  const colorClasses = {
    primary: variant === 'solid' ? 'bg-primary-500' : 'border-primary-500 text-primary-500',
    secondary: variant === 'solid' ? 'bg-secondary-500' : 'border-secondary-500 text-secondary-500',
    danger: variant === 'solid' ? 'bg-red-500' : 'border-red-500 text-red-500',
  };

  return (
    <AppPressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-lg',
        sizeClasses[size],
        variant === 'solid' && colorClasses[color],
        variant === 'outline' && `border-2 bg-transparent ${colorClasses[color]}`,
        variant === 'ghost' && 'bg-transparent',
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <AppText weight="semibold" className={variant === 'solid' ? 'text-white' : ''}>
          {children}
        </AppText>
      )}
    </AppPressable>
  );
}
