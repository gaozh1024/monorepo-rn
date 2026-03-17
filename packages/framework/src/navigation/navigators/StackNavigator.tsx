import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { StackScreenOptions } from '../types';

const Stack = createNativeStackNavigator();

export interface StackNavigatorProps {
  initialRouteName?: string;
  screenOptions?: StackScreenOptions;
  children: React.ReactNode;
}

const defaultScreenOptions: StackScreenOptions = {
  headerShown: false, // 默认隐藏头部，使用自定义 AppHeader
};

export function StackNavigator({ initialRouteName, screenOptions, children }: StackNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ ...defaultScreenOptions, ...screenOptions }}
    >
      {children}
    </Stack.Navigator>
  );
}

export interface StackScreenProps {
  name: string;
  component: React.ComponentType<any>;
  options?: StackScreenOptions | ((props: { route: any; navigation: any }) => StackScreenOptions);
  initialParams?: object;
}

StackNavigator.Screen = function StackScreen({
  name,
  component,
  options,
  initialParams,
}: StackScreenProps) {
  return (
    <Stack.Screen
      name={name}
      component={component}
      options={options}
      initialParams={initialParams}
    />
  );
};
