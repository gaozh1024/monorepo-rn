import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LaunchScreen } from '../features/launch/screens/LaunchScreen';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * 根导航器
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={ROUTES.LAUNCH}
      >
        <Stack.Screen name={ROUTES.LAUNCH} component={LaunchScreen} />
        <Stack.Screen name={ROUTES.AUTH} component={AuthStack} />
        <Stack.Screen name={ROUTES.MAIN} component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
