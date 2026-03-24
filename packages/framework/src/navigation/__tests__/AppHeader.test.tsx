import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';
import { AppHeader } from '../components/AppHeader';
import { AppScreen } from '@/ui/layout/SafeScreen';

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 10,
    bottom: 20,
    left: 0,
    right: 0,
  }),
}));

vi.mock('@/overlay', () => ({
  AppFocusedStatusBar: () => null,
}));

const theme = {
  colors: {
    primary: { 500: '#f38b32' },
    background: { 500: '#ffffff' },
    card: { 500: '#ffffff' },
    text: { 500: '#171717' },
    textMuted: { 500: '#737373' },
    border: { 500: '#e5e7eb' },
  },
};

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style;
}

describe('AppHeader', () => {
  it('在 AppScreen 默认 top=false 时应由 Header 自己补顶部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen>
          <AppHeader testID="header" title="标题" />
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('header').props.style);

    expect(flattened.paddingTop).toBe(10);
  });

  it('即使父级 Screen 已处理 top inset，Header 默认仍保持自己的顶部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen top>
          <AppHeader testID="header" title="标题" />
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('header').props.style);

    expect(flattened.paddingTop).toBe(10);
  });

  it('显式传入 safeArea=false 时应关闭 Header 顶部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen>
          <AppHeader testID="header" title="标题" safeArea={false} />
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('header').props.style);

    expect(flattened.paddingTop).toBe(0);
  });
});
