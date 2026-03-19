import React from 'react';
import { StackNavigator } from '@gaozh1024/rn-kit';
import { LaunchScreen } from '../features/launch/screens/LaunchScreen';
import { useSessionStore } from '../store/session.store';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { ROUTES } from './routes';

/**
 * 根导航器
 */
export function RootNavigator() {
  const { isLoggedIn, isLoading } = useSessionStore();

  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <StackNavigator.Screen name={ROUTES.LAUNCH} component={LaunchScreen} />
      ) : isLoggedIn ? (
        <StackNavigator.Screen name={ROUTES.MAIN} component={MainTabs} />
      ) : (
        <StackNavigator.Screen name={ROUTES.AUTH} component={AuthStack} />
      )}
    </StackNavigator>
  );
}
