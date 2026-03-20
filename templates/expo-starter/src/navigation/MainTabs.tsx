import React from 'react';
import { TabNavigator, Icon, useTheme, useThemeColors } from '@gaozh1024/rn-kit';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { MyStack } from './MyStack';

/**
 * 主 Tab 导航
 */
export function MainTabs() {
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();

  return (
    <TabNavigator
      tabBarOptions={{
        activeBackgroundColor: isDark
          ? theme.colors.primary?.[900] || '#7c2d12'
          : theme.colors.primary?.[50] || '#fff7ed',
        activeTintColor: theme.colors.primary?.[500] || '#f38b32',
        height: 72,
        inactiveTintColor: colors.iconMuted,
        labelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        style: {
          borderTopWidth: 0,
          backgroundColor: colors.card,
        },
      }}
    >
      <TabNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <TabNavigator.Screen
        name="My"
        component={MyStack}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
        }}
      />
    </TabNavigator>
  );
}
