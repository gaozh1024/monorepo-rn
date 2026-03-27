import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { Presence } from '../../motion/components/Presence';
import { MotionView } from '../../motion/components/MotionView';
import { StaggerItem } from '../../motion/components/StaggerItem';

const usePresenceMotionMock = vi.hoisted(() => vi.fn());
const useStaggerMotionMock = vi.hoisted(() => vi.fn());

vi.mock('../../motion/hooks/usePresenceMotion', () => ({
  usePresenceMotion: usePresenceMotionMock,
}));

vi.mock('../../motion/hooks/useStaggerMotion', () => ({
  useStaggerMotion: useStaggerMotionMock,
}));

describe('motion container props', () => {
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
    useStaggerMotionMock.mockReset();
    useStaggerMotionMock.mockReturnValue({
      mounted: true,
      progress: { value: 1 },
      animatedStyle: {},
    });
  });

  it('Presence 应该透传完整 presence motion 配置', () => {
    render(
      <Presence
        visible
        preset="fade"
        motionPreset="scaleFade"
        motionDuration={260}
        motionEnterDuration={300}
        motionExitDuration={180}
        motionDistance={24}
        motionReduceMotion
      >
        <></>
      </Presence>
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        preset: 'scaleFade',
        duration: 260,
        enterDuration: 300,
        exitDuration: 180,
        distance: 24,
        reduceMotion: true,
      })
    );
  });

  it('MotionView 在未传 motionPreset 时应继续兼容 preset', () => {
    render(
      <MotionView
        visible
        preset="slideUp"
        motionDuration={220}
        motionDistance={18}
        motionReduceMotion
      />
    );

    expect(usePresenceMotionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        visible: true,
        preset: 'slideUp',
        duration: 220,
        distance: 18,
        reduceMotion: true,
      })
    );
  });

  it('Presence 应该透传 entering / exiting / layout 到 Animated.View', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <Presence visible motionEntering={entering} motionExiting={exiting} motionLayout={layout}>
          <></>
        </Presence>
      );
    });

    const animatedView = renderer!.root.findByType('Animated.View');
    expect(animatedView.props.entering).toBe(entering);
    expect(animatedView.props.exiting).toBe(exiting);
    expect(animatedView.props.layout).toBe(layout);
  });

  it('MotionView 在 reduceMotion 时应关闭 layout animation props', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <MotionView
          visible
          motionReduceMotion
          motionEntering={entering}
          motionExiting={exiting}
          motionLayout={layout}
        />
      );
    });

    const animatedView = renderer!.root.findByType('Animated.View');
    expect(animatedView.props.entering).toBeUndefined();
    expect(animatedView.props.exiting).toBeUndefined();
    expect(animatedView.props.layout).toBeUndefined();
  });

  it('StaggerItem 应该透传 layout animation props', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <StaggerItem
          index={0}
          motionEntering={entering}
          motionExiting={exiting}
          motionLayout={layout}
        >
          <>A</>
        </StaggerItem>
      );
    });

    const animatedView = renderer!.root.findByType('Animated.View');
    expect(animatedView.props.entering).toBe(entering);
    expect(animatedView.props.exiting).toBe(exiting);
    expect(animatedView.props.layout).toBe(layout);
  });

  it('Presence 应该支持通过 motionLayoutPreset 自动生成高级布局动画', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <Presence
          visible
          motionLayoutPreset="dialog"
          motionLayoutDuration={280}
          motionLayoutDelay={40}
          motionLayoutSpring="smooth"
        >
          <></>
        </Presence>
      );
    });

    const animatedView = renderer!.root.findByType('Animated.View');
    expect(animatedView.props.entering).toMatchObject({
      __builder: 'ZoomIn',
      __config: expect.objectContaining({
        duration: 280,
        delay: 40,
        spring: true,
        damping: 22,
        stiffness: 180,
        mass: 1,
      }),
    });
    expect(animatedView.props.exiting).toMatchObject({
      __builder: 'ZoomOut',
    });
    expect(animatedView.props.layout).toMatchObject({
      __builder: 'LinearTransition',
    });
  });
});
