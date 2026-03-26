import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, renderHook } from '@testing-library/react-native';
import { MotionConfigProvider } from '../../motion/context';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';
import { AppPressable } from '../../primitives/AppPressable';

const usePressMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/usePressMotion', () => ({
  usePressMotion: usePressMotionMock,
}));

describe('motion config', () => {
  it('应该支持通过 MotionConfigProvider 强制 reduceMotion', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MotionConfigProvider reduceMotion>{children}</MotionConfigProvider>
    );

    const { result } = renderHook(() => useReducedMotion(), { wrapper });

    expect(result.current.reduceMotion).toBe(true);
    expect(result.current.durationScale).toBe(0);
    expect(result.current.shouldAnimate).toBe(false);
  });

  it('应该支持全局 durationScale', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MotionConfigProvider durationScale={0.5}>{children}</MotionConfigProvider>
    );

    const { result } = renderHook(() => useReducedMotion(), { wrapper });

    expect(result.current.reduceMotion).toBe(false);
    expect(result.current.durationScale).toBe(0.5);
    expect(result.current.shouldAnimate).toBe(true);
  });

  it('AppPressable 应该支持继承全局默认按压预设', () => {
    usePressMotionMock.mockReset();
    usePressMotionMock.mockReturnValue({
      pressed: { interpolate: vi.fn() },
      animatedStyle: {},
      onPressIn: vi.fn(),
      onPressOut: vi.fn(),
    });

    render(
      <MotionConfigProvider defaultPressPreset="soft">
        <AppPressable testID="pressable">按钮</AppPressable>
      </MotionConfigProvider>
    );

    expect(usePressMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'soft',
      })
    );
  });
});
