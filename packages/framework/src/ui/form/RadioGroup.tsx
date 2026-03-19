import { AppView } from '@/ui/primitives';
import { Radio } from './Radio';
import { isGroupOptionDisabled, type FormGroupOption } from './group';

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: FormGroupOption[];
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
  const isRow = direction === 'row';

  return (
    <AppView row={isRow} flex={isRow} gap={4}>
      {options.map(option => (
        <Radio
          key={option.value}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          disabled={isGroupOptionDisabled(disabled, option.disabled)}
        >
          {option.label}
        </Radio>
      ))}
    </AppView>
  );
}
