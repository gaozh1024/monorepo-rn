export interface FormGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export const toggleGroupValue = (values: string[], optionValue: string, checked: boolean) => {
  if (checked) {
    return values.includes(optionValue) ? values : [...values, optionValue];
  }

  return values.filter(value => value !== optionValue);
};

export const isGroupOptionDisabled = (groupDisabled: boolean, optionDisabled?: boolean) => {
  return groupDisabled || Boolean(optionDisabled);
};
