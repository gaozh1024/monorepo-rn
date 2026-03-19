import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Center } from '@gaozh1024/rn-kit';
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
    <Center flex className="bg-primary-500">
      <Logo size="xl" />
      <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 24 }} />
    </Center>
  );
}
