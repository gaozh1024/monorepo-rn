import { ActivityIndicator } from 'react-native';
import { AppPressable, AppText } from '@/ui/primitives';
import { cn } from '@/utils';

/**
 * AppButton 组件属性接口
 */
export interface AppButtonProps {
  /** 按钮样式变体：solid(实心)、outline(描边)、ghost(透明) */
  variant?: 'solid' | 'outline' | 'ghost';
  /** 按钮尺寸：sm(小)、md(中)、lg(大) */
  size?: 'sm' | 'md' | 'lg';
  /** 按钮颜色主题 */
  color?: 'primary' | 'secondary' | 'danger';
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调 */
  onPress?: () => void;
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
