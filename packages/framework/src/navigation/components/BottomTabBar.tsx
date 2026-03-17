import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme';
import { AppText } from '@/ui';

export interface CustomBottomTabBarProps extends BottomTabBarProps {
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 激活颜色 */
  activeTintColor?: string;
  /** 未激活颜色 */
  inactiveTintColor?: string;
}

/**
 * 自定义底部标签栏
 * @example
 * ```tsx
 * <TabNavigator
 *   tabBar={props => <BottomTabBar {...props} showLabel={true} />}
 * >
 *   {...}
 * </TabNavigator>
 * ```
 */
export function BottomTabBar({
  state,
  descriptors,
  navigation,
  showLabel = true,
  activeTintColor,
  inactiveTintColor,
}: CustomBottomTabBarProps) {
  const { theme, isDark } = useTheme();

  const activeColor = activeTintColor || theme.colors.primary?.[500] || '#f38b32';
  const inactiveColor = inactiveTintColor || (isDark ? '#9ca3af' : '#6b7280');
  const backgroundColor = isDark ? '#1f2937' : '#ffffff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // 获取标签和图标
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const iconName = options.tabBarIcon
          ? (options.tabBarIcon as Function)({
              focused: isFocused,
              color: isFocused ? activeColor : inactiveColor,
              size: 24,
            })
          : null;

        // 徽标
        const badge = options.tabBarBadge;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View style={styles.iconContainer}>
              {iconName}
              {badge != null && (
                <View style={[styles.badge, { backgroundColor: activeColor }]}>
                  <AppText style={styles.badgeText}>
                    {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                  </AppText>
                </View>
              )}
            </View>
            {showLabel && (
              <AppText
                style={[styles.label, { color: isFocused ? activeColor : inactiveColor }]}
                numberOfLines={1}
              >
                {label as string}
              </AppText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 56,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
