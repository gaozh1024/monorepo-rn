import { vi } from 'vitest';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AppScreen, SafeScreen } from '../../layout/SafeScreen';
import { ThemeProvider } from '@/theme';

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 10,
    bottom: 20,
    left: 0,
    right: 0,
  }),
}));

const theme = {
  colors: {
    primary: { 500: '#f38b32' },
    background: { 500: '#ffffff' },
    card: { 500: '#ffffff' },
    text: { 500: '#171717' },
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

describe('AppScreen', () => {
  it('开启 dismissKeyboardOnPressOutside 时应包裹点击收键盘逻辑', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <AppScreen dismissKeyboardOnPressOutside>
            <div>content</div>
          </AppScreen>
        </ThemeProvider>
      );
    });

    const dismissWrapper = renderer!.root.findByType(TouchableWithoutFeedback);

    act(() => {
      dismissWrapper.props.onPress();
    });

    expect(Keyboard.dismiss).toHaveBeenCalled();
  });

  it('应该支持统一快捷参数并保留安全区内边距合并能力', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen testID="screen" p={4} pt={6} rounded="lg" gap={3}>
          <div>content</div>
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('screen').props.style);

    expect(flattened.paddingTop).toBe(6);
    expect(flattened.paddingBottom).toBe(24);
    expect(flattened.paddingLeft).toBe(4);
    expect(flattened.paddingRight).toBe(4);
    expect(flattened.borderRadius).toBe(12);
    expect(flattened.gap).toBe(3);
  });

  it('默认应该关闭顶部安全区，但保留底部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen testID="screen" p={4}>
          <div>content</div>
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('screen').props.style);

    expect(flattened.paddingTop).toBe(4);
    expect(flattened.paddingBottom).toBe(24);
  });

  it('显式传入 top 后应该重新包含顶部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <AppScreen testID="screen" p={4} top>
          <div>content</div>
        </AppScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('screen').props.style);

    expect(flattened.paddingTop).toBe(14);
    expect(flattened.paddingBottom).toBe(24);
  });
});

describe('SafeScreen', () => {
  it('默认应该保留顶部和底部安全区', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <SafeScreen testID="screen" p={4}>
          <div>content</div>
        </SafeScreen>
      </ThemeProvider>
    );

    const flattened = flattenStyle(getByTestId('screen').props.style);

    expect(flattened.paddingTop).toBe(14);
    expect(flattened.paddingBottom).toBe(24);
  });
});
