import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationProvider } from '../provider';
import { ThemeProvider, createTheme } from '@gaozh/rn-theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('NavigationProvider', () => {
  it('应该正确渲染', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <NavigationProvider>
          <div testID="child">Child</div>
        </NavigationProvider>
      </ThemeProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });
});
