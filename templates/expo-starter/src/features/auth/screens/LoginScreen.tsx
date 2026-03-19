import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  AppView,
  AppText,
  AppInput,
  AppButton,
  AppPressable,
  Center,
  Card,
} from '@gaozh1024/rn-kit';
import { LogoIcon } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import { loginResponse } from '../../../data/mocks/user.mock';
import { ROUTES } from '../../../navigation/routes';
import type { AuthStackParamList } from '../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

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
    <Center flex className="bg-gray-100 p-6">
      <Card className="w-full max-w-sm p-6">
        {/* Logo */}
        <AppView center className="mb-6">
          <LogoIcon size={60} />
          <AppText size="lg" weight="bold" className="mt-3">
            欢迎登录
          </AppText>
        </AppView>

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
            <AppText size="sm" color="gray-500">
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
    </Center>
  );
}
