import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Icon } from '../../display/Icon';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Icon', () => {
  it('应该渲染图标', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Icon testID="icon" name="home" />
      </ThemeProvider>
    );
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('应该支持点击', () => {
    const onPress = vi.fn();
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Icon testID="icon" name="home" onPress={onPress} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('icon'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该支持数字尺寸', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Icon testID="icon" name="home" size={32} />
      </ThemeProvider>
    );
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('应该支持预设尺寸', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Icon testID="icon" name="home" size="lg" />
      </ThemeProvider>
    );
    expect(getByTestId('icon')).toBeTruthy();
  });
});
