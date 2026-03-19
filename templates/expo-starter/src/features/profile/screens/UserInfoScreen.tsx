import React from 'react';
import { AppView, AppText, Card, useThemeColors } from '@gaozh1024/rn-kit';
import { LogoIcon, PageScreen } from '../../../components/common';
import { useSessionStore } from '../../../store/session.store';

/**
 * 用户信息页
 */
export function UserInfoScreen() {
  const { user } = useSessionStore();
  const colors = useThemeColors();

  const infoItems = [
    { label: '姓名', value: user?.name },
    { label: '手机号', value: user?.mobile },
    { label: '邮箱', value: user?.email },
    { label: '部门', value: user?.department },
    { label: '角色', value: user?.role },
  ];

  return (
    <PageScreen title="用户信息">
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
              borderBottomColor: colors.divider,
            }}
          >
            <AppText tone="muted">{item.label}</AppText>
            <AppText>{item.value || '-'}</AppText>
          </AppView>
        ))}
      </Card>
    </PageScreen>
  );
}
