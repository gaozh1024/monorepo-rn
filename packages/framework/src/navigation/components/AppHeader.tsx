import React from 'react';
import { StatusBar, type ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';
import { AppView, AppText, AppPressable, Icon } from '@/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * 右侧图标配置
 */
export interface RightIcon {
  /** 图标名称 */
  icon: string;
  /** 点击回调 */
  onPress: () => void;
  /** 徽标数量（可选） */
  badge?: number;
}

/**
 * 应用头部组件 Props
 */
export interface AppHeaderProps {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subtitle?: string;
  /** 左侧图标名称（默认为 'arrow-back'） */
  leftIcon?: string | null;
  /** 左侧图标点击回调 */
  onLeftPress?: () => void;
  /** 右侧图标列表 */
  rightIcons?: RightIcon[];
  /** 是否透明背景 */
  transparent?: boolean;
  /** 是否启用模糊效果（暂未实现） */
  blur?: boolean;
  /** 是否包含安全区域（默认为 true） */
  safeArea?: boolean;
  /** 自定义样式 */
  style?: ViewStyle;
}

/**
 * 应用头部组件
 *
 * iOS 风格的顶部导航栏，标题始终居中，不受左右按钮影响
 *
 * @example
 * ```tsx
 * // 基本用法
 * <AppHeader title="首页" />
 *
 * // 带右侧按钮
 * <AppHeader
 *   title="消息"
 *   rightIcons={[
 *     { icon: 'search', onPress: () => {} },
 *     { icon: 'notifications', onPress: () => {}, badge: 5 }
 *   ]}
 * />
 *
 * // 透明背景
 * <AppHeader title="详情" transparent onLeftPress={() => navigation.goBack()} />
 *
 * // 无左侧按钮
 * <AppHeader title="首页" leftIcon={null} />
 * ```
 */
export function AppHeader({
  title,
  subtitle,
  leftIcon = 'arrow-back',
  onLeftPress,
  rightIcons = [],
  transparent = false,
  safeArea = true,
  style,
}: AppHeaderProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = transparent
    ? 'transparent'
    : isDark
      ? theme.colors.card?.[500] || '#1a1a1a'
      : theme.colors.card?.[500] || '#ffffff';

  const textColor = isDark ? '#ffffff' : '#000000';

  return (
    <AppView
      style={[
        {
          backgroundColor,
          paddingTop: safeArea ? insets.top : 0,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
        translucent={transparent}
      />
      {/* iOS 风格导航栏：标题始终居中 */}
      <AppView row items="center" px={4} style={styles.container}>
        {/* 左侧按钮区域 - 固定宽度 70，左对齐 */}
        <AppView style={[styles.sideContainer, styles.leftContainer]}>
          {leftIcon && (
            <AppPressable onPress={onLeftPress} style={styles.iconButton}>
              <Icon name={leftIcon} size={24} color={textColor} />
            </AppPressable>
          )}
        </AppView>

        {/* 中间标题区域 - 绝对居中 */}
        <AppView style={styles.centerContainer}>
          {title && (
            <AppText
              size="lg"
              weight="semibold"
              style={[styles.title, { color: textColor }]}
              numberOfLines={1}
            >
              {title}
            </AppText>
          )}
          {subtitle && (
            <AppText
              size="xs"
              style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          )}
        </AppView>

        {/* 右侧按钮区域 - 固定宽度 70，右对齐 */}
        <AppView row items="center" style={[styles.sideContainer, styles.rightContainer]}>
          {rightIcons.map((icon, index) => (
            <AppPressable key={index} onPress={icon.onPress} style={styles.iconButton}>
              <AppView>
                <Icon name={icon.icon} size={24} color={textColor} />
                {icon.badge ? (
                  <AppView style={styles.badge}>
                    <AppText size="xs" color="white" style={styles.badgeText}>
                      {icon.badge > 99 ? '99+' : icon.badge}
                    </AppText>
                  </AppView>
                ) : null}
              </AppView>
            </AppPressable>
          ))}
        </AppView>
      </AppView>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44, // iOS 标准导航栏高度
  },
  sideContainer: {
    width: 70, // 固定宽度，确保标题居中
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    justifyContent: 'flex-start',
  },
  rightContainer: {
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
