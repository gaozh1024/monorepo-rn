/**
 * 堆栈导航器组件
 *
 * @module navigation/navigators/StackNavigator
 * @description 基于 @react-navigation/native-stack 的堆栈导航器封装
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { StackParamList, StackNavigatorProps, StackRouteConfig } from '../types';

const NativeStack = createNativeStackNavigator<StackParamList>();

/** 默认屏幕选项 */
const defaultScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  fullScreenGestureEnabled: true,
};

/**
 * 堆栈导航器组件
 *
 * 封装 React Navigation 的 Native Stack Navigator，提供默认配置
 *
 * @example
 * ```tsx
 * // JSX 方式
 * <StackNavigator initialRouteName="Home">
 *   <StackNavigator.Screen
 *     name="Home"
 *     component={HomeScreen}
 *     options={{ title: '首页' }}
 *   />
 *   <StackNavigator.Screen
 *     name="Detail"
 *     component={DetailScreen}
 *     options={{ title: '详情', headerShown: true }}
 *   />
 * </StackNavigator>
 * ```
 */
export function StackNavigator({ initialRouteName, screenOptions, children }: StackNavigatorProps) {
  return (
    <NativeStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ ...defaultScreenOptions, ...screenOptions }}
    >
      {children}
    </NativeStack.Navigator>
  );
}

/**
 * 堆栈屏幕组件
 * 直接使用原生 Screen 以确保 React Navigation v7 兼容性
 */
StackNavigator.Screen = NativeStack.Screen;

/**
 * 堆栈分组组件
 * 用于对屏幕进行分组配置
 */
StackNavigator.Group = NativeStack.Group;

/**
 * 基于配置创建堆栈导航器
 * 支持更灵活的路由配置方式
 *
 * @example
 * ```tsx
 * const stackConfig: StackRouteConfig[] = [
 *   { name: 'Home', component: HomeScreen, options: { title: '首页' } },
 *   { name: 'Detail', component: DetailScreen },
 * ];
 *
 * <StackNavigator initialRouteName="Home">
 *   {createStackScreens(stackConfig)}
 * </StackNavigator>
 * ```
 */
export function createStackScreens(routes: StackRouteConfig[]): React.ReactNode[] {
  return routes.map(route => (
    <StackNavigator.Screen
      key={route.name}
      name={route.name as keyof StackParamList}
      component={route.component}
      options={route.options}
      initialParams={route.initialParams}
    />
  ));
}
