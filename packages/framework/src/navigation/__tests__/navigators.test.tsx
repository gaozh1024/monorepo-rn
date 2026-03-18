/**
 * 导航器关键装配测试
 * @module navigation/__tests__/navigators
 */

import { describe, it, expect } from 'vitest';

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
});
