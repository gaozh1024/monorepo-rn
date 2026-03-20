import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../../primitives/AppText';
import { ThemeProvider } from '@/theme';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    text: '#171717',
    card: '#ffffff',
    border: '#e5e5e5',
  },
};

const darkTheme = {
  colors: {
    primary: '#f38b32',
    text: '#f5f5f5',
    card: '#111827',
    border: '#374151',
  },
};

describe('AppText', () => {
  it('应该正确渲染文本', () => {
    const { getByText } = render(<AppText>Hello</AppText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('应该应用size样式', () => {
    const { getByText } = render(<AppText size="lg">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.className).toContain('text-lg');
  });

  it('应该应用weight样式', () => {
    const { getByText } = render(<AppText weight="bold">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.className).toContain('font-bold');
  });

  it('应该应用color样式', () => {
    const { getByText } = render(<AppText color="primary-500">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.style[0].color).toBe('#f38b32');
  });

  it('应该合并多个样式', () => {
    const { getByText } = render(
      <AppText size="xl" weight="semibold" color="red-500">
        Text
      </AppText>
    );
    const text = getByText('Text');
    expect(text.props.className).toContain('text-xl');
    expect(text.props.className).toContain('font-semibold');
    expect(text.props.className).toContain('text-red-500');
  });

  it('应该支持语义化文字色', () => {
    const { getByText } = render(<AppText tone="muted">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.style[0].color).toBe('#6b7280');
  });

  it('未指定 tone/color 时应默认使用主题文字色', () => {
    const { getByText } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme}>
        <AppText>Text</AppText>
      </ThemeProvider>
    );

    expect(getByText('Text').props.style[0].color).toBe('#171717');
  });

  it('切换主题后默认文字色应自动更新', () => {
    const { getByText, rerender } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark={false}>
        <AppText>Text</AppText>
      </ThemeProvider>
    );

    expect(getByText('Text').props.style[0].color).toBe('#171717');

    rerender(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark>
        <AppText>Text</AppText>
      </ThemeProvider>
    );

    expect(getByText('Text').props.style[0].color).toBe('#f5f5f5');
  });

  it('显式 className 文字色不应被默认主题色覆盖', () => {
    const { getByText } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme}>
        <AppText className="text-white">Text</AppText>
      </ThemeProvider>
    );

    const text = getByText('Text');
    expect(text.props.className).toContain('text-white');
    expect(text.props.style[0]).toBeUndefined();
  });
});
