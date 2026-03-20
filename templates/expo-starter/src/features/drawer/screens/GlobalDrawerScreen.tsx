import React from 'react';
import { AppText, AppView, Card, SafeScreen } from '@gaozh1024/rn-kit';

export function GlobalDrawerScreen() {
  return (
    <SafeScreen flex>
      <AppView flex className="px-4 pt-4" surface="background">
        <Card className="p-5">
          <AppText size="lg" weight="semibold">
            全局抽屉页
          </AppText>
          <AppText size="sm" tone="muted" className="mt-2">
            这里可以放全局入口，例如快捷操作、账号切换、应用级设置。
          </AppText>
        </Card>
      </AppView>
    </SafeScreen>
  );
}
