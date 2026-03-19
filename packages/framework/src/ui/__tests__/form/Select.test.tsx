import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Select } from '../../form/Select';
import { renderWithTheme } from './test-utils';

const options = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
];

describe('Select', () => {
  it('应该支持单选', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <Select placeholder="请选择城市" options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('请选择城市'));
    fireEvent.press(getByText('北京'));

    expect(onChange).toHaveBeenCalledWith('beijing');
  });

  it('应该支持搜索过滤', () => {
    const onSearch = vi.fn();
    const { getByText, getByPlaceholderText, queryByText } = renderWithTheme(
      <Select placeholder="搜索城市" options={options} searchable onSearch={onSearch} />
    );

    fireEvent.press(getByText('搜索城市'));
    fireEvent.changeText(getByPlaceholderText('搜索...'), '深');

    expect(onSearch).toHaveBeenCalledWith('深');
    expect(getByText('深圳')).toBeTruthy();
    expect(queryByText('北京')).toBeNull();
  });

  it('应该支持多选', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <Select multiple value={['beijing']} options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('北京'));
    expect(getByText('已选择 1 项')).toBeTruthy();

    fireEvent.press(getByText('上海'));

    expect(onChange).toHaveBeenCalledWith(['beijing', 'shanghai']);
  });
});
