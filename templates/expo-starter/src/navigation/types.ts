import type { NativeStackNavigationProp } from '@gaozh1024/rn-kit';

/**
 * 模板导航类型定义
 *
 * 约定：
 * - 页面与业务代码优先依赖本文件导出的类型
 * - 导航 hook 优先从 `@gaozh1024/rn-kit` 导入
 * - 页面层尽量不直接依赖 `@react-navigation/*`
 */

/** 根栈参数列表 */
export type RootStackParamList = {
  Launch: undefined;
  Auth: undefined;
  Main: undefined;
};

export type MainDrawerParamList = {
  MainTabs: undefined;
  GlobalDrawer: undefined;
};

/** 认证栈参数列表 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/** 主 Tab 参数列表 */
export type MainTabParamList = {
  Home: undefined;
  My: undefined;
};

/** “我的”页面栈参数列表 */
export type MyStackParamList = {
  MyMain: undefined;
  UserInfo: undefined;
  Settings: undefined;
  Theme: undefined;
  Language: undefined;
  About: undefined;
};

/** 常用导航类型别名 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MyNavigationProp = NativeStackNavigationProp<MyStackParamList>;

// 给 React Navigation / rn-kit 的 useNavigation 提供全局 Root 类型
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
