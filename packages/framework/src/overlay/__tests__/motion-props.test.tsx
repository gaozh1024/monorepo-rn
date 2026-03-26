import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { MotionConfigProvider } from '@/ui/motion';
import { AlertModal } from '../alert/component';
import { ToastItemView } from '../toast/component';

const usePresenceMotionMock = vi.hoisted(() => vi.fn());

vi.mock('@/ui/motion', async () => {
  const actual = await vi.importActual('@/ui/motion');

  return {
    ...actual,
    usePresenceMotion: usePresenceMotionMock,
  };
});

describe('overlay motion props', () => {
  beforeEach(() => {
    usePresenceMotionMock.mockReset();
    usePresenceMotionMock.mockReturnValue({
      mounted: true,
      progress: { value: 1 },
      animatedStyle: {},
      overlayAnimatedStyle: {},
      enter: vi.fn(),
      exit: vi.fn(),
      setVisible: vi.fn(),
    });
  });

  it('AlertModal 应该透传 motion 配置', () => {
    render(
      <AlertModal
        visible
        title="提示"
        message="内容"
        showCancel
        motionPreset="scale"
        motionDuration={280}
        motionEnterDuration={320}
        motionExitDuration={180}
        motionDistance={24}
        motionReduceMotion
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        preset: 'scale',
        duration: 280,
        enterDuration: 320,
        exitDuration: 180,
        distance: 24,
        reduceMotion: true,
        unmountOnExit: true,
      })
    );
  });

  it('ToastItemView 在未传 preset 时应该继承全局默认 presence preset', () => {
    render(
      <MotionConfigProvider defaultPresencePreset="fadeDown">
        <ToastItemView message="成功" type="success" duration={3000} id="1" onHide={vi.fn()} />
      </MotionConfigProvider>
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'fadeDown',
      })
    );
  });
});
