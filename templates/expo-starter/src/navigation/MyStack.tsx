import React from 'react';
import { StackNavigator } from '@gaozh1024/rn-kit';
import { MyScreen } from '../features/profile/screens/MyScreen';
import { UserInfoScreen } from '../features/profile/screens/UserInfoScreen';
import { SettingsScreen } from '../features/profile/screens/SettingsScreen';
import { ThemeScreen } from '../features/profile/screens/ThemeScreen';
import { LanguageScreen } from '../features/profile/screens/LanguageScreen';
import { AboutScreen } from '../features/profile/screens/AboutScreen';

/**
 * 我的页面导航栈
 */
export function MyStack() {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="MyMain" component={MyScreen} />
      <StackNavigator.Screen name="UserInfo" component={UserInfoScreen} />
      <StackNavigator.Screen name="Settings" component={SettingsScreen} />
      <StackNavigator.Screen name="Theme" component={ThemeScreen} />
      <StackNavigator.Screen name="Language" component={LanguageScreen} />
      <StackNavigator.Screen name="About" component={AboutScreen} />
    </StackNavigator>
  );
}
