import React from 'react';
import { TabNavigator, Icon, useTheme } from '@gaozh1024/rn-kit';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { MyScreen } from '../features/profile/screens/MyScreen';
import { appColors } from '../bootstrap/theme';
import { ROUTES } from './routes';

/**
 * 主 Tab 导航 - 单层导航
 * 只包含 Home 和 My 两个 Tab 页
 * 其他二级页面直接定义在 RootStack 中，不在此处
 */
export function MainTabs() {
  const { isDark } = useTheme();

  return (
    <TabNavigator
      tabBarOptions={{
        activeTintColor: appColors.primary[500],
        inactiveTintColor: isDark ? appColors.slate[500] : appColors.slate[400],
        height: 84,
        labelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 10,
        },
        iconStyle: {
          marginTop: 8,
        },
        style: {
          backgroundColor: isDark ? appColors.slate[900] : '#ffffff',
          borderTopWidth: 0,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 12,
          elevation: 12,
        },
      }}
    >
      <TabNavigator.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <TabNavigator.Screen
        name={ROUTES.MY}
        component={MyScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
        }}
      />
    </TabNavigator>
  );
}
