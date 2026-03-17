import { AppView } from '../primitives';
import { cn } from '@gaozh/rn-utils';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  testID?: string;
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
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <AppView className={cn('w-full rounded-full bg-gray-200', sizeMap[size])} testID={testID}>
      <AppView
        className={cn('rounded-full', sizeMap[size], colorMap[color])}
        style={{ width: `${percentage}%` }}
      />
    </AppView>
  );
}
