import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react-native';
import { View } from 'react-native';
import { ThemeProvider, createTheme } from '@/theme';
import { BottomTabBar } from '../components/BottomTabBar';

vi.mock('@/ui/motion', async () => {
  const actual = await vi.importActual<any>('@/ui/motion');
  return {
    ...actual,
    Presence: ({ visible, children }: any) => (visible ? <>{children}</> : null),
  };
});

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 10,
    left: 0,
    right: 0,
  }),
}));

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

function createProps(index = 0) {
  const navigate = vi.fn();
  const emit = vi.fn(() => ({ defaultPrevented: false }));

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
          tabBarBadge: 120,
          tabBarIcon: ({ color }: { color: string }) => (
            <View testID="profile-icon" style={{ backgroundColor: color }} />
          ),
        },
      },
    },
    navigation: {
      emit,
      navigate,
    },
  } as any;
}

describe('BottomTabBar', () => {
  it('默认不应该渲染激活态指示器', () => {
    const props = createProps(0);
    const { queryByTestId } = render(
      <ThemeProvider light={theme}>
        <BottomTabBar {...props} />
      </ThemeProvider>
    );

    expect(queryByTestId('home-tab-indicator')).toBeNull();
    expect(queryByTestId('profile-tab-indicator')).toBeNull();
  });

  it('显式开启后应该渲染激活态指示器并在切换时更新', () => {
    const props = createProps(0);
    const { queryByTestId, rerender } = render(
      <ThemeProvider light={theme}>
        <BottomTabBar {...props} showActiveIndicator />
      </ThemeProvider>
    );

    expect(queryByTestId('home-tab-indicator')).toBeTruthy();
    expect(queryByTestId('profile-tab-indicator')).toBeNull();

    rerender(
      <ThemeProvider light={theme}>
        <BottomTabBar {...createProps(1)} showActiveIndicator />
      </ThemeProvider>
    );

    expect(queryByTestId('home-tab-indicator')).toBeNull();
    expect(queryByTestId('profile-tab-indicator')).toBeTruthy();
  });

  it('应该支持隐藏激活态指示器', () => {
    const { queryByTestId } = render(
      <ThemeProvider light={theme}>
        <BottomTabBar {...createProps(0)} showActiveIndicator={false} />
      </ThemeProvider>
    );

    expect(queryByTestId('home-tab-indicator')).toBeNull();
    expect(queryByTestId('profile-tab-indicator')).toBeNull();
  });

  it('点击未激活 tab 时应该触发导航，并显示徽标上限文案', () => {
    const props = createProps(0);
    const { getByTestId, getByText } = render(
      <ThemeProvider light={theme}>
        <BottomTabBar {...props} />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('profile-tab'));

    expect(props.navigation.emit).toHaveBeenCalled();
    expect(props.navigation.navigate).toHaveBeenCalledWith('Profile');
    expect(getByText('99+')).toBeTruthy();
  });
});
