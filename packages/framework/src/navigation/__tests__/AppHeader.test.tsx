import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
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

  it('应该支持透传可折叠头部动画样式', () => {
    let tree: ReturnType<typeof create>;

    act(() => {
      tree = create(
        <ThemeProvider light={theme}>
          <AppHeader
            testID="header"
            title="标题"
            collapsibleMotion={{
              headerStyle: { height: 72 },
              backgroundStyle: { opacity: 0.35 },
              titleStyle: { opacity: 0.9, transform: [{ scale: 1.04 }] },
            }}
          />
        </ThemeProvider>
      );
    });

    const nodes = tree!.root.findAll(node => typeof node.props?.testID === 'string');
    const navNode = nodes.find(node => node.props.testID === 'header-nav');
    const backgroundNode = nodes.find(node => node.props.testID === 'header-background');
    const titleWrapNode = nodes.find(node => node.props.testID === 'header-title-wrap');

    expect(navNode).toBeTruthy();
    expect(backgroundNode).toBeTruthy();
    expect(titleWrapNode).toBeTruthy();

    expect(flattenStyle(navNode!.props.style)).toMatchObject({
      height: 72,
    });
    expect(flattenStyle(backgroundNode!.props.style)).toMatchObject({
      opacity: 0.35,
    });
    expect(flattenStyle(titleWrapNode!.props.style)).toMatchObject({
      opacity: 0.9,
      transform: [{ scale: 1.04 }],
    });
  });
});
