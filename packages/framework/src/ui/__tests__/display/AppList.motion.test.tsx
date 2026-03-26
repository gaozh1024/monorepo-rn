import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@/theme';
import { AppText } from '../../primitives';
import { AppList } from '../../display/AppList';

const staggerItemState = vi.hoisted(() => ({
  propsHistory: [] as Array<Record<string, unknown>>,
}));

vi.mock('@/ui/motion', async () => {
  const actual = await vi.importActual('@/ui/motion');

  return {
    ...actual,
    StaggerItem: (props: Record<string, unknown>) => {
      staggerItemState.propsHistory.push(props);
      return props.children;
    },
  };
});

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('AppList motion props', () => {
  beforeEach(() => {
    staggerItemState.propsHistory = [];
  });

  it('应该透传错峰动画配置给 StaggerItem', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;

    render(
      <ThemeProvider light={theme}>
        <AppList
          data={[
            { id: '1', title: 'A' },
            { id: '2', title: 'B' },
          ]}
          stagger
          staggerPreset="scaleFade"
          staggerMs={56}
          staggerBaseDelayMs={120}
          staggerDuration={260}
          staggerDistance={32}
          staggerReduceMotion
          motionEntering={entering}
          motionExiting={exiting}
          motionLayout={layout}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AppText>{item.title}</AppText>}
        />
      </ThemeProvider>
    );

    expect(staggerItemState.propsHistory[0]).toMatchObject({
      index: 0,
      visible: true,
      staggerPreset: 'scaleFade',
      staggerMs: 56,
      staggerBaseDelayMs: 120,
      staggerDuration: 260,
      staggerDistance: 32,
      staggerReduceMotion: true,
      motionEntering: entering,
      motionExiting: exiting,
      motionLayout: layout,
    });
  });

  it('未开启 stagger 时也应该给列表项透传 item-level layout animation props', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <AppList
            data={[{ id: '1', title: 'A' }]}
            motionEntering={entering}
            motionExiting={exiting}
            motionLayout={layout}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <AppText>{item.title}</AppText>}
          />
        </ThemeProvider>
      );
    });

    const animatedViews = renderer!.root.findAll(
      node => typeof node.type === 'string' && node.type === 'Animated.View'
    );
    const itemWrapper = animatedViews.find(
      node =>
        node.props.entering === entering &&
        node.props.exiting === exiting &&
        node.props.layout === layout
    );

    expect(itemWrapper).toBeTruthy();
  });

  it('staggerReduceMotion 开启时应该关闭 item-level layout animation props', () => {
    const entering = { type: 'enter' } as any;
    const exiting = { type: 'exit' } as any;
    const layout = { type: 'layout' } as any;
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <AppList
            data={[{ id: '1', title: 'A' }]}
            staggerReduceMotion
            motionEntering={entering}
            motionExiting={exiting}
            motionLayout={layout}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <AppText>{item.title}</AppText>}
          />
        </ThemeProvider>
      );
    });

    const animatedViews = renderer!.root.findAll(
      node => typeof node.type === 'string' && node.type === 'Animated.View'
    );
    const itemWrapper = animatedViews.find(
      node => 'entering' in node.props || 'layout' in node.props
    );

    expect(itemWrapper).toBeUndefined();
  });

  it('应该透传高级布局预设配置给 StaggerItem', () => {
    render(
      <ThemeProvider light={theme}>
        <AppList
          data={[{ id: '1', title: 'A' }]}
          stagger
          motionLayoutPreset="list-item"
          motionLayoutDuration={260}
          motionLayoutDelay={30}
          motionLayoutSpring="snappy"
          keyExtractor={item => item.id}
          renderItem={({ item }) => <AppText>{item.title}</AppText>}
        />
      </ThemeProvider>
    );

    expect(staggerItemState.propsHistory[0]).toMatchObject({
      motionLayoutPreset: 'list-item',
      motionLayoutDuration: 260,
      motionLayoutDelay: 30,
      motionLayoutSpring: 'snappy',
    });
  });
});
