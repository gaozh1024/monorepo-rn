import React, { useEffect } from 'react';
import { setupStorage } from '../bootstrap/storage';
import { Providers } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';

/**
 * 根应用组件
 * 负责应用启动流程，决定先进入哪个导航分支
 */
export function RootApp() {
  useEffect(() => {
    setupStorage();
  }, []);

  return (
    <Providers>
      <RootNavigator />
    </Providers>
  );
}
