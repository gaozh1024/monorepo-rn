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
 * 注册页 - 使用 AppHeader
 */
export function RegisterScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { isDark } = useTheme();
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
            创建账号
          </AppText>
          <AppText
            size="sm"
            style={{
              marginTop: 8,
              color: isDark ? appColors.slate[400] : appColors.slate[500],
            }}
          >
            填写以下信息完成注册
          </AppText>
        </Center>

        {/* 注册表单 */}
        <AppView style={{ gap: 16, paddingBottom: 32 }}>
          {/* 手机号输入 */}
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

          {/* 密码输入 */}
          <AppView>
            <AppText
              size="sm"
              weight="medium"
              style={{
                marginBottom: 8,
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

          {/* 确认密码输入 */}
          <AppView>
            <AppText
              size="sm"
              weight="medium"
              style={{
                marginBottom: 8,
                color: isDark ? appColors.slate[300] : appColors.slate[600],
              }}
            >
              确认密码
            </AppText>
            <AppInput
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={
                <Icon
                  name="lock-outline"
                  size={20}
                  color={isDark ? appColors.slate[400] : appColors.slate[400]}
                />
              }
            />
          </AppView>

          {/* 注册按钮 */}
          <AppPressable
            onPress={handleRegister}
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
              {loading ? '注册中...' : '注册'}
            </AppText>
          </AppPressable>

          {/* 登录链接 */}
          <Row center style={{ marginTop: 20, gap: 6 }}>
            <AppText
              size="sm"
              style={{
                color: isDark ? appColors.slate[500] : appColors.slate[500],
              }}
            >
              已有账号?
            </AppText>
            <AppPressable onPress={goToLogin}>
              <AppText size="sm" weight="semibold" style={{ color: appColors.primary[500] }}>
                返回登录
              </AppText>
            </AppPressable>
          </Row>
        </AppView>
      </AppScrollView>
    </AppView>
  );
}
