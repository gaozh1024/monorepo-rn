import React from 'react';
import { StackNavigator } from '@gaozh1024/rn-kit';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';

/**
 * 认证导航栈
 */
export function AuthStack() {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <StackNavigator.Screen name="Login" component={LoginScreen} />
      <StackNavigator.Screen name="Register" component={RegisterScreen} />
      <StackNavigator.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </StackNavigator>
  );
}
