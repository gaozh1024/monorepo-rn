import React from 'react';
import { StackNavigator } from '@gaozh1024/rn-kit';
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

const fadeScreenOptions = {
  animation: 'fade' as const,
  headerShown: false,
};

/**
 * 根导航器 - 单层导航配置，无 header 配置
 *
 * 所有页面的 header 都在各自页面中通过 AppHeader 组件配置
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
            <StackNavigator.Screen
              name={ROUTES.LOGIN}
              component={LoginScreen}
              options={fadeScreenOptions}
            />
            <StackNavigator.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
            <StackNavigator.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
          </>
        )}
      </StackNavigator>
    );
  }

  // 已登录状态 - 单层导航
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      {/* Tab 主页面 */}
      <StackNavigator.Screen
        name={ROUTES.MAIN_TABS}
        component={MainTabs}
        options={fadeScreenOptions}
      />

      {/* 全局抽屉页 */}
      <StackNavigator.Screen name={ROUTES.GLOBAL_DRAWER} component={GlobalDrawerScreen} />

      {/* 我的页面组 */}
      <StackNavigator.Screen name={ROUTES.MY_MAIN} component={MyScreen} />

      {/* 二级页面 */}
      <StackNavigator.Screen name={ROUTES.USER_INFO} component={UserInfoScreen} />
      <StackNavigator.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <StackNavigator.Screen name={ROUTES.THEME} component={ThemeScreen} />
      <StackNavigator.Screen name={ROUTES.LANGUAGE} component={LanguageScreen} />
      <StackNavigator.Screen name={ROUTES.ABOUT} component={AboutScreen} />
    </StackNavigator>
  );
}
