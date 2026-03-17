import React from 'react';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { useTheme } from '@/theme';
import { createNavigationTheme } from '../utils/navigation-theme';

export type DrawerNavigatorProps = {
  initialRouteName?: string;
  screenOptions?: DrawerNavigationOptions;
  drawerContent?: (props: any) => React.ReactNode;
  children: React.ReactNode;
};

const Drawer = createDrawerNavigator();

/**
 * 抽屉导航器封装
 * @example
 * ```tsx
 * <DrawerNavigator
 *   initialRouteName="Home"
 *   drawerContent={props => <CustomDrawerContent {...props} />}
 * >
 *   <DrawerNavigator.Screen name="Home" component={HomeScreen} />
 *   <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
 * </DrawerNavigator>
 * ```
 */
export function DrawerNavigator({
  initialRouteName,
  screenOptions,
  drawerContent,
  children,
}: DrawerNavigatorProps) {
  const { theme, isDark } = useTheme();
  const navigationTheme = createNavigationTheme(theme, isDark);

  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        drawerStyle: {
          backgroundColor: navigationTheme.colors.card,
          width: 280,
        },
        drawerActiveTintColor: theme.colors.primary?.[500] || '#f38b32',
        drawerInactiveTintColor: navigationTheme.colors.text,
        drawerLabelStyle: {
          fontSize: 16,
        },
        ...screenOptions,
      }}
      drawerContent={drawerContent}
    >
      {children}
    </Drawer.Navigator>
  );
}

// 绑定 Screen 组件
DrawerNavigator.Screen = Drawer.Screen;
