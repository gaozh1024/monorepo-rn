import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { Switch } from '../../form/Switch';
import { AppPressable, AppView } from '../../primitives';
import { renderWithTheme } from './test-utils';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('Switch', () => {
  it('应该在非受控模式下切换状态', () => {
    vi.useFakeTimers();

    try {
      const onChange = vi.fn();
      let renderer: ReturnType<typeof create>;

      act(() => {
        renderer = create(
          <ThemeProvider light={theme}>
            <Switch testID="switch" defaultChecked={false} onChange={onChange} />
          </ThemeProvider>
        );
      });

      const pressable = renderer!.root.findByType(AppPressable);

      act(() => {
        pressable.props.onPress?.();
      });

      act(() => {
        vi.advanceTimersByTime(220);
      });

      expect(onChange).toHaveBeenCalledWith(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('应该在禁用时阻止切换', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithTheme(
      <Switch testID="switch" checked={false} onChange={onChange} disabled />
    );

    fireEvent.press(getByTestId('switch'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('应该在动画期间阻止重复点击', () => {
    vi.useFakeTimers();

    try {
      const onChange = vi.fn();
      let renderer: ReturnType<typeof create>;

      act(() => {
        renderer = create(
          <ThemeProvider light={theme}>
            <Switch testID="switch" checked={false} onChange={onChange} />
          </ThemeProvider>
        );
      });

      const pressable = renderer!.root.findByType(AppPressable);

      act(() => {
        pressable.props.onPress?.();
      });
      act(() => {
        pressable.props.onPress?.();
      });

      expect(onChange).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(220);
      });

      act(() => {
        pressable.props.onPress?.();
      });

      act(() => {
        vi.advanceTimersByTime(220);
      });

      expect(onChange).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('应该支持基础快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<Switch testID="switch" size="lg" mt={10} flex rounded="xl" />);
    });

    const pressable = renderer!.root.findByType(AppPressable);
    const track = renderer!.root
      .findAllByType(AppView)
      .find(
        node =>
          Array.isArray(node.props.style) &&
          node.props.style.some((part: Record<string, unknown> | undefined) => part?.width === 60)
      );

    expect(pressable.props.mt).toBe(10);
    expect(pressable.props.flex).toBe(true);
    expect(track?.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderRadius: 16 })])
    );
  });
});
