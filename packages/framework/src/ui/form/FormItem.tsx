import { AppView, AppText } from '@/ui/primitives';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

export interface FormItemProps {
  name: string;
  label?: string;
  error?: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
  /** 自定义样式 */
  className?: string;
  /** 标签样式 */
  labelClassName?: string;
}

export function FormItem({
  name: _name,
  label,
  error,
  help,
  required,
  children,
  className,
  labelClassName,
}: FormItemProps) {
  const colors = useThemeColors();

  return (
    <AppView className={cn('mb-4', className)}>
      {label && (
        <AppView row items="center" gap={1} className={cn('mb-2', labelClassName)}>
          <AppText size="sm" weight="medium" style={{ color: colors.textSecondary }}>
            {label}
          </AppText>
          {required && <AppText color="error-500">*</AppText>}
        </AppView>
      )}
      {children}
      {error && (
        <AppText size="sm" color="error-500" className="mt-1">
          {error}
        </AppText>
      )}
      {help && !error && (
        <AppText size="sm" className="mt-1" style={{ color: colors.textMuted }}>
          {help}
        </AppText>
      )}
    </AppView>
  );
}
