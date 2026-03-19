import React, { useState } from 'react';
import {
  AppView,
  AppText,
  AppInput,
  AppButton,
  AppPressable,
  useNavigation,
} from '@gaozh1024/rn-kit';
import { AuthCardScreen } from '../../../components/common';
import type { AuthNavigationProp } from '../../../navigation/types';

/**
 * 注册页
 */
export function RegisterScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!mobile || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setLoading(true);

    // 模拟注册请求
    setTimeout(() => {
      setLoading(false);
      // 注册成功后返回登录页
      navigation.goBack();
    }, 1000);
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <AuthCardScreen title="注册账号">
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

        <AppInput
          label="确认密码"
          placeholder="请再次输入密码"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <AppButton color="primary" loading={loading} onPress={handleRegister} className="mt-2">
          注册
        </AppButton>

        <AppView row center className="mt-4 gap-1">
          <AppText size="sm" tone="muted">
            已有账号?
          </AppText>
          <AppPressable onPress={goToLogin}>
            <AppText size="sm" color="primary-500" weight="medium">
              返回登录
            </AppText>
          </AppPressable>
        </AppView>
      </AppView>
    </AuthCardScreen>
  );
}
