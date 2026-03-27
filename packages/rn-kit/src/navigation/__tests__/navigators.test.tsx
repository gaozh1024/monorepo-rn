/**
 * 导航器关键装配测试
 * @module navigation/__tests__/navigators
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { TabNavigator } from '../navigators';
import { BottomTabBar } from '../components/BottomTabBar';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('导航器模块', () => {
  it('应该正确导出 StackNavigator', async () => {
    const { StackNavigator } = await import('../navigators');
    expect(StackNavigator).toBeDefined();
  });

  it('应该正确导出 TabNavigator', async () => {
    const { TabNavigator } = await import('../navigators');
    expect(TabNavigator).toBeDefined();
  });

  it('应该正确导出 DrawerNavigator', async () => {
    const { DrawerNavigator } = await import('../navigators');
    expect(DrawerNavigator).toBeDefined();
  });

  it('应该导出 createStackScreens', async () => {
    const { createStackScreens } = await import('../navigators');
    expect(typeof createStackScreens).toBe('function');
  });

  it('应该导出 createTabScreens', async () => {
    const { createTabScreens } = await import('../navigators');
    expect(typeof createTabScreens).toBe('function');
  });

  it('应该导出 createDrawerScreens', async () => {
    const { createDrawerScreens } = await import('../navigators');
    expect(typeof createDrawerScreens).toBe('function');
  });

  it('TabNavigator 默认应该使用 BottomTabBar', async () => {
    const { __getLastBottomTabNavigatorProps } = await import('@react-navigation/bottom-tabs');

    render(
      <ThemeProvider light={theme}>
        <TabNavigator
          tabBarOptions={{
            showLabel: false,
            showActiveIndicator: true,
            activeTintColor: '#f38b32',
            inactiveTintColor: '#9ca3af',
            activeBackgroundColor: '#fff7ed',
            inactiveBackgroundColor: '#ffffff',
            indicatorColor: '#111827',
            indicatorHeight: 4,
            labelStyle: { fontSize: 13 },
            iconStyle: { marginBottom: 4 },
            style: { borderTopWidth: 0, backgroundColor: '#ffffff' },
            height: 72,
          }}
        >
          <TabNavigator.Screen name="Home" component={() => null} />
          <TabNavigator.Screen name="Profile" component={() => null} />
        </TabNavigator>
      </ThemeProvider>
    );

    const navigatorProps = __getLastBottomTabNavigatorProps();
    expect(typeof navigatorProps.tabBar).toBe('function');

    const tabBarElement = navigatorProps.tabBar({
      state: { routes: [], index: 0 },
      descriptors: {},
      navigation: {},
      insets: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    expect(tabBarElement.type).toBe(BottomTabBar);
    expect(tabBarElement.props.showLabel).toBe(false);
    expect(tabBarElement.props.showActiveIndicator).toBe(true);
    expect(tabBarElement.props.activeTintColor).toBe('#f38b32');
    expect(tabBarElement.props.inactiveTintColor).toBe('#9ca3af');
    expect(tabBarElement.props.activeBackgroundColor).toBe('#fff7ed');
    expect(tabBarElement.props.inactiveBackgroundColor).toBe('#ffffff');
    expect(tabBarElement.props.indicatorColor).toBe('#111827');
    expect(tabBarElement.props.indicatorHeight).toBe(4);
    expect(tabBarElement.props.labelStyle).toEqual({ fontSize: 13 });
    expect(tabBarElement.props.iconStyle).toEqual({ marginBottom: 4 });
    expect(tabBarElement.props.style).toEqual({ borderTopWidth: 0, backgroundColor: '#ffffff' });
    expect(tabBarElement.props.height).toBe(72);
  });

  it('TabNavigator 应该允许自定义 tabBar 覆盖默认实现', async () => {
    const { __getLastBottomTabNavigatorProps } = await import('@react-navigation/bottom-tabs');
    const customTabBar = () => null;

    render(
      <ThemeProvider light={theme}>
        <TabNavigator tabBar={customTabBar}>
          <TabNavigator.Screen name="Home" component={() => null} />
        </TabNavigator>
      </ThemeProvider>
    );

    const navigatorProps = __getLastBottomTabNavigatorProps();
    expect(navigatorProps.tabBar).toBe(customTabBar);
  });
});
