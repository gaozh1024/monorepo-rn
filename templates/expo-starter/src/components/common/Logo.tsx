import React from 'react';
import { Image } from 'react-native';
import { AppView, AppText } from '@gaozh1024/rn-kit';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

const sizeMap = {
  sm: { container: 40, font: 14 },
  md: { container: 60, font: 20 },
  lg: { container: 80, font: 28 },
  xl: { container: 120, font: 40 },
};

const logoSource = require('../../../assets/logo.png');

/**
 * Panther Logo 组件
 * 使用模板内置 logo 资源
 */
export function Logo({ size = 'md', showText = true, textColor }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <AppView center>
      <Image
        source={logoSource}
        style={{
          width: dimensions.container,
          height: dimensions.container,
        }}
        resizeMode="contain"
      />

      {/* Logo 文字 */}
      {showText && (
        <AppView className="mt-3 items-center">
          <AppText
            weight="bold"
            style={{
              fontSize: dimensions.font,
              ...(textColor ? { color: textColor } : {}),
            }}
          >
            Panther
          </AppText>
          <AppText
            size="xs"
            style={{
              ...(textColor ? { color: textColor } : {}),
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
    <Image
      source={logoSource}
      style={{
        width: size,
        height: size,
      }}
      resizeMode="contain"
    />
  );
}
