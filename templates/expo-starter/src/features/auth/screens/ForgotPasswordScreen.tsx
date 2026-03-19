import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppView, AppText, AppInput, AppButton, Center, Card, AppHeader } from '@gaozh1024/rn-kit';
import type { AuthStackParamList } from '../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

/**
 * 找回密码页
 */
export function ForgotPasswordScreen() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendCode = async () => {
    if (!mobile) {
      return;
    }

    setLoading(true);

    // 模拟发送验证码
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <AppView flex className="bg-gray-100">
      <AppHeader title="找回密码" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <Center flex className="p-6">
        <Card className="w-full max-w-sm p-6">
          {sent ? (
            <AppView className="items-center py-8">
              <AppText size="lg" weight="medium" className="text-center mb-2">
                重置链接已发送
              </AppText>
              <AppText size="sm" color="gray-500" className="text-center">
                请检查您的手机短信，按指引重置密码
              </AppText>
              <AppButton variant="ghost" onPress={() => navigation.goBack()} className="mt-6">
                返回登录
              </AppButton>
            </AppView>
          ) : (
            <AppView className="gap-4">
              <AppText size="sm" color="gray-500" className="mb-2">
                请输入您的手机号，我们将发送密码重置链接
              </AppText>

              <AppInput
                label="手机号"
                placeholder="请输入手机号"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />

              <AppButton
                color="primary"
                loading={loading}
                onPress={handleSendCode}
                className="mt-2"
              >
                发送重置链接
              </AppButton>
            </AppView>
          )}
        </Card>
      </Center>
    </AppView>
  );
}
