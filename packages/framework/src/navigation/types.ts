/**
 * 导航模块类型定义
 *
 * @module navigation/types
 * @description 提供完整的导航类型定义，支持类型安全的路由配置
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
import type { NavigationProp } from '@react-navigation/native';

// ============================================================================
// 基础导航类型
// ============================================================================

/**
 * 路由参数基础类型
 * 所有路由参数列表都应继承此类型
 */
export type ParamListBase = {
  [key: string]: object | undefined;
};

/**
 * 堆栈导航参数列表
 * 用户应扩展此类型来定义自己的路由参数
 *
 * @example
 * ```ts
 * declare module '@gaozh1024/rn-kit' {
 *   interface StackParamList {
 *     Home: undefined;
 *     Detail: { id: string };
 *   }
 * }
 * ```
 */
export interface StackParamList extends ParamListBase {}

/**
 * 标签导航参数列表
 * 用户应扩展此类型来定义自己的路由参数
 */
export interface TabParamList extends ParamListBase {}

/**
 * 抽屉导航参数列表
 * 用户应扩展此类型来定义自己的路由参数
 */
export interface DrawerParamList extends ParamListBase {}

// ============================================================================
// 屏幕配置类型
// ============================================================================

/**
 * 屏幕选项配置 - 堆栈
 */
export interface StackScreenOptions {
  /** 标题 */
  title?: string;
  /** 是否显示头部 */
  headerShown?: boolean;
  /** 自定义头部 */
  header?: (props: any) => React.ReactElement | null;
  /** 动画类型 */
  animation?:
    | 'default'
    | 'fade'
    | 'slide_from_right'
    | 'slide_from_left'
    | 'slide_from_bottom'
    | 'none';
  /** 是否支持全屏手势返回 */
  fullScreenGestureEnabled?: boolean;
  /** 自定义后退按钮标题（iOS） */
  headerBackTitle?: string;
  /** 是否显示后退按钮 */
  headerBackVisible?: boolean;
  /** 内容样式 */
  contentStyle?: object;
}

/**
 * 屏幕选项配置 - 标签
 */
export interface TabScreenOptions {
  /** 标签标题 */
  title?: string;
  /** 标签栏标签 */
  tabBarLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /** 标签栏图标 */
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  /** 是否显示标签栏 */
  tabBarVisible?: boolean;
  /** 是否支持滑动切换 */
  swipeEnabled?: boolean;
}

/**
 * 标签栏配置
 */
export interface TabBarOptions {
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 激活状态颜色 */
  activeTintColor?: string;
  /** 非激活状态颜色 */
  inactiveTintColor?: string;
  /** 激活背景色 */
  activeBackgroundColor?: string;
  /** 非激活背景色 */
  inactiveBackgroundColor?: string;
  /** 键盘弹出时是否隐藏 */
  hideOnKeyboard?: boolean;
  /** 标签位置 */
  labelPosition?: 'below-icon' | 'beside-icon';
  /** 标签样式 */
  labelStyle?: object;
  /** 图标样式 */
  iconStyle?: object;
  /** 标签栏样式 */
  style?: object;
}

/**
 * 屏幕选项配置 - 抽屉
 */
export interface DrawerScreenOptions {
  /** 标题 */
  title?: string;
  /** 是否显示头部 */
  headerShown?: boolean;
  /** 抽屉标签 */
  drawerLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /** 抽屉图标 */
  drawerIcon?: (props: { focused: boolean; size: number; color: string }) => React.ReactNode;
  /** 激活状态颜色 */
  drawerActiveTintColor?: string;
  /** 非激活状态颜色 */
  drawerInactiveTintColor?: string;
  /** 激活背景色 */
  drawerActiveBackgroundColor?: string;
  /** 非激活背景色 */
  drawerInactiveBackgroundColor?: string;
}

/**
 * 抽屉配置
 */
export interface DrawerOptions {
  /** 抽屉类型 */
  drawerType?: 'front' | 'back' | 'slide' | 'permanent';
  /** 抽屉宽度 */
  drawerWidth?: number;
  /** 遮罩层颜色 */
  overlayColor?: string;
  /** 是否支持边缘滑动打开 */
  edgeWidth?: number;
  /** 最小滑动距离 */
  minSwipeDistance?: number;
  /** 隐藏状态下是否响应手势 */
  gestureHandlerProps?: object;
}

// ============================================================================
// 导航 Props 类型（供组件使用）
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
// 导航 Hook 类型
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
// 路由配置类型
// ============================================================================

/**
 * 路由屏幕配置
 */
export interface RouteConfig {
  /** 屏幕名称 */
  name: string;
  /** 屏幕组件 */
  component: React.ComponentType<any>;
  /** 屏幕选项 */
  options?: StackScreenOptions | TabScreenOptions | DrawerScreenOptions;
  /** 初始参数 */
  initialParams?: Record<string, any>;
  /** 嵌套路由 */
  children?: RouteConfig[];
}

/**
 * 堆栈路由配置
 */
export interface StackRouteConfig extends RouteConfig {
  options?: StackScreenOptions;
}

/**
 * 标签路由配置
 */
export interface TabRouteConfig extends RouteConfig {
  options?: TabScreenOptions;
}

/**
 * 抽屉路由配置
 */
export interface DrawerRouteConfig extends RouteConfig {
  options?: DrawerScreenOptions;
}

// ============================================================================
// 深度链接配置
// ============================================================================

/**
 * 路径配置
 */
export interface PathConfig {
  /** 路径模板 */
  path?: string;
  /** 是否精确匹配 */
  exact?: boolean;
  /** 解析参数 */
  parse?: Record<string, (value: string) => any>;
  /** 序列化参数 */
  stringify?: Record<string, (value: any) => string>;
  /** 嵌套屏幕配置 */
  screens?: Record<string, PathConfig>;
}

/**
 * 深度链接配置
 */
export interface LinkingConfig {
  /** 前缀列表 */
  prefixes: string[];
  /** 屏幕路径配置 */
  config: {
    /** 初始路由 */
    initialRouteName?: string;
    /** 屏幕路径映射 */
    screens: Record<string, PathConfig>;
  };
  /** 获取初始 URL */
  getInitialURL?: () => Promise<string | null | undefined>;
  /** 订阅 URL 变化 */
  subscribe?: (listener: (url: string) => void) => () => void;
}

// ============================================================================
// 导航器 Props
// ============================================================================

/**
 * 堆栈导航器 Props
 */
export interface StackNavigatorProps {
  /** 初始路由名称 */
  initialRouteName?: string;
  /** 屏幕选项配置 */
  screenOptions?: StackScreenOptions;
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
  drawerOptions?: DrawerOptions;
  /** 子元素 */
  children?: React.ReactNode;
}

// ============================================================================
// 模块声明扩展
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList, TabParamList, DrawerParamList {}
  }
}

export {};
