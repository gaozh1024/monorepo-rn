/**
 * 导航类型定义
 */

// Root Stack 参数列表
export type RootStackParamList = {
  Launch: undefined;
  Auth: undefined;
  Main: undefined;
};

// Auth Stack 参数列表
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tabs 参数列表
export type MainTabParamList = {
  Home: undefined;
  My: undefined;
};

// My Stack 参数列表
export type MyStackParamList = {
  MyMain: undefined;
  UserInfo: undefined;
  Settings: undefined;
  Theme: undefined;
  Language: undefined;
  About: undefined;
};

// 声明模块类型
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
