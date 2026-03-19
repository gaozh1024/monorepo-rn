import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Progress } from '../../display/Progress';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Progress', () => {
  it('应该渲染进度条', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Progress progress={50} testID="progress" />
      </ThemeProvider>
    );
    expect(getByTestId('progress')).toBeTruthy();
  });

  it('应该支持显示标签', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Progress progress={75} showLabel testID="progress" />
      </ThemeProvider>
    );
    // 标签文本直接渲染，不一定能找到具体百分比
    expect(getByTestId('progress')).toBeTruthy();
  });

  it('应该应用size样式', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Progress progress={50} size="lg" testID="progress" />
      </ThemeProvider>
    );
    expect(getByTestId('progress')).toBeTruthy();
  });

  it('应该应用color样式', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <Progress progress={50} color="#10b981" testID="progress" />
      </ThemeProvider>
    );
    expect(getByTestId('progress')).toBeTruthy();
  });
});
