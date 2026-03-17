import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../../form/Checkbox';
import { ThemeProvider, createTheme } from '@gaozh/rn-theme';

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
});
