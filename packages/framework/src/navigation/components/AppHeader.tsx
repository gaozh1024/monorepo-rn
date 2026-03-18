import React from 'react';
import { StatusBar, type ViewStyle } from 'react-native';
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
  /** 标题是否居中（默认根据左侧图标自适应） */
  titleCenter?: boolean;
  /** 左侧图标名称（默认为 'arrow-back'） */
  leftIcon?: string;
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
 * 统一的应用顶部导航栏，支持自定义左右按钮、标题、徽标等
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
      <AppView row items="center" justify="between" px={4} style={{ height: 56 }}>
        {/* Left */}
        <AppView style={{ width: 80 }}>
          {leftIcon && (
            <AppPressable onPress={onLeftPress} className="p-2">
              <Icon name={leftIcon} size={24} color={textColor} />
            </AppPressable>
          )}
        </AppView>

        {/* Center */}
        <AppView flex center>
          {title && (
            <AppText size="lg" weight="semibold" style={{ color: textColor }} numberOfLines={1}>
              {title}
            </AppText>
          )}
          {subtitle && (
            <AppText size="sm" color="gray-500" numberOfLines={1}>
              {subtitle}
            </AppText>
          )}
        </AppView>

        {/* Right */}
        <AppView row items="center" justify="end" style={{ width: 80 }} gap={2}>
          {rightIcons.map((icon, index) => (
            <AppPressable key={index} onPress={icon.onPress} className="p-2">
              <AppView>
                <Icon name={icon.icon} size={24} color={textColor} />
                {icon.badge ? (
                  <AppView className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error-500 items-center justify-center">
                    <AppText size="xs" color="white">
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
