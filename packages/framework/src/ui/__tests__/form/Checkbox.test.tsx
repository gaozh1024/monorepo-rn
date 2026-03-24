import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../../form/Checkbox';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Checkbox', () => {
  it('应该渲染未选中状态', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Checkbox testID="checkbox" checked={false} onChange={() => {}} />
      </ThemeProvider>
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('应该切换选中状态', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Checkbox testID="checkbox" checked={false} onChange={onChange} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('应该禁用交互', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Checkbox testID="checkbox" checked={false} onChange={onChange} disabled />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('应该渲染标签', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Checkbox checked={false} onChange={() => {}}>
          同意协议
        </Checkbox>
      </ThemeProvider>
    );
    expect(getByText('同意协议')).toBeTruthy();
  });

  it('应该支持基础快捷参数', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Checkbox testID="checkbox" checked={false} p={4} w={120} rounded="lg" bg="primary-500" />
      </ThemeProvider>
    );

    const flattened = StyleSheet.flatten(getByTestId('checkbox').props.style);

    expect(flattened).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingTop: 4,
          paddingRight: 4,
        }),
        expect.objectContaining({
          width: 120,
        }),
        expect.objectContaining({
          borderRadius: 12,
        }),
        expect.objectContaining({
          backgroundColor: '#f38b32',
        }),
      ])
    );
  });
});
