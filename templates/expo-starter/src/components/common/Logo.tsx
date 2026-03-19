import React from 'react';
import { View } from 'react-native';
import { AppView, AppText } from '@gaozh1024/rn-kit';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

const sizeMap = {
  sm: { container: 40, inner: 24, font: 14 },
  md: { container: 60, inner: 36, font: 20 },
  lg: { container: 80, inner: 48, font: 28 },
  xl: { container: 120, inner: 72, font: 40 },
};

/**
 * Panther Logo 组件
 * 使用纯代码绘制的Logo，无需外部图片资源
 */
export function Logo({ size = 'md', showText = true, textColor = '#ffffff' }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <AppView center>
      {/* Logo 图形 */}
      <AppView
        center
        style={{
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container / 4,
          backgroundColor: '#f38b32',
        }}
      >
        {/* 内部装饰 */}
        <AppView
          style={{
            width: dimensions.inner,
            height: dimensions.inner,
            borderRadius: dimensions.inner / 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* P 字母 */}
          <AppText
            style={{
              fontSize: dimensions.inner * 0.6,
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            P
          </AppText>
        </AppView>
      </AppView>

      {/* Logo 文字 */}
      {showText && (
        <AppView className="mt-3 items-center">
          <AppText
            weight="bold"
            style={{
              fontSize: dimensions.font,
              color: textColor,
            }}
          >
            Panther
          </AppText>
          <AppText
            size="xs"
            style={{
              color: textColor,
              opacity: 0.8,
              marginTop: 2,
            }}
          >
            Starter
          </AppText>
        </AppView>
      )}
    </AppView>
  );
}

/**
 * Logo 图标 (仅图形)
 */
export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        backgroundColor: '#f38b32',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AppText
        style={{
          fontSize: size * 0.4,
          fontWeight: 'bold',
          color: '#ffffff',
        }}
      >
        P
      </AppText>
    </View>
  );
}
