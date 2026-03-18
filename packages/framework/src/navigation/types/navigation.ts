/**
 * 导航 Hook 返回类型
 * @module navigation/types/navigation
 */

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  DrawerNavigationProp,
  DrawerScreenProps as NativeDrawerScreenProps,
} from '@react-navigation/drawer';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { StackParamList, TabParamList, DrawerParamList } from './base';

// ============================================================================
// 屏幕 Props 类型（供组件使用）
// ============================================================================

/**
 * 堆栈屏幕组件 Props
 * @template T - 路由名称
 */
export type StackScreenProps<T extends keyof StackParamList> = NativeStackScreenProps<
  StackParamList,
  T
>;

/**
 * 标签屏幕组件 Props
 * @template T - 路由名称
 */
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;

/**
 * 抽屉屏幕组件 Props
 * @template T - 路由名称
 */
export type DrawerScreenProps<T extends keyof DrawerParamList> = NativeDrawerScreenProps<
  DrawerParamList,
  T
>;

// ============================================================================
// 导航 Hook 返回类型
// ============================================================================

/**
 * 堆栈导航 Hook 返回类型
 */
export type StackNavigation = NativeStackNavigationProp<StackParamList>;

/**
 * 标签导航 Hook 返回类型
 */
export type TabNavigation = BottomTabNavigationProp<TabParamList>;

/**
 * 抽屉导航 Hook 返回类型
 */
export type DrawerNavigation = DrawerNavigationProp<DrawerParamList>;

/**
 * 通用导航 Hook 返回类型
 */
export type AppNavigation = NavigationProp<StackParamList & TabParamList & DrawerParamList>;

// ============================================================================
// 重新导出 React Navigation 类型（供用户使用）
// ============================================================================

export type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  BottomTabNavigationProp,
  BottomTabScreenProps,
  DrawerNavigationProp,
  RouteProp,
  NavigationProp,
};
