/**
 * 路由名称常量
 *
 * 单层导航配置 - 所有页面都在 RootStack 中
 */

export const ROUTES = {
  // 启动
  LAUNCH: 'Launch',

  // 认证
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Tab 主页面
  MAIN_TABS: 'MainTabs',

  // Tab 页面
  HOME: 'Home',
  MY: 'My',

  // 全局抽屉页
  GLOBAL_DRAWER: 'GlobalDrawer',

  // 我的页面组（二级页面，与 MainTabs 同级）
  MY_MAIN: 'MyMain',
  USER_INFO: 'UserInfo',
  SETTINGS: 'Settings',
  THEME: 'Theme',
  LANGUAGE: 'Language',
  ABOUT: 'About',
} as const;
