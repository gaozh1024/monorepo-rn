import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider, createTheme } from '@/theme';
import { MotionConfigProvider } from '../../motion';
import { Alert } from '../../feedback/Alert';
import { Toast } from '../../feedback/Toast';

const usePresenceMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/usePresenceMotion', () => ({
  usePresenceMotion: usePresenceMotionMock,
}));

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('feedback motion props', () => {
  beforeEach(() => {
    usePresenceMotionMock.mockReset();
    usePresenceMotionMock.mockReturnValue({
      mounted: true,
      progress: { interpolate: vi.fn() },
      animatedStyle: {},
      enter: vi.fn(),
      exit: vi.fn(),
      setVisible: vi.fn(),
    });
  });

  it('Alert 应该透传显式 motion 配置', () => {
    render(
      <ThemeProvider light={theme}>
        <Alert
          visible
          title="提示"
          buttons={[{ text: '确定' }]}
          motionPreset="scaleFade"
          motionDuration={260}
          motionEnterDuration={300}
          motionExitDuration={180}
          motionDistance={28}
          motionReduceMotion
        />
      </ThemeProvider>
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        preset: 'scaleFade',
        duration: 260,
        enterDuration: 300,
        exitDuration: 180,
        distance: 28,
        reduceMotion: true,
        unmountOnExit: true,
      })
    );
  });

  it('Alert 在未传 preset 时应该继承全局默认 presence preset', () => {
    render(
      <MotionConfigProvider defaultPresencePreset="fadeUp">
        <ThemeProvider light={theme}>
          <Alert visible title="提示" buttons={[{ text: '确定' }]} />
        </ThemeProvider>
      </MotionConfigProvider>
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'fadeUp',
      })
    );
  });

  it('Toast 应该透传显式 motion 配置', () => {
    render(
      <Toast
        message="已保存"
        visible
        motionPreset="slideDown"
        motionDuration={220}
        motionEnterDuration={240}
        motionExitDuration={160}
        motionDistance={18}
        motionReduceMotion
      />
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        preset: 'slideDown',
        duration: 220,
        enterDuration: 240,
        exitDuration: 160,
        distance: 18,
        reduceMotion: true,
        unmountOnExit: true,
      })
    );
  });

  it('Toast 在未传 preset 时应该继承全局默认 presence preset', () => {
    render(
      <MotionConfigProvider defaultPresencePreset="slideUp">
        <Toast message="已保存" visible />
      </MotionConfigProvider>
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'slideUp',
      })
    );
  });
});
