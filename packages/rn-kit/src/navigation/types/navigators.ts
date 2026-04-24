/**
 * 导航器 Props 类型
 * @module navigation/types/navigators
 */

import type {
  StackScreenOptions,
  TabScreenOptions,
  TabBarOptions,
  DrawerScreenOptions,
} from './screens';

type StackScreenOptionsResolver = (props: any) => StackScreenOptions;

/**
 * 堆栈导航器 Props
 */
export interface StackNavigatorProps {
  /** 初始路由名称 */
  initialRouteName?: string;
  /** 屏幕选项配置 */
  screenOptions?: StackScreenOptions | StackScreenOptionsResolver;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 标签导航器 Props
 */
export interface TabNavigatorProps {
  /** 初始路由名称 */
  initialRouteName?: string;
  /** 标签栏选项配置 */
  tabBarOptions?: TabBarOptions;
  /** 自定义标签栏组件 */
  tabBar?: (props: import('@react-navigation/bottom-tabs').BottomTabBarProps) => React.ReactNode;
  /** 屏幕选项配置 */
  screenOptions?: TabScreenOptions;
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 抽屉导航器 Props
 */
export interface DrawerNavigatorProps {
  /** 初始路由名称 */
  initialRouteName?: string;
  /** 屏幕选项配置 */
  screenOptions?: DrawerScreenOptions;
  /** 自定义抽屉内容组件 */
  drawerContent?: (props: any) => React.ReactNode;
  /** 抽屉配置 */
  drawerOptions?: import('./screens').DrawerOptions;
  /** 子元素 */
  children?: React.ReactNode;
}
