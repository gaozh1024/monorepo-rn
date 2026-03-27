import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@/theme';
import { AppText } from '../../primitives';
import { AppPressable } from '../../primitives/AppPressable';
import { PageDrawer } from '../../display/PageDrawer';

const useSheetMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/useSheetMotion', () => ({
  useSheetMotion: useSheetMotionMock,
}));

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('PageDrawer motion props', () => {
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

  it('应该透传自定义 drawer motion 配置', () => {
    render(
      <ThemeProvider light={theme}>
        <PageDrawer
          visible
          placement="left"
          width={280}
          swipeThreshold={96}
          motionDuration={220}
          motionOpenDuration={320}
          motionCloseDuration={180}
          motionSwipeThreshold={108}
          motionDistance={360}
          motionOverlayOpacity={0.8}
          motionVelocityThreshold={1.5}
          motionReduceMotion
        >
          <AppText>内容</AppText>
        </PageDrawer>
      </ThemeProvider>
    );

    expect(useSheetMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        placement: 'left',
        duration: 220,
        openDuration: 320,
        closeDuration: 180,
        distance: 360,
        overlayOpacity: 0.8,
        closeOnSwipe: true,
        swipeThreshold: 108,
        velocityThreshold: 1.5,
        reduceMotion: true,
      })
    );
  });

  it('应该透传关闭按钮的按压动画配置', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <PageDrawer visible motionPreset="strong" motionDuration={210} motionReduceMotion>
            <AppText>内容</AppText>
          </PageDrawer>
        </ThemeProvider>
      );
    });

    const closeButton = renderer!.root.findByProps({ testID: 'page-drawer-close' });

    expect(closeButton.type).toBe(AppPressable);
    expect(closeButton.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 210,
      motionReduceMotion: true,
    });

    const backdrop = renderer!.root.findByProps({ testID: 'page-drawer-backdrop' });
    expect(backdrop.props.motionPreset).toBe('none');
  });
});
