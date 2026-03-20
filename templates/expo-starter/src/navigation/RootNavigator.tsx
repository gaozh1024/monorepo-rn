import React from 'react';
import { StackNavigator, AppHeader } from '@gaozh1024/rn-kit';
import { LaunchScreen } from '../features/launch/screens/LaunchScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';
import { MainTabs } from './MainTabs';
import { GlobalDrawerScreen } from '../features/drawer/screens/GlobalDrawerScreen';
import { MyScreen } from '../features/profile/screens/MyScreen';
import { UserInfoScreen } from '../features/profile/screens/UserInfoScreen';
import { SettingsScreen } from '../features/profile/screens/SettingsScreen';
import { ThemeScreen } from '../features/profile/screens/ThemeScreen';
import { LanguageScreen } from '../features/profile/screens/LanguageScreen';
import { AboutScreen } from '../features/profile/screens/AboutScreen';
import { useSessionStore } from '../store/session.store';
import { ROUTES } from './routes';

/**
 * 根导航器 - 单层导航配置
 *
 * 结构：
 * - Launch: 启动页
 * - Login/Register/ForgotPassword: 认证页
 * - MainTabs: Tab 导航（Home, My）
 * - GlobalDrawer: 全局抽屉页
 * - MyMain: 我的页面（Tab 页之一）
 * - UserInfo/Settings/Theme/Language/About: 二级页面（与 Tab 同级，自动隐藏 Tab）
 */
export function RootNavigator() {
  const { isLoggedIn, isLoading } = useSessionStore();

  // 未登录状态
  if (!isLoggedIn) {
    return (
      <StackNavigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <StackNavigator.Screen name={ROUTES.LAUNCH} component={LaunchScreen} />
        ) : (
          <>
            <StackNavigator.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <StackNavigator.Screen
              name={ROUTES.REGISTER}
              component={RegisterScreen}
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <AppHeader
                    title="注册账号"
                    leftIcon="arrow-back"
                    onLeftPress={() => navigation.goBack()}
                  />
                ),
              }}
            />
            <StackNavigator.Screen
              name={ROUTES.FORGOT_PASSWORD}
              component={ForgotPasswordScreen}
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <AppHeader
                    title="找回密码"
                    leftIcon="arrow-back"
                    onLeftPress={() => navigation.goBack()}
                  />
                ),
              }}
            />
          </>
        )}
      </StackNavigator>
    );
  }

  // 已登录状态 - 单层导航，所有页面同级
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      {/* Tab 主页面 */}
      <StackNavigator.Screen name={ROUTES.MAIN_TABS} component={MainTabs} />

      {/* 全局抽屉页 */}
      <StackNavigator.Screen name={ROUTES.GLOBAL_DRAWER} component={GlobalDrawerScreen} />

      {/* 我的页面组 - 与 MainTabs 同级，自动隐藏 Tab */}
      <StackNavigator.Screen name={ROUTES.MY_MAIN} component={MyScreen} />

      {/* 二级页面 - 带 AppHeader */}
      <StackNavigator.Screen
        name={ROUTES.USER_INFO}
        component={UserInfoScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              title="用户信息"
              leftIcon="arrow-back"
              onLeftPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <StackNavigator.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader title="设置" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
          ),
        }}
      />
      <StackNavigator.Screen
        name={ROUTES.THEME}
        component={ThemeScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              title="主题模式"
              leftIcon="arrow-back"
              onLeftPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <StackNavigator.Screen
        name={ROUTES.LANGUAGE}
        component={LanguageScreen}
        options={{
          headerShown: true,
          header: ({ navigation }) => (
            <AppHeader
              title="语言设置"
              leftIcon="arrow-back"
              onLeftPress={() => navigation.goBack()}
            />
          ),
        }}
      />
      <StackNavigator.Screen name={ROUTES.ABOUT} component={AboutScreen} />
    </StackNavigator>
  );
}
