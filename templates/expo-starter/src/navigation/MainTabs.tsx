import React from 'react';
import { TabNavigator, Icon } from '@gaozh1024/rn-kit';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { MyStack } from './MyStack';

/**
 * 主 Tab 导航
 */
export function MainTabs() {
  return (
    <TabNavigator
      tabBarOptions={{
        activeTintColor: '#f38b32',
        inactiveTintColor: '#9ca3af',
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
