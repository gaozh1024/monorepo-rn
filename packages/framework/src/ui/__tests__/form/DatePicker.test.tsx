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

  it('应该支持自定义弹窗文案', () => {
    const { getByText } = renderWithTheme(
      <DatePicker
        placeholder="打开日期"
        pickerTitle="选择生日"
        cancelText="返回"
        confirmText="完成"
        yearLabel="年份"
        monthLabel="月份"
        dayLabel="日期"
        todayText="今日"
      />
    );

    fireEvent.press(getByText('打开日期'));
    expect(getByText('选择生日')).toBeTruthy();
    expect(getByText('返回')).toBeTruthy();
    expect(getByText('完成')).toBeTruthy();
    expect(getByText('年份')).toBeTruthy();
    expect(getByText('月份')).toBeTruthy();
    expect(getByText('日期')).toBeTruthy();
    expect(getByText('今日')).toBeTruthy();
  });
});
