/**
 * 导航器导出模块
 *
 * @module navigation/navigators
 * @description 导出所有导航器组件和辅助函数
 */

// 堆栈导航器
export { StackNavigator, createStackScreens } from './StackNavigator';
export type { StackNavigatorProps } from '../types';

// 标签导航器
export { TabNavigator, createTabScreens } from './TabNavigator';
export type { TabNavigatorProps } from '../types';

// 抽屉导航器
export { DrawerNavigator, createDrawerScreens } from './DrawerNavigator';
export type { DrawerNavigatorProps } from '../types';

// Re-export Screen 类型
export type { NativeStackScreenProps } from '../vendor/stack';
export type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
export type { DrawerScreenProps as NativeDrawerScreenProps } from '@react-navigation/drawer';
