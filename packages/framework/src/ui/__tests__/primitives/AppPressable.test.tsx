import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { AppPressable } from '../../primitives/AppPressable';
import { ThemeProvider } from '@/theme';
import { resolveInteractiveStyle } from '../style-utils';

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

    const flattened = resolveInteractiveStyle(getByTestId('pressable').props.style);

    expect(flattened).toMatchObject({
      backgroundColor: '#ffffff',
      paddingTop: 4,
      paddingRight: 4,
      paddingBottom: 4,
      paddingLeft: 4,
      width: 120,
      borderRadius: 12,
    });
  });

  it('应该保留原生 style callback 语义并合并快捷参数', () => {
    const { getByTestId } = render(
      <ThemeProvider light={lightTheme}>
        <AppPressable
          testID="pressable"
          p={8}
          rounded="md"
          style={({ hovered, focused, pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            borderWidth: focused ? 2 : 0,
            borderColor: hovered ? '#f38b32' : '#e5e5e5',
          })}
        >
          <>Press me</>
        </AppPressable>
      </ThemeProvider>
    );

    const pressable = getByTestId('pressable');

    expect(typeof pressable.props.style).toBe('function');
    expect(
      resolveInteractiveStyle(pressable.props.style, {
        pressed: true,
        hovered: true,
        focused: true,
      })
    ).toMatchObject({
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      borderRadius: 8,
      opacity: 0.7,
      borderWidth: 2,
      borderColor: '#f38b32',
    });
  });

  it('应该保留按下态类名与 onPressIn/onPressOut 事件', () => {
    const onPressIn = vi.fn();
    const onPressOut = vi.fn();
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
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
    });

    const pressable = renderer!.root.findByProps({ testID: 'pressable' });

    act(() => {
      pressable.props.onPressIn?.({});
    });
    expect(onPressIn).toHaveBeenCalled();

    act(() => {
      pressable.props.onPressOut?.({});
    });
    expect(onPressOut).toHaveBeenCalled();
  });
});
