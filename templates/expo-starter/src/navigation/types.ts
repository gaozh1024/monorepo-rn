import type { NativeStackNavigationProp } from '@gaozh1024/rn-kit';

/**
 * 模板导航类型定义
 *
 * 约定：
 * - 页面与业务代码优先依赖本文件导出的类型
 * - 导航 hook 优先从 `@gaozh1024/rn-kit` 导入
 * - 页面层尽量不直接依赖 `@react-navigation/*`
 */

/** 根栈参数列表 - 单层导航 */
export type RootStackParamList = {
  // 启动页
  Launch: undefined;

  // 认证页
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  // Tab 主页面
  MainTabs: undefined;

  // 全局抽屉页
  GlobalDrawer: undefined;

  // 我的页面组（二级页面，与 MainTabs 同级）
  MyMain: undefined;
  UserInfo: undefined;
  Settings: undefined;
  Theme: undefined;
  Language: undefined;
  About: undefined;
};

/** 主 Tab 参数列表 */
export type MainTabParamList = {
  Home: undefined;
  My: undefined;
};

/** 常用导航类型别名 */
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 给 React Navigation / rn-kit 的 useNavigation 提供全局 Root 类型
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
