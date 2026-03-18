import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme } from '@/theme';
import { AppText, AppView, Icon } from '@/ui';

/**
 * 抽屉菜单项配置
 */
export interface DrawerItem {
  /** 路由名称 */
  name: string;
  /** 显示标签 */
  label: string;
  /** 图标名称 */
  icon?: string;
  /** 徽标 */
  badge?: number | string;
}

/**
 * 抽屉内容组件 Props
 */
export interface DrawerContentProps extends DrawerContentComponentProps {
  /** 头部内容（如用户信息） */
  header?: React.ReactNode;
  /** 底部内容（如退出按钮） */
  footer?: React.ReactNode;
  /** 自定义项目列表（如果不提供则使用路由列表） */
  items?: DrawerItem[];
  /** 激活背景色 */
  activeBackgroundColor?: string;
  /** 激活文字颜色 */
  activeTintColor?: string;
  /** 未激活文字颜色 */
  inactiveTintColor?: string;
}

/**
 * 抽屉内容组件
 *
 * 自定义抽屉导航的内容模板，支持头部、底部、自定义菜单项等
 *
 * @example
 * ```tsx
 * <DrawerNavigator
 *   drawerContent={props => (
 *     <DrawerContent
 *       {...props}
 *       header={<UserInfo name="张三" email="zhangsan@example.com" />}
 *       footer={<LogoutButton />}
 *       items={[
 *         { name: 'Home', label: '首页', icon: 'home' },
 *         { name: 'Settings', label: '设置', icon: 'settings' }
 *       ]}
 *     />
 *   )}
 * >
 *   <DrawerNavigator.Screen name="Home" component={HomeScreen} />
 *   <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
 * </DrawerNavigator>
 * ```
 */
export function DrawerContent({
  state,
  descriptors,
  navigation,
  header,
  footer,
  items,
  activeBackgroundColor,
  activeTintColor,
  inactiveTintColor,
}: DrawerContentProps) {
  const { theme, isDark } = useTheme();

  const activeBgColor = activeBackgroundColor || theme.colors.primary?.[50] || '#fff7ed';
  const activeColor = activeTintColor || theme.colors.primary?.[500] || '#f38b32';
  const inactiveColor = inactiveTintColor || (isDark ? '#d1d5db' : '#4b5563');

  // 使用自定义项目或从路由生成
  const drawerItems: DrawerItem[] =
    items ||
    state.routes.map(route => {
      const descriptor = descriptors[route.key];
      const options = descriptor.options;
      return {
        name: route.name,
        label: (options.drawerLabel as string) || options.title || route.name,
        icon: (options.drawerIcon as any)?.({ size: 24, color: inactiveColor })?.props?.name,
        badge: (options as any).tabBarBadge as number | string,
      };
    });

  return (
    <DrawerContentScrollView
      style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}
    >
      {/* 头部 */}
      {header && <View style={styles.header}>{header}</View>}

      {/* 菜单列表 */}
      <AppView className="py-2">
        {drawerItems.map(item => {
          const isFocused = state.routes[state.index].name === item.name;

          const onPress = () => {
            navigation.navigate(item.name);
          };

          return (
            <TouchableOpacity
              key={item.name}
              onPress={onPress}
              style={[styles.item, isFocused && { backgroundColor: activeBgColor }]}
            >
              {item.icon && (
                <View style={styles.iconContainer}>
                  <Icon
                    name={item.icon}
                    size="md"
                    color={isFocused ? activeColor : inactiveColor}
                  />
                </View>
              )}
              <AppText
                style={[
                  styles.label,
                  { color: isFocused ? activeColor : inactiveColor },
                  isFocused && styles.activeLabel,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </AppText>
              {item.badge != null && (
                <View style={[styles.badge, { backgroundColor: activeColor }]}>
                  <AppText style={styles.badgeText}>
                    {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </AppView>

      {/* 底部 */}
      {footer && <View style={styles.footer}>{footer}</View>}
    </DrawerContentScrollView>
  );
}

/** 组件样式 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  activeLabel: {
    fontWeight: '600',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
});
