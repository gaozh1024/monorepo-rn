import React from 'react';
import { AppText, Card } from '@gaozh1024/rn-kit';
import { ListItem, ListSection, LogoIcon, PageScreen } from '../../../components/common';
import { useSessionStore } from '../../../store/session.store';

/**
 * 用户信息页
 */
export function UserInfoScreen() {
  const { user } = useSessionStore();

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
      <ListSection className="mt-0">
        {infoItems.map((item, index) => (
          <ListItem
            key={item.label}
            showDivider={index < infoItems.length - 1}
            right={<AppText>{item.value || '-'}</AppText>}
          >
            <AppText tone="muted">{item.label}</AppText>
          </ListItem>
        ))}
      </ListSection>
    </PageScreen>
  );
}
