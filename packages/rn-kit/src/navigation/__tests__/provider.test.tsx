import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationProvider } from '../provider';
import { ThemeProvider, createTheme } from '@/theme';
import { View, Text } from 'react-native';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('NavigationProvider', () => {
  it('应该正确渲染', () => {
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <NavigationProvider>
          <View testID="child">
            <Text>Child</Text>
          </View>
        </NavigationProvider>
      </ThemeProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });
});
