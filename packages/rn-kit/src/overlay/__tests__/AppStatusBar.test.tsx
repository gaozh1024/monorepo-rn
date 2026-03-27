import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';
import { AppStatusBar } from '../AppStatusBar';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    background: '#ffffff',
  },
};

const darkTheme = {
  colors: {
    primary: '#f38b32',
    background: '#0a0a0a',
  },
};

describe('AppStatusBar', () => {
  it('应该在亮色主题下自动使用 dark-content', () => {
    const { getAllByTestId } = render(
      <ThemeProvider light={lightTheme}>
        <AppStatusBar testID="status-bar" />
      </ThemeProvider>
    );

    const statusBar = getAllByTestId('status-bar')[0];
    expect(statusBar.props.barStyle).toBe('dark-content');
    expect(statusBar.props.backgroundColor).toBe('transparent');
    expect(statusBar.props.translucent).toBe(true);
  });

  it('应该在暗色主题下自动使用 light-content', () => {
    const { getAllByTestId } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme} defaultDark>
        <AppStatusBar testID="status-bar" />
      </ThemeProvider>
    );

    const statusBar = getAllByTestId('status-bar')[0];
    expect(statusBar.props.barStyle).toBe('light-content');
    expect(statusBar.props.backgroundColor).toBe('transparent');
    expect(statusBar.props.translucent).toBe(true);
  });

  it('应该支持自定义状态栏配置', () => {
    const { getAllByTestId } = render(
      <ThemeProvider light={lightTheme}>
        <AppStatusBar
          testID="status-bar"
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
      </ThemeProvider>
    );

    const statusBar = getAllByTestId('status-bar')[0];
    expect(statusBar.props.barStyle).toBe('light-content');
    expect(statusBar.props.backgroundColor).toBe('transparent');
    expect(statusBar.props.translucent).toBe(true);
  });
});
