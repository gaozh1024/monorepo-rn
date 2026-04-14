import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '@/theme';
import { AppView, AppText, AppPressable, Icon, useMotionConfig } from '@/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFocusedStatusBar } from '@/overlay';
import type { PressMotionProps, UseCollapsibleHeaderMotionReturn } from '@/ui/motion';

export interface RightIcon {
  icon: string;
  onPress: () => void;
  badge?: number;
}

export interface AppHeaderProps extends PressMotionProps {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  leftIcon?: string | null;
  leftIconColor?: string;
  onLeftPress?: () => void;
  rightIcons?: RightIcon[];
  rightIconColor?: string;
  transparent?: boolean;
  blur?: boolean;
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  collapsibleMotion?: Pick<
    UseCollapsibleHeaderMotionReturn,
    'headerStyle' | 'backgroundStyle' | 'titleStyle'
  >;
}

export function AppHeader({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  leftIcon = 'chevron-left',
  leftIconColor,
  onLeftPress,
  rightIcons = [],
  rightIconColor,
  transparent = false,
  safeArea = true,
  style,
  testID,
  motionPreset,
  motionDuration,
  motionReduceMotion,
  collapsibleMotion,
}: AppHeaderProps) {
  const motionConfig = useMotionConfig();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const resolvedMotionPreset = motionPreset ?? motionConfig.defaultPressPreset ?? 'soft';
  const flattenedStyle = StyleSheet.flatten(style);

  const backgroundColor = transparent
    ? 'transparent'
    : (flattenedStyle?.backgroundColor ?? colors.card);
  const titleAnimatedStyle = collapsibleMotion?.titleStyle;

  return (
    <>
      <AppFocusedStatusBar translucent backgroundColor="transparent" />
      <AppView
        testID={testID}
        style={[
          {
            backgroundColor,
            paddingTop: safeArea ? insets.top : 0,
            overflow: 'hidden',
            position: 'relative',
          },
          style,
        ]}
      >
        <Animated.View
          testID={testID ? `${testID}-background` : undefined}
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor },
            collapsibleMotion?.backgroundStyle,
          ]}
        />

        <Animated.View
          testID={testID ? `${testID}-nav` : undefined}
          style={[styles.container, collapsibleMotion?.headerStyle]}
        >
          <AppView row items="center" px={4} style={styles.fill}>
            <AppView style={[styles.sideContainer, styles.leftContainer]}>
              {leftIcon && (
                <AppPressable
                  onPress={onLeftPress}
                  style={styles.iconButton}
                  motionPreset={resolvedMotionPreset}
                  motionDuration={motionDuration}
                  motionReduceMotion={motionReduceMotion}
                >
                  <Icon name={leftIcon} size={24} color={leftIconColor ?? colors.text} />
                </AppPressable>
              )}
            </AppView>

            <AppView style={styles.centerContainer}>
              <Animated.View
                testID={testID ? `${testID}-title-wrap` : undefined}
                style={titleAnimatedStyle}
              >
                {title && (
                  <AppText
                    size="lg"
                    weight="semibold"
                    color={titleColor ?? colors.text}
                    style={styles.title}
                    numberOfLines={1}
                  >
                    {title}
                  </AppText>
                )}
                {subtitle && (
                  <AppText
                    size="xs"
                    color={subtitleColor ?? colors.textMuted}
                    style={styles.subtitle}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </AppText>
                )}
              </Animated.View>
            </AppView>

            <AppView row items="center" style={[styles.sideContainer, styles.rightContainer]}>
              {rightIcons.map((icon, index) => (
                <AppPressable
                  key={index}
                  onPress={icon.onPress}
                  style={styles.iconButton}
                  motionPreset={resolvedMotionPreset}
                  motionDuration={motionDuration}
                  motionReduceMotion={motionReduceMotion}
                >
                  <AppView>
                    <Icon name={icon.icon} size={24} color={rightIconColor ?? colors.text} />
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
        </Animated.View>
      </AppView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  sideContainer: {
    width: 70,
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
