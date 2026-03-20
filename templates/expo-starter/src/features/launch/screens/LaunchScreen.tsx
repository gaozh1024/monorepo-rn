import React, { useEffect } from 'react';
import { AppStatusBar, Center, GradientView, Loading, SafeScreen } from '@gaozh1024/rn-kit';
import { Logo } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';

/**
 * 启动页
 * 职责：
 * - 读取本地 session
 * - 模拟启动延迟
 * - 决定跳转 Login 或 MainTabs
 */
export function LaunchScreen() {
  const { restoreSession } = useSessionStore();

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppStatusBar barStyle="light-content" backgroundColor="#f38b32" />
      <SafeScreen flex>
        <GradientView colors={['#f38b32', '#fb923c']} style={{ flex: 1 }}>
          <Center flex>
            <Logo size="xl" textColor="white" />
            <Loading text="正在启动..." color="#ffffff" />
          </Center>
        </GradientView>
      </SafeScreen>
    </>
  );
}
