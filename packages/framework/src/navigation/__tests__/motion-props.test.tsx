import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { View } from 'react-native';
import { act, create } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@/theme';
import { AppPressable, Presence, StaggerItem } from '@/ui';
import { AppHeader } from '../components/AppHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { DrawerContent } from '../components/DrawerContent';

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 10,
    bottom: 10,
    left: 0,
    right: 0,
  }),
}));

vi.mock('@/overlay', () => ({
  AppFocusedStatusBar: () => null,
}));

vi.mock('@react-navigation/drawer', () => ({
  DrawerContentScrollView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
}));

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

function createBottomTabProps(index = 0) {
  return {
    state: {
      index,
      routes: [
        { key: 'home-key', name: 'Home' },
        { key: 'profile-key', name: 'Profile' },
      ],
    },
    descriptors: {
      'home-key': {
        options: {
          title: '首页',
          tabBarTestID: 'home-tab',
          tabBarIcon: ({ color }: { color: string }) => (
            <View testID="home-icon" style={{ backgroundColor: color }} />
          ),
        },
      },
      'profile-key': {
        options: {
          title: '我的',
          tabBarTestID: 'profile-tab',
          tabBarIcon: ({ color }: { color: string }) => (
            <View testID="profile-icon" style={{ backgroundColor: color }} />
          ),
        },
      },
    },
    navigation: {
      emit: vi.fn(() => ({ defaultPrevented: false })),
      navigate: vi.fn(),
    },
  } as any;
}

function createDrawerProps(index = 0) {
  return {
    state: {
      index,
      routes: [
        { key: 'home-key', name: 'Home' },
        { key: 'settings-key', name: 'Settings' },
      ],
    },
    descriptors: {
      'home-key': { options: { title: '首页' } },
      'settings-key': { options: { title: '设置' } },
    },
    navigation: {
      navigate: vi.fn(),
    },
  } as any;
}

describe('navigation motion props', () => {
  it('AppHeader 应该透传按压动画配置给内部按钮', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <AppHeader
            title="标题"
            rightIcons={[{ icon: 'search', onPress: vi.fn() }]}
            motionPreset="strong"
            motionDuration={220}
            motionReduceMotion
          />
        </ThemeProvider>
      );
    });

    const pressables = renderer!.root.findAllByType(AppPressable);
    expect(pressables.length).toBeGreaterThanOrEqual(2);
    expect(pressables[0]?.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 220,
      motionReduceMotion: true,
    });
    expect(pressables[1]?.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 220,
      motionReduceMotion: true,
    });
  });

  it('BottomTabBar 应该透传按压与指示器动画配置', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <BottomTabBar
            {...createBottomTabProps(0)}
            motionPreset="strong"
            motionDuration={200}
            motionReduceMotion
            indicatorMotionPreset="slideUp"
            indicatorMotionDuration={260}
            indicatorMotionEnterDuration={300}
            indicatorMotionExitDuration={180}
            indicatorMotionDistance={20}
            indicatorMotionReduceMotion
          />
        </ThemeProvider>
      );
    });

    const pressables = renderer!.root.findAllByType(AppPressable);
    expect(pressables[0]?.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 200,
      motionReduceMotion: true,
    });

    const presences = renderer!.root.findAllByType(Presence);
    expect(presences[0]?.props).toMatchObject({
      preset: 'slideUp',
      motionDuration: 260,
      motionEnterDuration: 300,
      motionExitDuration: 180,
      motionDistance: 20,
      motionReduceMotion: true,
    });
  });

  it('DrawerContent 应该透传按压、指示器与错峰动画配置', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <DrawerContent
            {...createDrawerProps(0)}
            staggerItems
            items={[
              { name: 'Home', label: '首页' },
              { name: 'Settings', label: '设置' },
            ]}
            motionPreset="strong"
            motionDuration={210}
            motionReduceMotion
            indicatorMotionPreset="fadeDown"
            indicatorMotionDuration={240}
            indicatorMotionEnterDuration={260}
            indicatorMotionExitDuration={160}
            indicatorMotionDistance={18}
            indicatorMotionReduceMotion
            staggerPreset="scaleFade"
            staggerMs={56}
            staggerBaseDelayMs={120}
            staggerDuration={280}
            staggerDistance={26}
            staggerReduceMotion
          />
        </ThemeProvider>
      );
    });

    const pressables = renderer!.root.findAllByType(AppPressable);
    expect(pressables[0]?.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 210,
      motionReduceMotion: true,
    });

    const presences = renderer!.root.findAllByType(Presence);
    expect(presences[0]?.props).toMatchObject({
      preset: 'fadeDown',
      motionDuration: 240,
      motionEnterDuration: 260,
      motionExitDuration: 160,
      motionDistance: 18,
      motionReduceMotion: true,
    });

    const staggerItems = renderer!.root.findAllByType(StaggerItem);
    expect(staggerItems[0]?.props).toMatchObject({
      staggerPreset: 'scaleFade',
      staggerMs: 56,
      staggerBaseDelayMs: 120,
      staggerDuration: 280,
      staggerDistance: 26,
      staggerReduceMotion: true,
    });
  });
});
