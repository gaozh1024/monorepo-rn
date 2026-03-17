import { AppView } from '@/ui/primitives';
import { cn } from '@/utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  testID?: string;
  /** 自定义容器样式 */
  className?: string;
  /** 自定义进度条样式 */
  barClassName?: string;
}

const sizeMap = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3', xl: 'h-4' };
const colorMap = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  testID,
  className,
  barClassName,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <AppView
      className={cn('w-full rounded-full bg-gray-200', sizeMap[size], className)}
      testID={testID}
    >
      <AppView
        className={cn('rounded-full', sizeMap[size], colorMap[color], barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </AppView>
  );
}
