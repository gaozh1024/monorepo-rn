import { AppView } from '@/ui/primitives';
import { Radio } from './Radio';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: Option[];
  direction?: 'row' | 'column';
  disabled?: boolean;
}

export function RadioGroup({
  value,
  onChange,
  options = [],
  direction = 'column',
  disabled = false,
}: RadioGroupProps) {
  return (
    <AppView row={direction === 'row'} flex={direction === 'row'} gap={4}>
      {options.map(option => (
        <Radio
          key={option.value}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          disabled={disabled || option.disabled}
        >
          {option.label}
        </Radio>
      ))}
    </AppView>
  );
}
