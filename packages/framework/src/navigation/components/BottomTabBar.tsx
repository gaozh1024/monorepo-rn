import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme';
import { AppText } from '@/ui';

/**
 * 自定义底部标签栏组件 Props
 * 继承自 @react-navigation/bottom-tabs 的 BottomTabBarProps
 */
export interface CustomBottomTabBarProps extends BottomTabBarProps {
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 激活颜色 */
  activeTintColor?: string;
  /** 未激活颜色 */
  inactiveTintColor?: string;
  /** TabBar 高度（默认 65） */
  height?: number;
}

/** 默认 TabBar 高度 */
const DEFAULT_TAB_BAR_HEIGHT = 65;

/**
 * 自定义底部标签栏组件
 *
 * 自定义样式的底部标签栏，支持徽标、图标、标签等
 *
 * @example
 * ```tsx
 * <TabNavigator
 *   tabBar={props => <BottomTabBar {...props} showLabel={true} activeTintColor="#f38b32" />}
 * >
 *   <TabNavigator.Screen name="Home" component={HomeScreen} />
 *   <TabNavigator.Screen name="Profile" component={ProfileScreen} />
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
  height = DEFAULT_TAB_BAR_HEIGHT,
}: CustomBottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const activeColor = activeTintColor || theme.colors.primary?.[500] || '#f38b32';
  const inactiveColor = inactiveTintColor || (isDark ? '#9ca3af' : '#6b7280');
  const backgroundColor = isDark ? '#1f2937' : '#ffffff';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, height: height + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
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

/** 组件样式 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
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
    paddingVertical: 6,
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
