import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppPressable } from '../../primitives/AppPressable';

const usePressMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/usePressMotion', () => ({
  usePressMotion: usePressMotionMock,
}));

describe('AppPressable motion props', () => {
  beforeEach(() => {
    usePressMotionMock.mockReset();
    usePressMotionMock.mockReturnValue({
      pressed: { interpolate: vi.fn() },
      animatedStyle: {},
      onPressIn: vi.fn(),
      onPressOut: vi.fn(),
    });
  });

  it('应该透传按压动画配置到 usePressMotion', () => {
    render(
      <AppPressable motionPreset="strong" motionDuration={240} motionReduceMotion>
        <>Press me</>
      </AppPressable>
    );

    expect(usePressMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'strong',
        duration: 240,
        reduceMotion: true,
      })
    );
  });
});
