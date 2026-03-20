import React from 'react';
import { AppText, Center } from '@gaozh1024/rn-kit';
import { ListItem, ListSection, Logo, PageScreen } from '../../../components/common';
import { appInfo } from '../../../data/mocks/app.mock';

/**
 * 关于我们页
 */
export function AboutScreen() {
  return (
    <PageScreen title="关于我们">
      {/* Logo 区域 */}
      <Center className="py-12">
        <Logo size="lg" />
      </Center>

      {/* 信息列表 */}
      <ListSection className="mt-0">
        {[
          { label: '版本号', value: appInfo.version },
          { label: '构建号', value: appInfo.buildNumber },
          { label: '环境', value: appInfo.environment },
        ].map((item, index, arr) => (
          <ListItem
            key={item.label}
            showDivider={index < arr.length - 1}
            right={<AppText>{item.value}</AppText>}
          >
            <AppText tone="muted">{item.label}</AppText>
          </ListItem>
        ))}
      </ListSection>

      {/* 版权信息 */}
      <Center className="mt-8 px-8">
        <AppText size="xs" tone="muted" className="text-center">
          © 2024 Panther Team. All rights reserved.
        </AppText>
        <AppText size="xs" tone="muted" className="text-center mt-2">
          基于 @gaozh1024/rn-kit 构建
        </AppText>
      </Center>
    </PageScreen>
  );
}
