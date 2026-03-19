import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, Card, AppHeader } from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { LogoIcon } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';

/**
 * 用户信息页
 */
export function UserInfoScreen() {
  const navigation = useNavigation();
  const { user } = useSessionStore();

  const infoItems = [
    { label: '姓名', value: user?.name },
    { label: '手机号', value: user?.mobile },
    { label: '邮箱', value: user?.email },
    { label: '部门', value: user?.department },
    { label: '角色', value: user?.role },
  ];

  return (
    <AppView flex className="bg-gray-50">
      <AppHeader title="用户信息" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView>
        {/* 头像区域 - 使用 Logo */}
        <Card className="m-4 p-6 items-center">
          <LogoIcon size={80} />
          <AppText size="lg" weight="medium" className="mt-3">
            {user?.name}
          </AppText>
        </Card>

        {/* 信息列表 */}
        <Card className="mx-4 overflow-hidden">
          {infoItems.map((item, index) => (
            <AppView
              key={item.label}
              row
              items="center"
              justify="between"
              className="p-4"
              style={{
                borderBottomWidth: index < infoItems.length - 1 ? 0.5 : 0,
                borderBottomColor: '#e5e7eb',
              }}
            >
              <AppText color="gray-500">{item.label}</AppText>
              <AppText>{item.value || '-'}</AppText>
            </AppView>
          ))}
        </Card>
      </ScrollView>
    </AppView>
  );
}
