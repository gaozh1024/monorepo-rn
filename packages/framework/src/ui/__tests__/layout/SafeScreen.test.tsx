import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, create } from 'react-test-renderer';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AppScreen } from '../../layout/SafeScreen';
import { ThemeProvider } from '@/theme';

const theme = {
  colors: {
    primary: { 500: '#f38b32' },
    background: { 500: '#ffffff' },
    card: { 500: '#ffffff' },
    text: { 500: '#171717' },
    border: { 500: '#e5e7eb' },
  },
};

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
});
