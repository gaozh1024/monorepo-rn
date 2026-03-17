import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabBarOptions } from '../types';

const Tab = createBottomTabNavigator();

export interface TabNavigatorProps {
  initialRouteName?: string;
  tabBarOptions?: TabBarOptions;
  tabBar?: React.ComponentType<any>;
  children: React.ReactNode;
}

const defaultScreenOptions = {
  headerShown: false, // 默认隐藏头部
};

export function TabNavigator({
  initialRouteName,
  tabBarOptions,
  tabBar,
  children,
}: TabNavigatorProps) {
  const screenOptions = React.useMemo(() => {
    const options: any = { ...defaultScreenOptions };
    if (tabBarOptions?.showLabel !== undefined) {
      options.tabBarShowLabel = tabBarOptions.showLabel;
    }
    if (tabBarOptions?.activeTintColor) {
      options.tabBarActiveTintColor = tabBarOptions.activeTintColor;
    }
    if (tabBarOptions?.inactiveTintColor) {
      options.tabBarInactiveTintColor = tabBarOptions.inactiveTintColor;
    }
    if (tabBarOptions?.activeBackgroundColor) {
      options.tabBarActiveBackgroundColor = tabBarOptions.activeBackgroundColor;
    }
    if (tabBarOptions?.hideOnKeyboard !== undefined) {
      options.tabBarHideOnKeyboard = tabBarOptions.hideOnKeyboard;
    }
    return options;
  }, [tabBarOptions]);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={screenOptions}
      tabBar={tabBar as any}
    >
      {children}
    </Tab.Navigator>
  );
}

export interface TabScreenProps {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
}

TabNavigator.Screen = function TabScreen({ name, component, options }: TabScreenProps) {
  return <Tab.Screen name={name} component={component} options={options} />;
};
