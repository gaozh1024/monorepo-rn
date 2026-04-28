import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';
import { Select } from '../../form/Select.web';
import { Picker } from '../../form/Picker.web';
import { DatePicker } from '../../form/DatePicker.web';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    secondary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#ffffff',
    card: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
  },
};

function withTheme(children: React.ReactNode) {
  return <ThemeProvider light={lightTheme}>{children}</ThemeProvider>;
}

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style;
}

describe('form Web variants', () => {
  it('Select.web supports single select and clear', () => {
    const onChange = vi.fn();
    const { getByTestId, queryByTestId } = render(
      withTheme(
        <Select
          value="a"
          onChange={onChange}
          options={[
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ]}
        />
      )
    );

    const triggerStyle = flattenStyle(getByTestId('select-trigger').props.style);
    expect(triggerStyle).toMatchObject({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 12,
    });

    expect(flattenStyle(getByTestId('select-clear').props.style)).toMatchObject({
      marginRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      paddingRight: 4,
    });

    fireEvent.press(getByTestId('select-clear'));
    expect(onChange).toHaveBeenCalledWith('');
    expect(queryByTestId('bottom-sheet-backdrop')).toBeNull();

    fireEvent.press(getByTestId('select-trigger'));
    expect(flattenStyle(getByTestId('select-option-b').props.style)).toMatchObject({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
    });
    fireEvent.press(getByTestId('select-option-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('Select.web supports multiple selection and search', () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    const { getByTestId, queryByTestId } = render(
      withTheme(
        <Select
          multiple
          searchable
          value={['a']}
          onChange={onChange}
          onSearch={onSearch}
          options={[
            { label: 'Alpha', value: 'a' },
            { label: 'Beta', value: 'b' },
          ]}
        />
      )
    );

    fireEvent.press(getByTestId('select-trigger'));
    expect(flattenStyle(getByTestId('select-close').props.style)).toMatchObject({
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      paddingRight: 4,
    });
    fireEvent.changeText(getByTestId('select-search-input'), 'bet');
    expect(onSearch).toHaveBeenCalledWith('bet');
    expect(getByTestId('select-options')).toBeTruthy();
    expect(queryByTestId('select-option-a')).toBeNull();
    fireEvent.press(getByTestId('select-option-b'));
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('Picker.web supports temp selection, cancel and confirm', () => {
    const onChange = vi.fn();
    const onTempChange = vi.fn();
    const { getByTestId } = render(
      withTheme(
        <Picker
          value={['red']}
          onChange={onChange}
          onTempChange={onTempChange}
          columns={[
            {
              key: 'color',
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Blue', value: 'blue' },
              ],
            },
          ]}
        />
      )
    );

    fireEvent.press(getByTestId('picker-trigger'));
    expect(flattenStyle(getByTestId('picker-trigger').props.style)).toMatchObject({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 12,
    });
    expect(flattenStyle(getByTestId('picker-confirm').props.style)).toMatchObject({
      paddingTop: 4,
      paddingBottom: 4,
    });
    fireEvent.press(getByTestId('picker-option-0-blue'));
    expect(getByTestId('picker-column-color')).toBeTruthy();
    expect(onTempChange).toHaveBeenLastCalledWith(['blue']);
    fireEvent.press(getByTestId('picker-confirm'));
    expect(onChange).toHaveBeenCalledWith(['blue']);
  });

  it('Picker.web does not select disabled options', () => {
    const onTempChange = vi.fn();
    const { getByTestId } = render(
      withTheme(
        <Picker
          value={['red']}
          onTempChange={onTempChange}
          columns={[
            {
              key: 'color',
              options: [
                { label: 'Red', value: 'red' },
                { label: 'Blue', value: 'blue', disabled: true },
              ],
            },
          ]}
        />
      )
    );

    fireEvent.press(getByTestId('picker-trigger'));
    fireEvent.press(getByTestId('picker-option-0-blue'));
    expect(onTempChange).toHaveBeenCalledTimes(1);
  });

  it('DatePicker.web respects min/max date options and quick actions', () => {
    const onChange = vi.fn();
    const minDate = new Date(2024, 0, 1);
    const maxDate = new Date(2024, 0, 31);
    const { getByTestId } = render(
      withTheme(
        <DatePicker
          value={new Date(2024, 0, 2)}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
        />
      )
    );

    fireEvent.press(getByTestId('picker-trigger'));
    fireEvent.press(getByTestId('date-picker-quick-最早'));
    expect(flattenStyle(getByTestId('date-picker-quick-最早').props.style)).toMatchObject({
      flex: 1,
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 12,
    });
    fireEvent.press(getByTestId('picker-confirm'));
    expect(onChange).toHaveBeenCalledWith(minDate);
  });
});
