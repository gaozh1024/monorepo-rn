import React, { useState } from 'react';
import {
  AppView,
  AppText,
  AppInput,
  AppPressable,
  Center,
  AppFocusedStatusBar,
  useNavigation,
  useTheme,
  Icon,
  Row,
  SafeScreen,
  useLogger,
  AppButton,
} from '@gaozh1024/rn-kit';
import { useSessionStore } from '../../../store/session.store';
import { loginResponse } from '../../../data/mocks/user.mock';
import type { RootNavigationProp } from '../../../navigation/types';
import { appColors } from '../../../bootstrap/theme';

/**
 * 登录页 - 现代简约设计
 * 使用 rn-kit AppButton 替代手搓按钮，保持统一交互与主题
 */
export function LoginScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const logger = useLogger('auth');
  const { login } = useSessionStore();
  const { isDark } = useTheme();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      logger.warn('登录失败：手机号或密码为空');
      return;
    }

    logger.info('提交登录表单');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      logger.info('登录成功，准备进入首页');
      login(loginResponse.token, loginResponse.user);
    }, 1000);
  };

  const goToRegister = () => navigation.navigate('Register');
  const goToForgotPassword = () => navigation.navigate('ForgotPassword');

  return (
    <>
      <AppFocusedStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <SafeScreen flex dismissKeyboardOnPressOutside surface="background">
        {/* 背景装饰 */}
        <AppView
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: isDark ? `${appColors.primary[500]}08` : `${appColors.primary[500]}12`,
          }}
        />
        <AppView
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: 125,
            backgroundColor: isDark ? `${appColors.primary[400]}05` : `${appColors.primary[400]}08`,
          }}
        />

        {/* 内容区域 */}
        <Center flex className="px-6">
          {/* Logo 区域 */}
          <Center style={{ marginBottom: 32 }}>
            <AppView
              style={{
                width: 88,
                height: 88,
                borderRadius: 28,
                backgroundColor: appColors.primary[500],
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: appColors.primary[500],
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.25,
                shadowRadius: 24,
                elevation: 12,
                marginBottom: 24,
              }}
            >
              <AppView
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                }}
              />
            </AppView>
            <AppText
              size="3xl"
              weight="bold"
              style={{
                color: isDark ? appColors.slate[50] : appColors.slate[900],
                marginBottom: 8,
              }}
            >
              欢迎回来
            </AppText>
            <AppText
              size="sm"
              style={{
                color: isDark ? appColors.slate[400] : appColors.slate[500],
              }}
            >
              登录您的账号以继续
            </AppText>
          </Center>

          {/* 登录表单卡片 */}
          <AppView
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: isDark ? appColors.slate[900] : '#ffffff',
              borderRadius: 28,
              padding: 32,
              shadowColor: isDark ? '#000000' : appColors.slate[900],
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 40,
              elevation: 20,
            }}
          >
            <AppView style={{ gap: 20 }}>
              {/* 手机号输入 */}
              <AppView>
                <AppText
                  size="sm"
                  weight="medium"
                  style={{
                    marginBottom: 10,
                    marginLeft: 4,
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

              {/* 密码输入 */}
              <AppView>
                <AppText
                  size="sm"
                  weight="medium"
                  style={{
                    marginBottom: 10,
                    marginLeft: 4,
                    color: isDark ? appColors.slate[300] : appColors.slate[600],
                  }}
                >
                  密码
                </AppText>
                <AppInput
                  placeholder="请输入密码"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon={
                    <Icon
                      name="lock"
                      size={20}
                      color={isDark ? appColors.slate[400] : appColors.slate[400]}
                    />
                  }
                />
              </AppView>

              {/* 忘记密码 */}
              <AppPressable onPress={goToForgotPassword} style={{ alignSelf: 'flex-end' }}>
                <AppText size="sm" weight="medium" style={{ color: appColors.primary[500] }}>
                  忘记密码?
                </AppText>
              </AppPressable>

              {/* 登录按钮 - 使用 AppButton */}
              <AppButton size="lg" loading={loading} onPress={handleLogin}>
                {loading ? '登录中...' : '登录'}
              </AppButton>

              {/* 注册链接 */}
              <Row center style={{ marginTop: 8, gap: 6 }}>
                <AppText
                  size="sm"
                  style={{
                    color: isDark ? appColors.slate[500] : appColors.slate[500],
                  }}
                >
                  还没有账号?
                </AppText>
                <AppPressable onPress={goToRegister}>
                  <AppText size="sm" weight="semibold" style={{ color: appColors.primary[500] }}>
                    立即注册
                  </AppText>
                </AppPressable>
              </Row>
            </AppView>
          </AppView>

          {/* 底部文字 */}
          <AppText
            size="xs"
            style={{
              marginTop: 32,
              color: isDark ? appColors.slate[600] : appColors.slate[400],
            }}
          >
            基于 @gaozh1024/rn-kit 构建
          </AppText>
        </Center>
      </SafeScreen>
    </>
  );
}
