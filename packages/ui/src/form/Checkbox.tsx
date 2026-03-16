import React from 'react';
import { AppPressable, AppText } from '../primitives';
import { Icon, IconSize } from '../components/Icon';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  checkedIcon?: string;
  uncheckedIcon?: string;
  size?: IconSize;
  children?: React.ReactNode;
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
      className={`flex-row items-center gap-2 ${disabled ? 'opacity-50' : ''}`}
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
