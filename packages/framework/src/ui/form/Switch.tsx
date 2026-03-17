import { Switch as RNSwitch } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  /** 自定义样式 */
  className?: string;
}

const sizeMap = {
  sm: { scale: 0.8, height: 28 },
  md: { scale: 1, height: 32 },
  lg: { scale: 1.2, height: 36 },
};

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary-500',
  size = 'md',
  children,
  className,
}: SwitchProps) {
  const { theme } = useTheme();
  const { scale } = sizeMap[size];

  const trackColor = theme.colors[color.split('-')[0]];
  const trackColorValue = trackColor?.[500] || '#f38b32';

  return (
    <AppView row items="center" gap={3} className={cn(disabled && 'opacity-50', className)}>
      <RNSwitch
        value={checked}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#d1d5db', true: trackColorValue }}
        thumbColor={checked ? trackColorValue : '#f9fafb'}
        style={{ transform: [{ scale }] }}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppView>
  );
}
