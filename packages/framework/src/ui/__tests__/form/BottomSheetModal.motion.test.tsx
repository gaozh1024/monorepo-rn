import { describe, expect, it, beforeEach, vi } from 'vitest';
import React from 'react';
import { AppText } from '@/ui/primitives';
import { renderWithTheme } from './test-utils';
import { BottomSheetModal } from '../../form/BottomSheetModal';

const useSheetMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/useSheetMotion', () => ({
  useSheetMotion: useSheetMotionMock,
}));

describe('BottomSheetModal motion props', () => {
  beforeEach(() => {
    useSheetMotionMock.mockReset();
    useSheetMotionMock.mockReturnValue({
      mounted: true,
      progress: { interpolate: vi.fn() },
      overlayStyle: {},
      sheetStyle: {},
      panHandlers: undefined,
      open: vi.fn(),
      close: vi.fn(),
    });
  });

  it('应该透传自定义 sheet motion 配置', () => {
    renderWithTheme(
      <BottomSheetModal
        visible
        onRequestClose={vi.fn()}
        overlayColor="rgba(0,0,0,0.5)"
        surfaceColor="#ffffff"
        motionDistance={320}
        motionOverlayOpacity={0.72}
        motionSwipeThreshold={96}
        motionVelocityThreshold={1.6}
        motionReduceMotion
      >
        <AppText>内容</AppText>
      </BottomSheetModal>
    );

    expect(useSheetMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        placement: 'bottom',
        distance: 320,
        overlayOpacity: 0.72,
        closeOnSwipe: true,
        swipeThreshold: 96,
        velocityThreshold: 1.6,
        reduceMotion: true,
      })
    );
  });
});
