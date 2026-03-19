import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { DatePicker } from '../../form/DatePicker';
import { renderWithTheme } from './test-utils';

describe('DatePicker', () => {
  it('应该渲染格式化后的日期', () => {
    const { getByText } = renderWithTheme(<DatePicker value={new Date(2024, 1, 3)} />);

    expect(getByText('2024-02-03')).toBeTruthy();
  });

  it('应该支持快捷选择最早日期', () => {
    const onChange = vi.fn();
    const minDate = new Date(2024, 0, 1);
    const { getByText } = renderWithTheme(
      <DatePicker placeholder="请选择生日" minDate={minDate} onChange={onChange} />
    );

    fireEvent.press(getByText('请选择生日'));
    expect(getByText('选择日期')).toBeTruthy();

    fireEvent.press(getByText('最早'));
    fireEvent.press(getByText('确定'));

    expect(onChange).toHaveBeenCalledWith(minDate);
  });

  it('应该在禁用时禁用触发区域', () => {
    const { getByText } = renderWithTheme(<DatePicker placeholder="请选择日期" disabled />);

    expect(getByText('请选择日期').props.disabled).toBe(true);
  });
});
