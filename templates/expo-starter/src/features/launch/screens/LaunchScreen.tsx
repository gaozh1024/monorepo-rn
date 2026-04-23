import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { AppStatusBar, Center, AppView, AppText, useTheme } from '@gaozh1024/rn-kit';
import { Logo } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import { appColors } from '../../../bootstrap/theme';

/**
 * 启动页 - 极简现代设计
 * 流畅优雅的入场动画
 */
export function LaunchScreen() {
  const { restoreSession } = useSessionStore();
  const { isDark } = useTheme();

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 启动恢复会话
    void restoreSession();

    // 执行入场动画序列
    Animated.sequence([
      // Logo 淡入 + 缩放
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      // 文字滑入
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // 进度条动画
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start();
  }, [restoreSession, fadeAnim, scaleAnim, slideAnim, progressAnim]);

  // 进度条宽度插值
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <AppStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <Center
        flex
        style={{
          backgroundColor: isDark ? appColors.slate[950] : appColors.slate[50],
        }}
      >
        {/* 背景装饰 - 柔和的渐变圆 */}
        <AppView
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: 300,
            backgroundColor: isDark ? `${appColors.primary[600]}08` : `${appColors.primary[500]}08`,
            top: -200,
            right: -200,
          }}
        />
        <AppView
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: 200,
            backgroundColor: isDark ? `${appColors.primary[500]}05` : `${appColors.primary[400]}05`,
            bottom: -100,
            left: -100,
          }}
        />

        {/* Logo 动画容器 */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Logo size="xl" />
        </Animated.View>

        {/* 副标题动画 */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            marginTop: 24,
          }}
        >
          <AppText
            size="sm"
            style={{
              color: isDark ? appColors.slate[400] : appColors.slate[500],
              textAlign: 'center',
            }}
          >
            现代化 React Native 应用模板
          </AppText>
        </Animated.View>

        {/* 底部进度区域 */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            position: 'absolute',
            bottom: 80,
            width: 120,
            alignItems: 'center',
          }}
        >
          {/* 进度条 */}
          <AppView
            style={{
              width: '100%',
              height: 2,
              borderRadius: 1,
              backgroundColor: isDark ? appColors.slate[800] : appColors.slate[200],
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                backgroundColor: appColors.primary[500],
                width: progressWidth,
              }}
            />
          </AppView>

          {/* 版本号 */}
          <AppText
            size="xs"
            style={{
              color: isDark ? appColors.slate[600] : appColors.slate[400],
              marginTop: 16,
            }}
          >
            v0.2.15
          </AppText>
        </Animated.View>
      </Center>
    </>
  );
}
