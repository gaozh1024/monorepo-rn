import { AppPressable, AppText } from '@/ui/primitives';
import { Icon, IconSize } from '@/ui/display';
import { cn } from '@/utils';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  checkedIcon?: string;
  uncheckedIcon?: string;
  size?: IconSize;
  children?: React.ReactNode;
  testID?: string;
  /** 自定义样式 */
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary-500',
  checkedIcon = 'check-box',
  uncheckedIcon = 'check-box-outline-blank',
  size = 'md',
  children,
  testID,
  className,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <AppPressable
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <Icon
        name={checked ? checkedIcon : uncheckedIcon}
        size={size}
        color={checked ? color : 'gray-400'}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppPressable>
  );
}
