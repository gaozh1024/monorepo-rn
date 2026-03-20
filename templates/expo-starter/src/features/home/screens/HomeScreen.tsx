import React from 'react';
import {
  AppScrollView,
  AppView,
  AppText,
  Card,
  Icon,
  AppPressable,
  useNavigation,
  AppFocusedStatusBar,
  useThemeColors,
  useTheme,
} from '@gaozh1024/rn-kit';
import { homeStats, quickActions, homeBanners } from '../../../data/mocks/home.mock';
import { useSessionStore } from '../../../store/session.store';

/**
 * 首页
 */
export function HomeScreen() {
  const { user } = useSessionStore();
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();
  const iconBadgeBg = isDark
    ? theme.colors.primary?.[900] || '#7c2d12'
    : theme.colors.primary?.[50] || '#fff7ed';

  const getStatColors = (color: string) => {
    const colorMap: Record<string, { value: string; badge: string }> = {
      warning: {
        value: isDark ? '#fdba74' : '#ea580c',
        badge: isDark ? '#7c2d12' : '#ffedd5',
      },
      success: {
        value: isDark ? '#86efac' : '#16a34a',
        badge: isDark ? '#14532d' : '#dcfce7',
      },
      info: {
        value: isDark ? '#93c5fd' : '#2563eb',
        badge: isDark ? '#1e3a8a' : '#dbeafe',
      },
    };
    return (
      colorMap[color] || {
        value: isDark ? '#d1d5db' : '#4b5563',
        badge: isDark ? '#374151' : '#f3f4f6',
      }
    );
  };

  const handleOpenDrawer = () => {
    const parent = navigation.getParent();
    const drawerParent = parent?.getParent?.() ?? parent;
    if (drawerParent && 'openDrawer' in drawerParent) {
      (drawerParent as { openDrawer: () => void }).openDrawer();
    }
  };

  return (
    <>
      <AppFocusedStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AppScrollView flex surface="background" contentInsetAdjustmentBehavior="never">
        {/* 顶部欢迎区 */}
        <AppView className="bg-primary-500 px-6 pt-12 pb-8">
          <AppView row className="items-center justify-between">
            <AppText size="sm" className="text-white/80">
              欢迎回来
            </AppText>
            <AppPressable
              onPress={handleOpenDrawer}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <Icon name="menu" size={20} color="#ffffff" />
            </AppPressable>
          </AppView>
          <AppText size="xl" weight="bold" className="text-white mt-1">
            {user?.name || '用户'}
          </AppText>
        </AppView>

        {/* 统计卡片 */}
        <AppView row className="px-4 -mt-4">
          {homeStats.map(stat => (
            <Card
              key={stat.key}
              className="flex-1 mx-1 p-4 items-center"
              style={{ backgroundColor: getStatColors(stat.color).badge }}
            >
              <AppText size="2xl" weight="bold" style={{ color: getStatColors(stat.color).value }}>
                {stat.value}
              </AppText>
              <AppText size="xs" tone="muted" className="mt-1">
                {stat.label}
              </AppText>
            </Card>
          ))}
        </AppView>

        {/* Banner */}
        <AppView className="px-4 mt-6">
          <Card className="p-6 bg-primary-500">
            <AppText size="lg" weight="bold" className="text-white">
              {homeBanners[0]?.title}
            </AppText>
            <AppText size="sm" className="text-white mt-1" style={{ opacity: 0.8 }}>
              {homeBanners[0]?.subtitle}
            </AppText>
          </Card>
        </AppView>

        {/* 快捷入口 */}
        <AppView className="px-4 mt-6">
          <AppText size="md" weight="semibold" className="mb-4">
            快捷入口
          </AppText>
          <AppView row className="gap-3" style={{ flexWrap: 'wrap' }}>
            {quickActions.map(action => (
              <AppPressable key={action.key} style={{ width: '48%' }}>
                <Card className="p-4 flex-row items-center gap-3">
                  <AppView
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: iconBadgeBg }}
                  >
                    <Icon name={action.icon} size={20} color="primary-500" />
                  </AppView>
                  <AppText size="sm" weight="medium" style={{ color: colors.textSecondary }}>
                    {action.title}
                  </AppText>
                </Card>
              </AppPressable>
            ))}
          </AppView>
        </AppView>

        {/* 底部占位 */}
        <AppView className="h-8" />
      </AppScrollView>
    </>
  );
}
