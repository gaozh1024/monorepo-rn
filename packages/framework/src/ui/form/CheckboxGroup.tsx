import { AppView } from '@/ui/primitives';
import { Checkbox } from './Checkbox';
import { isGroupOptionDisabled, toggleGroupValue, type FormGroupOption } from './group';

export interface CheckboxGroupProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: FormGroupOption[];
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
    onChange(toggleGroupValue(value, optionValue, checked));
  };

  const isRow = direction === 'row';

  return (
    <AppView row={isRow} flex={isRow} gap={4}>
      {options.map(option => (
        <Checkbox
          key={option.value}
          checked={value.includes(option.value)}
          onChange={checked => handleChange(option.value, checked)}
          disabled={isGroupOptionDisabled(disabled, option.disabled)}
        >
          {option.label}
        </Checkbox>
      ))}
    </AppView>
  );
}
