import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { withSpring, withTiming } from 'react-native-reanimated';
import { AppView } from '../../primitives';
import { CollapseView } from '../../motion/components/CollapseView';

describe('CollapseView', () => {
  beforeEach(() => {
    vi.mocked(withTiming).mockClear();
    vi.mocked(withSpring).mockClear();
  });

  it('默认隐藏时应保持挂载，以便预先测量内容高度', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <CollapseView visible={false}>
          <></>
        </CollapseView>
      );
    });

    const animatedViews = renderer!.root.findAllByType('Animated.View');
    expect(animatedViews).toHaveLength(1);

    const animatedView = animatedViews[0];
    expect(animatedView.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ overflow: 'hidden' })])
    );
  });

  it('展开时应基于测量高度使用 withTiming', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <CollapseView visible={false} motionDuration={300}>
          <>内容</>
        </CollapseView>
      );
    });

    const contentView = renderer!.root.findByType(AppView);

    act(() => {
      contentView.props.onLayout?.({ nativeEvent: { layout: { height: 96 } } });
    });

    vi.mocked(withTiming).mockClear();

    act(() => {
      renderer!.update(
        <CollapseView visible motionDuration={300}>
          <>内容</>
        </CollapseView>
      );
    });

    expect(withTiming).toHaveBeenCalledWith(
      96,
      expect.objectContaining({ duration: 300 }),
      expect.any(Function)
    );
  });

  it('传入 motionSpringPreset 时应使用 withSpring', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <CollapseView visible={false} motionSpringPreset="smooth">
          <>内容</>
        </CollapseView>
      );
    });

    const contentView = renderer!.root.findByType(AppView);

    act(() => {
      contentView.props.onLayout?.({ nativeEvent: { layout: { height: 120 } } });
    });

    vi.mocked(withSpring).mockClear();

    act(() => {
      renderer!.update(
        <CollapseView visible motionSpringPreset="smooth">
          <>内容</>
        </CollapseView>
      );
    });

    expect(withSpring).toHaveBeenCalledWith(
      120,
      expect.objectContaining({
        damping: 22,
        stiffness: 180,
        mass: 1,
      }),
      expect.any(Function)
    );
  });

  it('unmountOnExit 开启时应在收起后卸载内容', async () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <CollapseView visible unmountOnExit motionDuration={200}>
          <>内容</>
        </CollapseView>
      );
    });

    const contentView = renderer!.root.findByType(AppView);

    act(() => {
      contentView.props.onLayout?.({ nativeEvent: { layout: { height: 88 } } });
    });

    vi.mocked(withTiming).mockClear();

    await act(async () => {
      renderer!.update(
        <CollapseView visible={false} unmountOnExit motionDuration={200}>
          <>内容</>
        </CollapseView>
      );
      await Promise.resolve();
    });

    expect(withTiming).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: 200 }),
      expect.any(Function)
    );
    expect(renderer!.root.findAllByType('Animated.View')).toHaveLength(0);
  });
});
