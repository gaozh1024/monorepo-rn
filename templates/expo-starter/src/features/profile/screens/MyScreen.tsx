import React from 'react';
import { AppScrollView, AppView, AppText, Icon, Card, useNavigation } from '@gaozh1024/rn-kit';
import { ListItem, LogoIcon } from '../../../components/common';
import { useSessionStore } from '../../../store/session.store';
import type { MyNavigationProp } from '../../../navigation/types';

/**
 * 我的页面
 */
export function MyScreen() {
  const navigation = useNavigation<MyNavigationProp>();
  const { user } = useSessionStore();

  const menuItems = [
    {
      key: 'userInfo',
      label: '用户信息',
      icon: 'person-outline',
      onPress: () => navigation.navigate('UserInfo'),
    },
    {
      key: 'settings',
      label: '设置',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'about',
      label: '关于我们',
      icon: 'info-outline',
      onPress: () => navigation.navigate('About'),
    },
  ];

  return (
    <AppScrollView flex surface="background">
      {/* 用户信息卡片 */}
      <Card className="m-4 p-6">
        <AppView row items="center">
          {/* Logo 作为头像 */}
          <LogoIcon size={64} />
          <AppView className="ml-4 flex-1">
            <AppText size="lg" weight="bold">
              {user?.name || '未登录'}
            </AppText>
            <AppText size="sm" tone="muted" className="mt-1">
              {user?.role || '普通用户'}
            </AppText>
          </AppView>
          <Icon name="chevron-right" size={24} color="muted" />
        </AppView>
      </Card>

      {/* 菜单列表 */}
      <Card className="mx-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <ListItem
            key={item.key}
            onPress={item.onPress}
            showDivider={index < menuItems.length - 1}
            left={<Icon name={item.icon} size={22} color="muted" />}
            right={<Icon name="chevron-right" size={20} color="muted" />}
          >
            <AppText>{item.label}</AppText>
          </ListItem>
        ))}
      </Card>
    </AppScrollView>
  );
}
