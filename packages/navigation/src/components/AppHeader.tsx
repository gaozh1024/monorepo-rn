import React from 'react';
import { StatusBar, type ViewStyle } from 'react-native';
import { useTheme } from '@gaozh/rn-theme';
import { AppView, AppText, AppPressable, Icon } from '@gaozh/rn-ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface RightIcon {
  icon: string;
  onPress: () => void;
  badge?: number;
}

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  titleCenter?: boolean;
  leftIcon?: string;
  onLeftPress?: () => void;
  rightIcons?: RightIcon[];
  transparent?: boolean;
  blur?: boolean;
  safeArea?: boolean;
  style?: ViewStyle;
}

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
