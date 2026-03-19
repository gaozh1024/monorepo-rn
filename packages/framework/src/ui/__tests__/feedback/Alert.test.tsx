import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Alert } from '../../feedback/Alert';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Alert', () => {
  it('应该显示标题', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Alert title="Warning" visible buttons={[{ text: '确定' }]} />
      </ThemeProvider>
    );
    expect(getByText('Warning')).toBeTruthy();
  });

  it('应该显示消息', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Alert title="Title" message="Details" visible buttons={[{ text: '确定' }]} />
      </ThemeProvider>
    );
    expect(getByText('Details')).toBeTruthy();
  });

  it('应该渲染确认按钮', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Alert title="Confirm" visible buttons={[{ text: '确认' }]} />
      </ThemeProvider>
    );
    expect(getByText('确认')).toBeTruthy();
  });

  it('应该渲染多个按钮', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <Alert
          title="Multi"
          visible
          buttons={[{ text: '取消', style: 'cancel' }, { text: '确定' }]}
        />
      </ThemeProvider>
    );
    expect(getByText('取消')).toBeTruthy();
    expect(getByText('确定')).toBeTruthy();
  });
});
