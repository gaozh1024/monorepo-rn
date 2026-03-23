import { describe, it, expect } from 'vitest';
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../provider';
import { useThemeColors } from '../tokens';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    background: '#ffffff',
    card: '#ffffff',
    text: '#171717',
    border: '#e5e5e5',
  },
};

const darkTheme = {
  colors: {
    primary: '#f38b32',
    background: '#0a0a0a',
    card: '#111827',
    text: '#f5f5f5',
    border: '#374151',
  },
};

function ThemeColorProbe() {
  const colors = useThemeColors();

  return (
    <Text>
      {`${colors.background}|${colors.card}|${colors.text}|${colors.error}|${colors.success}|${colors.warning}|${colors.info}|${colors.muted}`}
    </Text>
  );
}

describe('useThemeColors', () => {
  it('主题切换后应返回新的颜色 token', () => {
    const { getByText, rerender } = render(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark={false}>
        <ThemeColorProbe />
      </ThemeProvider>
    );

    expect(
      getByText('#ffffff|#ffffff|#171717|#ef4444|#22c55e|#f59e0b|#3b82f6|#6b7280')
    ).toBeTruthy();

    rerender(
      <ThemeProvider light={lightTheme} dark={darkTheme} isDark>
        <ThemeColorProbe />
      </ThemeProvider>
    );

    expect(
      getByText('#0a0a0a|#111827|#f5f5f5|#ef4444|#22c55e|#f59e0b|#3b82f6|#9ca3af')
    ).toBeTruthy();
  });
});
