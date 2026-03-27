/**
 * 路由配置类型
 * @module navigation/types/routes
 */

import type { StackScreenOptions, TabScreenOptions, DrawerScreenOptions } from './screens';

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
