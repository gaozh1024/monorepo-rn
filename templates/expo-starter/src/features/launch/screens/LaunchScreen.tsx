import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppView, Center, useLoading } from '@gaozh1024/rn-kit';
import { Logo } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import { ROUTES } from '../../../navigation/routes';

/**
 * 启动页
 * 职责：
 * - 读取本地 session
 * - 模拟启动延迟
 * - 决定跳转 Login 或 MainTabs
 */
export function LaunchScreen() {
  const navigation = useNavigation();
  const loading = useLoading();
  const { restoreSession, isLoggedIn, isLoading } = useSessionStore();

  useEffect(() => {
    // 显示启动加载
    loading.show('启动中...');

    // 恢复 session
    restoreSession();

    // 模拟启动延迟
    const timer = setTimeout(() => {
      loading.hide();

      // 根据登录状态跳转
      if (isLoggedIn) {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.MAIN as never }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.AUTH as never }],
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, isLoading]);

  return (
    <Center flex className="bg-primary-500">
      <Logo size="xl" />
    </Center>
  );
}
