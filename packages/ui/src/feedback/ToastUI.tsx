import { AppView, AppText } from '../primitives';
import { cn } from '@gaozh1024/rn-utils';

export interface ToastUIProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible?: boolean;
}

const typeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export function ToastUI({ message, type = 'info', visible = true }: ToastUIProps) {
  if (!visible) return null;
  return (
    <AppView className={cn('px-4 py-3 rounded-lg', typeStyles[type])}>
      <AppText color="white">{message}</AppText>
    </AppView>
  );
}
