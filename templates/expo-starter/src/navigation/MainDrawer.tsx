import React from 'react';
import { DrawerNavigator, Icon, useTheme, useThemeColors } from '@gaozh1024/rn-kit';
import { GlobalDrawerScreen } from '../features/drawer/screens/GlobalDrawerScreen';
import { MainTabs } from './MainTabs';
import { ROUTES } from './routes';

export function MainDrawer() {
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();

  return (
    <DrawerNavigator
      initialRouteName={ROUTES.MAIN_TABS}
      drawerOptions={{ drawerWidth: 300 }}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: isDark
          ? theme.colors.primary?.[900] || '#7c2d12'
          : theme.colors.primary?.[50] || '#fff7ed',
        drawerActiveTintColor: theme.colors.primary?.[500] || '#f38b32',
        drawerInactiveTintColor: colors.iconMuted,
      }}
    >
      <DrawerNavigator.Screen
        name={ROUTES.MAIN_TABS}
        component={MainTabs}
        options={{
          drawerLabel: '主页面',
          drawerIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <DrawerNavigator.Screen
        name={ROUTES.GLOBAL_DRAWER}
        component={GlobalDrawerScreen}
        options={{
          drawerLabel: '全局抽屉页',
          drawerIcon: ({ color, size }) => <Icon name="grid-view" color={color} size={size} />,
        }}
      />
    </DrawerNavigator>
  );
}
