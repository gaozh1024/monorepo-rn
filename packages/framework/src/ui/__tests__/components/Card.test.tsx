import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme';
import { Card } from '../../display/Card';
import { AppText } from '../../primitives';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    card: '#ffffff',
    text: '#171717',
    border: '#e5e5e5',
  },
};

const darkTheme = {
  colors: {
    primary: '#f38b32',
    card: '#111827',
    text: '#f5f5f5',
    border: '#374151',
  },
};

describe('Card', () => {
  it('切换主题后卡片背景应自动更新', () => {
    const { getByTestId, rerender } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark={false}>
        <Card testID="card">
          <AppText>内容</AppText>
        </Card>
      </ThemeProvider>
    );

    const lightCard = getByTestId('card');
    expect(lightCard.props.style[0].backgroundColor).toBe('#ffffff');
    const lightBorderColor = lightCard.props.style[0].borderColor;

    rerender(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark>
        <Card testID="card">
          <AppText>内容</AppText>
        </Card>
      </ThemeProvider>
    );

    const darkCard = getByTestId('card');
    expect(darkCard.props.style[0].backgroundColor).toBe('#111827');
    expect(darkCard.props.style[0].borderColor).not.toBe(lightBorderColor);
  });

  it('应该支持间距快捷属性', () => {
    const { getByTestId } = render(
      <Card testID="card" p={4} px={2} py={3} gap={2}>
        <AppText>内容</AppText>
      </Card>
    );

    const card = getByTestId('card');
    expect(card.props.className).toContain('p-4');
    expect(card.props.className).toContain('px-2');
    expect(card.props.className).toContain('py-3');
    expect(card.props.className).toContain('gap-2');
  });
});
