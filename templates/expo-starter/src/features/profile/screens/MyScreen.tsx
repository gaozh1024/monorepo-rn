import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, AppPressable, Icon, Card } from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { LogoIcon } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import type { MyStackParamList } from '../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

type MyNavigationProp = StackNavigationProp<MyStackParamList>;

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
    <ScrollView className="flex-1 bg-gray-50">
      {/* 用户信息卡片 */}
      <Card className="m-4 p-6">
        <AppView row items="center">
          {/* Logo 作为头像 */}
          <LogoIcon size={64} />
          <AppView className="ml-4 flex-1">
            <AppText size="lg" weight="bold">
              {user?.name || '未登录'}
            </AppText>
            <AppText size="sm" color="gray-500" className="mt-1">
              {user?.role || '普通用户'}
            </AppText>
          </AppView>
          <Icon name="chevron-right" size={24} color="gray-400" />
        </AppView>
      </Card>

      {/* 菜单列表 */}
      <Card className="mx-4 overflow-hidden">
        {menuItems.map((item, index) => (
          <AppPressable key={item.key} onPress={item.onPress}>
            <AppView
              row
              items="center"
              className="p-4"
              style={{
                borderBottomWidth: index < menuItems.length - 1 ? 0.5 : 0,
                borderBottomColor: '#e5e7eb',
              }}
            >
              <Icon name={item.icon} size={22} color="gray-600" />
              <AppText className="ml-3 flex-1">{item.label}</AppText>
              <Icon name="chevron-right" size={20} color="gray-400" />
            </AppView>
          </AppPressable>
        ))}
      </Card>
    </ScrollView>
  );
}
