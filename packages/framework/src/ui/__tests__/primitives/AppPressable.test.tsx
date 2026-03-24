import { describe, it, expect } from 'vitest';
import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { AppPressable } from '../../primitives/AppPressable';
import { ThemeProvider } from '@/theme';

const lightTheme = {
  colors: {
    primary: '#f38b32',
    text: '#171717',
    card: '#ffffff',
    border: '#e5e5e5',
  },
};

describe('AppPressable', () => {
  it('应该正确渲染子元素', () => {
    const { getByText } = render(
      <AppPressable>
        <>Press me</>
      </AppPressable>
    );
    expect(getByText('Press me')).toBeTruthy();
  });

  it('应该响应onPress', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppPressable onPress={onPress}>
        <>Press me</>
      </AppPressable>
    );
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该在disabled时不响应', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppPressable onPress={onPress} disabled>
        <>Press me</>
      </AppPressable>
    );
    fireEvent.press(getByText('Press me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('应该支持基础快捷参数与语义背景', () => {
    const { getByTestId } = render(
      <ThemeProvider light={lightTheme}>
        <AppPressable testID="pressable" p={4} rounded="lg" surface="card" w={120}>
          <>Press me</>
        </AppPressable>
      </ThemeProvider>
    );

    const flattened = StyleSheet.flatten(getByTestId('pressable').props.style);

    expect(flattened).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#ffffff',
        }),
        expect.objectContaining({
          paddingTop: 4,
          paddingRight: 4,
        }),
        expect.objectContaining({
          width: 120,
        }),
        expect.objectContaining({
          borderRadius: 12,
        }),
      ])
    );
  });

  it('应该保留按下态类名与 onPressIn/onPressOut 事件', () => {
    const onPressIn = vi.fn();
    const onPressOut = vi.fn();
    const { getByTestId } = render(
      <AppPressable
        testID="pressable"
        className="bg-blue-500"
        pressedClassName="opacity-70"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <>Press me</>
      </AppPressable>
    );

    const pressable = getByTestId('pressable');

    act(() => {
      pressable.props.onPressIn?.({});
    });
    expect(onPressIn).toHaveBeenCalled();
    expect(pressable.props.className).toContain('opacity-70');

    act(() => {
      pressable.props.onPressOut?.({});
    });
    expect(onPressOut).toHaveBeenCalled();
  });
});
