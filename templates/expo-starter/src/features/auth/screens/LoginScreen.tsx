import React, { useState } from 'react';
import {
  AppStatusBar,
  AppView,
  AppText,
  AppInput,
  AppButton,
  AppPressable,
  Center,
  Card,
  GradientView,
  useNavigation,
  SafeScreen,
} from '@gaozh1024/rn-kit';
import { LogoIcon } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import { loginResponse } from '../../../data/mocks/user.mock';
import type { AuthNavigationProp } from '../../../navigation/types';

/**
 * 登录页
 */
export function LoginScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { login } = useSessionStore();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      return;
    }

    setLoading(true);

    // 模拟登录请求
    setTimeout(() => {
      setLoading(false);
      // 使用 mock 数据登录
      login(loginResponse.token, loginResponse.user);
    }, 1000);
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <>
      <AppStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <GradientView colors={['#f38b32', '#fb923c']} style={{ flex: 1 }}>
        <AppView flex>
          <SafeScreen flex top={false} className="justify-end">
            <Center className="px-6 pb-10">
              <LogoIcon size={72} />
              <AppText size="2xl" weight="bold" className="mt-4 text-white">
                欢迎回来
              </AppText>
              <AppText size="sm" className="mt-2 text-white/80 text-center">
                使用 rn-kit 构建可维护、可扩展的 Expo 应用
              </AppText>
            </Center>

            <Card className="rounded-t-3xl px-6 pt-8 pb-10">
              <AppView className="gap-4">
                <AppInput
                  label="手机号"
                  placeholder="请输入手机号"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />

                <AppInput
                  label="密码"
                  placeholder="请输入密码"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <AppPressable onPress={goToForgotPassword} className="self-end">
                  <AppText size="sm" color="primary-500">
                    忘记密码?
                  </AppText>
                </AppPressable>

                <AppButton color="primary" loading={loading} onPress={handleLogin} className="mt-2">
                  登录
                </AppButton>

                <AppView row center className="mt-4 gap-1">
                  <AppText size="sm" tone="muted">
                    还没有账号?
                  </AppText>
                  <AppPressable onPress={goToRegister}>
                    <AppText size="sm" color="primary-500" weight="medium">
                      立即注册
                    </AppText>
                  </AppPressable>
                </AppView>
              </AppView>
            </Card>
          </SafeScreen>
        </AppView>
      </GradientView>
    </>
  );
}
