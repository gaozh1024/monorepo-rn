import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MyScreen } from '../features/profile/screens/MyScreen';
import { UserInfoScreen } from '../features/profile/screens/UserInfoScreen';
import { SettingsScreen } from '../features/profile/screens/SettingsScreen';
import { ThemeScreen } from '../features/profile/screens/ThemeScreen';
import { LanguageScreen } from '../features/profile/screens/LanguageScreen';
import { AboutScreen } from '../features/profile/screens/AboutScreen';
import type { MyStackParamList } from './types';

const Stack = createStackNavigator<MyStackParamList>();

/**
 * 我的页面导航栈
 */
export function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MyMain" component={MyScreen} />
      <Stack.Screen name="UserInfo" component={UserInfoScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
