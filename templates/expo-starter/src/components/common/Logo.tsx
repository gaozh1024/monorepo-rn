import React from 'react';
import { AppView, AppText } from '@gaozh1024/rn-kit';
import { appColors } from '../../bootstrap/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

const sizeMap = {
  sm: { container: 44, font: 16, icon: 20 },
  md: { container: 64, font: 22, icon: 28 },
  lg: { container: 88, font: 28, icon: 40 },
  xl: { container: 120, font: 36, icon: 56 },
};

/**
 * 现代简约 Logo 组件
 * 使用渐变色彩的几何图形设计
 */
export function Logo({ size = 'md', showText = true, textColor }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <AppView center>
      {/* Logo 图形 - 现代几何设计 */}
      <AppView
        style={{
          width: dimensions.container,
          height: dimensions.container,
          borderRadius: dimensions.container * 0.25,
          backgroundColor: appColors.primary[500],
          justifyContent: 'center',
          alignItems: 'center',
          // 微妙的阴影
          shadowColor: appColors.primary[600],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* 内部装饰 */}
        <AppView
          style={{
            width: dimensions.container * 0.5,
            height: dimensions.container * 0.5,
            borderRadius: dimensions.container * 0.125,
            backgroundColor: 'rgba(255,255,255,0.25)',
          }}
        />
      </AppView>

      {/* Logo 文字 */}
      {showText && (
        <AppView style={{ marginTop: 12, alignItems: 'center' }}>
          <AppText
            weight="bold"
            style={{
              fontSize: dimensions.font,
              color: textColor || appColors.slate[900],
              letterSpacing: -0.5,
            }}
          >
            Panther
          </AppText>
          <AppText
            size="xs"
            style={{
              color: textColor ? `${textColor}99` : appColors.slate[500],
              marginTop: 2,
              letterSpacing: 0.5,
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
    <AppView
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        backgroundColor: appColors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: appColors.primary[600],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <AppView
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.125,
          backgroundColor: 'rgba(255,255,255,0.25)',
        }}
      />
    </AppView>
  );
}
