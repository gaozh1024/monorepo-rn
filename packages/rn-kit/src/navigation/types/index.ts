/**
 * 导航模块类型定义
 *
 * @module navigation/types
 * @description 提供完整的导航类型定义，支持类型安全的路由配置
 */

// 基础类型
export type { ParamListBase, StackParamList, TabParamList, DrawerParamList } from './base';

// 屏幕选项类型
export type {
  StackScreenOptions,
  TabScreenOptions,
  TabBarOptions,
  DrawerScreenOptions,
  DrawerOptions,
} from './screens';

// 路由配置类型
export type { RouteConfig, StackRouteConfig, TabRouteConfig, DrawerRouteConfig } from './routes';

// 深度链接配置类型
export type { LinkingConfig, PathConfig } from './linking';

// 导航器 Props 类型
export type { StackNavigatorProps, TabNavigatorProps, DrawerNavigatorProps } from './navigators';

// 导航 Hook 返回类型
export type {
  StackScreenProps,
  TabScreenProps,
  DrawerScreenProps,
  StackNavigation,
  TabNavigation,
  DrawerNavigation,
  AppNavigation,
  // React Navigation 原始类型
  NativeStackNavigationProp,
  NativeStackScreenProps,
  BottomTabNavigationProp,
  BottomTabScreenProps,
  DrawerNavigationProp,
  RouteProp,
  NavigationProp,
} from './navigation';

// ============================================================================
// 模块声明扩展
// ============================================================================

import type { StackParamList, TabParamList, DrawerParamList } from './base';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList, TabParamList, DrawerParamList {}
  }
}

export {};
