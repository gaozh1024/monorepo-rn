import React from 'react';
import { AppView, AppText, Card, Center, useThemeColors } from '@gaozh1024/rn-kit';
import { Logo, PageScreen } from '../../../components/common';
import { appInfo } from '../../../data/mocks/app.mock';

/**
 * 关于我们页
 */
export function AboutScreen() {
  const colors = useThemeColors();

  return (
    <PageScreen title="关于我们">
      {/* Logo 区域 */}
      <Center className="py-12">
        <Logo size="lg" textColor={colors.text} />
      </Center>

      {/* 信息列表 */}
      <Card className="mx-4 overflow-hidden">
        {[
          { label: '版本号', value: appInfo.version },
          { label: '构建号', value: appInfo.buildNumber },
          { label: '环境', value: appInfo.environment },
        ].map((item, index, arr) => (
          <AppView
            key={item.label}
            row
            items="center"
            justify="between"
            className="p-4"
            style={{
              borderBottomWidth: index < arr.length - 1 ? 0.5 : 0,
              borderBottomColor: colors.divider,
            }}
          >
            <AppText tone="muted">{item.label}</AppText>
            <AppText>{item.value}</AppText>
          </AppView>
        ))}
      </Card>

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
