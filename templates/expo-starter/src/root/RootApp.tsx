import React from 'react';
import { Providers } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';

/**
 * 根应用组件
 * 负责应用启动流程，决定先进入哪个导航分支
 */
export function RootApp() {
  return (
    <Providers>
      <RootNavigator />
    </Providers>
  );
}
