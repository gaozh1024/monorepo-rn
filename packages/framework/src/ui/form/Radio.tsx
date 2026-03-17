import { AppPressable, AppText } from '@/ui/primitives';
import { Icon, IconSize } from '@/ui/display';
import { cn } from '@/utils';

export interface RadioProps {
  checked?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  size?: IconSize;
  children?: React.ReactNode;
  testID?: string;
  /** 自定义样式 */
  className?: string;
}

export function Radio({
  checked = false,
  onPress,
  disabled = false,
  color = 'primary-500',
  size = 'md',
  children,
  testID,
  className,
}: RadioProps) {
  const iconSize = typeof size === 'number' ? size * 1.2 : size;

  return (
    <AppPressable
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <Icon
        name={checked ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={iconSize}
        color={checked ? color : 'gray-400'}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppPressable>
  );
}
