import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Radio } from '../../form/Radio';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Radio', () => {
  it('应该渲染未选中状态', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Radio testID="radio" checked={false} />
      </ThemeProvider>
    );
    expect(getByTestId('radio')).toBeTruthy();
  });

  it('应该触发点击事件', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Radio testID="radio" checked={false} onChange={onChange} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('radio'));
    expect(onChange).toHaveBeenCalled();
  });

  it('应该渲染标签', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Radio checked={false}>选项A</Radio>
      </ThemeProvider>
    );
    expect(getByText('选项A')).toBeTruthy();
  });

  it('应该支持基础快捷参数', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Radio testID="radio" checked={false} px={6} rounded="full" bg="primary-500" />
      </ThemeProvider>
    );

    const flattened = StyleSheet.flatten(getByTestId('radio').props.style);

    expect(flattened).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingLeft: 6,
          paddingRight: 6,
        }),
        expect.objectContaining({
          borderRadius: 9999,
        }),
        expect.objectContaining({
          backgroundColor: '#f38b32',
        }),
      ])
    );
  });
});
