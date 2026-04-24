/**
 * 堆栈导航器组件
 *
 * @module navigation/navigators/StackNavigator
 * @description 基于 @react-navigation/stack 的堆栈导航器封装
 */

import React from 'react';
import { createStackNavigator } from '../vendor/stack';
import type { StackParamList, StackNavigatorProps, StackRouteConfig } from '../types';

const NativeStack = createStackNavigator<StackParamList>();

/** 默认屏幕选项 */
const defaultScreenOptions = {
  headerShown: false,
};

/** 默认转场选项 */
const defaultTransitionOptions = {
  animation: 'slide_from_right',
} as const;

function shouldClearInheritedDefaultAnimation(options?: Record<string, unknown>) {
  return (
    options?.animation == null &&
    (options?.presentation != null ||
      options?.cardStyleInterpolator != null ||
      options?.gestureDirection != null ||
      options?.transitionSpec != null ||
      options?.headerStyleInterpolator != null)
  );
}

function mergeNavigatorScreenOptions(options?: Record<string, unknown>) {
  return {
    ...defaultScreenOptions,
    ...defaultTransitionOptions,
    ...(shouldClearInheritedDefaultAnimation(options) ? { animation: undefined } : null),
    ...options,
  };
}

/**
 * 堆栈导航器组件
 *
 * 封装 React Navigation 的 JS Stack Navigator，默认使用 iOS 风格的右滑推进转场。
 * 如需覆盖默认转场，请在 screenOptions 或单个 Screen options 中显式传入。
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
      screenOptions={callbackProps => {
        const resolvedOptions =
          typeof screenOptions === 'function' ? screenOptions(callbackProps) : screenOptions;
        return mergeNavigatorScreenOptions(resolvedOptions);
      }}
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
