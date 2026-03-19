import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, Card, Icon, AppPressable } from '@gaozh1024/rn-kit';
import { homeStats, quickActions, homeBanners } from '../../../data/mocks/home.mock';
import { useSessionStore } from '../../../store/session.store';

/**
 * 首页
 */
export function HomeScreen() {
  const { user } = useSessionStore();

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      warning: 'bg-orange-100 text-orange-600',
      success: 'bg-green-100 text-green-600',
      info: 'bg-blue-100 text-blue-600',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* 顶部欢迎区 */}
      <AppView className="bg-primary-500 px-6 pt-12 pb-8">
        <AppText size="sm" className="text-white/80">
          欢迎回来
        </AppText>
        <AppText size="xl" weight="bold" className="text-white mt-1">
          {user?.name || '用户'}
        </AppText>
      </AppView>

      {/* 统计卡片 */}
      <AppView row className="px-4 -mt-4">
        {homeStats.map(stat => (
          <Card key={stat.key} className="flex-1 mx-1 p-4 items-center">
            <AppText size="2xl" weight="bold" className={getColorClass(stat.color).split(' ')[1]}>
              {stat.value}
            </AppText>
            <AppText size="xs" color="gray-500" className="mt-1">
              {stat.label}
            </AppText>
          </Card>
        ))}
      </AppView>

      {/* Banner */}
      <AppView className="px-4 mt-6">
        <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-600">
          <AppText size="lg" weight="bold" className="text-white">
            {homeBanners[0]?.title}
          </AppText>
          <AppText size="sm" className="text-white/80 mt-1">
            {homeBanners[0]?.subtitle}
          </AppText>
        </Card>
      </AppView>

      {/* 快捷入口 */}
      <AppView className="px-4 mt-6">
        <AppText size="base" weight="semibold" className="mb-4">
          快捷入口
        </AppText>
        <AppView row wrap className="gap-3">
          {quickActions.map(action => (
            <AppPressable key={action.key} className="w-[calc(50%-6px)]">
              <Card className="p-4 flex-row items-center gap-3">
                <AppView className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
                  <Icon name={action.icon} size={20} color="primary-500" />
                </AppView>
                <AppText size="sm" weight="medium">
                  {action.title}
                </AppText>
              </Card>
            </AppPressable>
          ))}
        </AppView>
      </AppView>

      {/* 底部占位 */}
      <AppView className="h-8" />
    </ScrollView>
  );
}
