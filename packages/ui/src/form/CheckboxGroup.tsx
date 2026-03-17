import { AppView } from '../primitives';
import { Checkbox } from './Checkbox';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: Option[];
  direction?: 'row' | 'column';
  disabled?: boolean;
}

export function CheckboxGroup({
  value = [],
  onChange,
  options = [],
  direction = 'column',
  disabled = false,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <AppView row={direction === 'row'} flex={direction === 'row'} gap={4}>
      {options.map(option => (
        <Checkbox
          key={option.value}
          checked={value.includes(option.value)}
          onChange={checked => handleChange(option.value, checked)}
          disabled={disabled || option.disabled}
        >
          {option.label}
        </Checkbox>
      ))}
    </AppView>
  );
}
