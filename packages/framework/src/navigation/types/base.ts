/**
 * 导航基础类型
 * @module navigation/types/base
 */

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
