import { describe, expect, it } from 'vitest';
import { resolveMotionLayoutPreset, resolveMotionLayoutProps } from '../../motion/layout';

describe('motion layout presets', () => {
  it('应该解析高级布局动画预设并应用时长 / 延迟 / spring 配置', () => {
    const resolved = resolveMotionLayoutPreset({
      preset: 'dialog',
      duration: 280,
      delay: 40,
      spring: 'smooth',
    });

    expect(resolved.entering).toMatchObject({
      __builder: 'ZoomIn',
      __config: {
        duration: 280,
        delay: 40,
        spring: true,
        damping: 22,
        stiffness: 180,
        mass: 1,
      },
    });

    expect(resolved.exiting).toMatchObject({
      __builder: 'ZoomOut',
      __config: {
        duration: 280,
        delay: 40,
        spring: true,
        damping: 22,
        stiffness: 180,
        mass: 1,
      },
    });

    expect(resolved.layout).toMatchObject({
      __builder: 'LinearTransition',
      __config: {
        duration: 280,
        delay: 40,
        spring: true,
        damping: 22,
        stiffness: 180,
        mass: 1,
      },
    });
  });

  it('显式 entering / exiting / layout 应优先于布局预设', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;

    const resolved = resolveMotionLayoutProps({
      entering,
      exiting,
      layout,
      preset: 'fade-up',
    });

    expect(resolved).toEqual({
      entering,
      exiting,
      layout,
    });
  });

  it('reduceMotion 开启时应关闭布局预设透传', () => {
    expect(
      resolveMotionLayoutProps({
        preset: 'list-item',
        reduceMotion: true,
      })
    ).toBeUndefined();
  });
});
