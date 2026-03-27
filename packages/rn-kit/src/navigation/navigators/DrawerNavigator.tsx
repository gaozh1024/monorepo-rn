/**
 * 抽屉导航器组件
 *
 * @module navigation/navigators/DrawerNavigator
 * @description 基于 @react-navigation/drawer 的抽屉导航器封装
 */

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '@/theme';
import { createNavigationTheme } from '../utils/navigation-theme';
import type { DrawerParamList, DrawerNavigatorProps, DrawerRouteConfig } from '../types';

const NativeDrawer = createDrawerNavigator<DrawerParamList>();

/**
 * 抽屉导航器组件
 *
 * 封装 React Navigation 的 Drawer Navigator，自动集成主题
 *
 * @example
 * ```tsx
 * // 基础使用
 * <DrawerNavigator>
 *   <DrawerNavigator.Screen name="Home" component={HomeScreen} />
 *   <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
 * </DrawerNavigator>
 *
 * // 自定义抽屉内容
 * <DrawerNavigator drawerContent={props => <CustomDrawerContent {...props} />}>
 *   <DrawerNavigator.Screen name="Home" component={HomeScreen} />
 * </DrawerNavigator>
 * ```
 */
export function DrawerNavigator({
  initialRouteName,
  screenOptions,
  drawerContent,
  drawerOptions,
  children,
}: DrawerNavigatorProps) {
  const { theme, isDark } = useTheme();
  const navigationTheme = createNavigationTheme(theme, isDark);

  // 合并屏幕选项
  const mergedScreenOptions = React.useMemo(() => {
    return {
      headerShown: false,
      drawerStyle: {
        backgroundColor: navigationTheme.colors.card,
        width: drawerOptions?.drawerWidth || 280,
      },
      drawerActiveTintColor: theme.colors.primary?.[500] || '#f38b32',
      drawerInactiveTintColor: navigationTheme.colors.text,
      drawerLabelStyle: {
        fontSize: 16,
      },
      drawerType: drawerOptions?.drawerType,
      overlayColor: drawerOptions?.overlayColor,
      edgeWidth: drawerOptions?.edgeWidth,
      minSwipeDistance: drawerOptions?.minSwipeDistance,
      ...screenOptions,
    };
  }, [screenOptions, drawerOptions, navigationTheme, theme]);

  return (
    <NativeDrawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={mergedScreenOptions}
      drawerContent={drawerContent}
    >
      {children}
    </NativeDrawer.Navigator>
  );
}

/**
 * 抽屉屏幕组件
 * 直接使用原生 Screen 以确保 React Navigation v7 兼容性
 */
DrawerNavigator.Screen = NativeDrawer.Screen;

/**
 * 基于配置创建抽屉屏幕
 *
 * @example
 * ```tsx
 * const drawerConfig: DrawerRouteConfig[] = [
 *   { name: 'Home', component: HomeScreen, options: { drawerLabel: '首页' } },
 *   { name: 'Settings', component: SettingsScreen },
 * ];
 *
 * <DrawerNavigator>
 *   {createDrawerScreens(drawerConfig)}
 * </DrawerNavigator>
 * ```
 */
export function createDrawerScreens(routes: DrawerRouteConfig[]): React.ReactNode[] {
  return routes.map(route => (
    <DrawerNavigator.Screen
      key={route.name}
      name={route.name as keyof DrawerParamList}
      component={route.component}
      options={route.options}
      initialParams={route.initialParams}
    />
  ));
}
