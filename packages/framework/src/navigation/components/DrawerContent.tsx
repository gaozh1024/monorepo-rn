import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useTheme, useThemeColors } from '@/theme';
import { AppText, AppView, Icon, AppPressable, Presence, StaggerItem, useMotionConfig } from '@/ui';
import type { PresencePreset, PressMotionProps, StaggerMotionProps } from '@/ui/motion';

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
export interface DrawerContentProps
  extends DrawerContentComponentProps, PressMotionProps, StaggerMotionProps {
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
  /** 是否启用菜单项错峰动画 */
  staggerItems?: boolean;
  /** 是否显示激活态指示条 */
  showActiveIndicator?: boolean;
  /** 激活态指示条颜色 */
  activeIndicatorColor?: string;
  /** 激活态指示条显隐动画预设 */
  indicatorMotionPreset?: PresencePreset;
  /** 激活态指示条显隐动画时长 */
  indicatorMotionDuration?: number;
  /** 激活态指示条进入动画时长 */
  indicatorMotionEnterDuration?: number;
  /** 激活态指示条退出动画时长 */
  indicatorMotionExitDuration?: number;
  /** 激活态指示条动画距离 */
  indicatorMotionDistance?: number;
  /** 是否关闭激活态指示条动画 */
  indicatorMotionReduceMotion?: boolean;
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
  staggerItems = false,
  motionPreset,
  motionDuration,
  motionReduceMotion,
  staggerPreset,
  staggerMs,
  staggerBaseDelayMs,
  staggerDuration,
  staggerDistance,
  staggerReduceMotion,
  showActiveIndicator = true,
  activeIndicatorColor,
  indicatorMotionPreset,
  indicatorMotionDuration,
  indicatorMotionEnterDuration,
  indicatorMotionExitDuration,
  indicatorMotionDistance,
  indicatorMotionReduceMotion,
}: DrawerContentProps) {
  const motionConfig = useMotionConfig();
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();
  const resolvedMotionPreset = motionPreset ?? motionConfig.defaultPressPreset ?? 'soft';

  const activeBgColor =
    activeBackgroundColor ||
    (isDark ? colors.primarySurface : theme.colors.primary?.[50] || '#fff7ed');
  const activeColor = activeTintColor || colors.primary;
  const inactiveColor = inactiveTintColor || (isDark ? '#d1d5db' : '#4b5563');
  const backgroundColor = colors.card;
  const dividerColor = colors.divider;
  const indicatorColor = activeIndicatorColor || activeColor;

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
    <DrawerContentScrollView style={[styles.container, { backgroundColor }]}>
      {/* 头部 */}
      {header && <View style={[styles.header, { borderBottomColor: dividerColor }]}>{header}</View>}

      {/* 菜单列表 */}
      <AppView className="py-2">
        {drawerItems.map((item, index) => {
          const isFocused = state.routes[state.index].name === item.name;
          const badgeContent =
            typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge;

          const onPress = () => {
            navigation.navigate(item.name);
          };

          const row = (
            <AppPressable
              testID={`drawer-item-${item.name}`}
              onPress={onPress}
              motionPreset={resolvedMotionPreset}
              motionDuration={motionDuration}
              motionReduceMotion={motionReduceMotion}
              style={[styles.item, isFocused && { backgroundColor: activeBgColor }]}
            >
              {showActiveIndicator && (
                <Presence
                  visible={isFocused}
                  preset={indicatorMotionPreset ?? 'slideRight'}
                  motionDuration={indicatorMotionDuration}
                  motionEnterDuration={indicatorMotionEnterDuration}
                  motionExitDuration={indicatorMotionExitDuration}
                  motionDistance={indicatorMotionDistance}
                  motionReduceMotion={indicatorMotionReduceMotion}
                >
                  <View
                    testID={`drawer-item-${item.name}-indicator`}
                    style={[styles.activeIndicator, { backgroundColor: indicatorColor }]}
                  />
                </Presence>
              )}
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
                testID={`drawer-item-${item.name}-label`}
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
                <View
                  testID={`drawer-item-${item.name}-badge`}
                  style={[styles.badge, { backgroundColor: activeColor }]}
                >
                  <AppText style={styles.badgeText}>{badgeContent}</AppText>
                </View>
              )}
            </AppPressable>
          );

          if (!staggerItems) return <React.Fragment key={item.name}>{row}</React.Fragment>;

          return (
            <StaggerItem
              key={item.name}
              index={index}
              visible
              staggerPreset={staggerPreset}
              staggerMs={staggerMs}
              staggerBaseDelayMs={staggerBaseDelayMs}
              staggerDuration={staggerDuration}
              staggerDistance={staggerDistance}
              staggerReduceMotion={staggerReduceMotion}
            >
              {row}
            </StaggerItem>
          );
        })}
      </AppView>

      {/* 底部 */}
      {footer && <View style={[styles.footer, { borderTopColor: dividerColor }]}>{footer}</View>}
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
    borderBottomWidth: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderRadius: 999,
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
    borderTopWidth: 0.5,
  },
});
