import React, { useState } from 'react';
import {
  AppView,
  AppText,
  AppInput,
  AppPressable,
  Center,
  useNavigation,
  useTheme,
  Icon,
  Row,
  AppScrollView,
} from '@gaozh1024/rn-kit';
import type { RootNavigationProp } from '../../../navigation/types';
import { appColors } from '../../../bootstrap/theme';

/**
 * 找回密码页 - 使用 AppHeader
 */
export function ForgotPasswordScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { isDark } = useTheme();
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
    <AppView
      flex
      style={{
        backgroundColor: isDark ? appColors.slate[950] : '#f1f5f9',
      }}
    >
      <AppScrollView
        flex
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题区域 */}
        <Center style={{ marginVertical: 32 }}>
          <AppView
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: appColors.primary[500],
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: appColors.primary[500],
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <AppView
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
            />
          </AppView>
          <AppText
            size="2xl"
            weight="bold"
            style={{
              color: isDark ? appColors.slate[50] : appColors.slate[900],
            }}
          >
            找回密码
          </AppText>
          <AppText
            size="sm"
            style={{
              marginTop: 8,
              color: isDark ? appColors.slate[400] : appColors.slate[500],
            }}
          >
            {sent ? '验证码已发送，请查收' : '请输入手机号重置密码'}
          </AppText>
        </Center>

        {/* 表单区域 */}
        <AppView style={{ paddingBottom: 32 }}>
          {sent ? (
            // 发送成功状态
            <Center>
              <AppView
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: `${appColors.success.DEFAULT}15`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24,
                }}
              >
                <Icon name="check" size={40} color={appColors.success.DEFAULT} />
              </AppView>
              <AppText
                size="lg"
                weight="medium"
                style={{
                  marginBottom: 8,
                  color: isDark ? appColors.slate[50] : appColors.slate[900],
                }}
              >
                重置链接已发送
              </AppText>
              <AppText
                size="sm"
                style={{
                  color: isDark ? appColors.slate[400] : appColors.slate[500],
                  textAlign: 'center',
                }}
              >
                请检查您的手机短信，按指引重置密码
              </AppText>
              <AppPressable
                onPress={() => navigation.goBack()}
                style={{
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: appColors.primary[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 32,
                  minWidth: 200,
                  shadowColor: appColors.primary[500],
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <AppText size="md" weight="semibold" style={{ color: '#ffffff' }}>
                  返回登录
                </AppText>
              </AppPressable>
            </Center>
          ) : (
            // 输入手机号
            <AppView style={{ gap: 16 }}>
              <AppText
                size="sm"
                style={{
                  color: isDark ? appColors.slate[400] : appColors.slate[500],
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                请输入您的手机号，我们将发送密码重置链接
              </AppText>

              <AppView>
                <AppText
                  size="sm"
                  weight="medium"
                  style={{
                    marginBottom: 8,
                    color: isDark ? appColors.slate[300] : appColors.slate[600],
                  }}
                >
                  手机号
                </AppText>
                <AppInput
                  placeholder="请输入手机号"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  leftIcon={
                    <Icon
                      name="phone"
                      size={20}
                      color={isDark ? appColors.slate[400] : appColors.slate[400]}
                    />
                  }
                />
              </AppView>

              <AppPressable
                onPress={handleSendCode}
                disabled={loading}
                style={{
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: appColors.primary[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 8,
                  shadowColor: appColors.primary[500],
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 16,
                  elevation: 8,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <AppText size="md" weight="semibold" style={{ color: '#ffffff' }}>
                  {loading ? '发送中...' : '发送重置链接'}
                </AppText>
              </AppPressable>
            </AppView>
          )}
        </AppView>
      </AppScrollView>
    </AppView>
  );
}
