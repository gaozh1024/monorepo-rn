import React, { useState, useCallback } from 'react';
import {
  Image,
  ActivityIndicator,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
  View,
} from 'react-native';
import { useTheme } from '@gaozh/rn-theme';
import { cn } from '@gaozh/rn-utils';
import { AppPressable, AppView } from '../primitives';
import { Icon } from './Icon';

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

export interface AppImageProps {
  source: ImageSourcePropType | { uri: string };
  width?: number | string;
  height?: number | string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
  placeholder?: ImageSourcePropType;
  errorPlaceholder?: ImageSourcePropType;
  loadingIndicator?: boolean | React.ReactNode;
  showError?: boolean;
  resizeMode?: ImageResizeMode;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  style?: StyleProp<ImageStyle>;
}

const radiusMap: Record<string, number> = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

function resolveRadius(radius: AppImageProps['borderRadius']): number {
  if (typeof radius === 'number') return radius;
  return radiusMap[radius || 'none'];
}

function SkeletonItem() {
  return <AppView flex className="bg-gray-200 animate-pulse" />;
}

export function AppImage({
  source,
  width = '100%',
  height = 'auto',
  borderRadius = 'none',
  placeholder,
  errorPlaceholder,
  loadingIndicator = false,
  showError = false,
  resizeMode = 'cover',
  onLoad,
  onError,
  onPress,
  onLongPress,
  className,
  style,
}: AppImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  const resolvedRadius = resolveRadius(borderRadius);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(
    (error: any) => {
      setIsLoading(false);
      setHasError(true);
      onError?.(error);
    },
    [onError]
  );

  const imageStyle: any = [
    {
      width: '100%',
      height: '100%',
      borderRadius: resolvedRadius,
    },
    style,
  ];

  const renderLoading = () => {
    if (!isLoading) return null;
    if (placeholder) {
      return (
        <Image
          source={placeholder}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: resolvedRadius,
          }}
          resizeMode={resizeMode}
        />
      );
    }
    if (loadingIndicator) {
      if (typeof loadingIndicator === 'boolean') {
        return (
          <AppView
            center
            className="absolute inset-0 bg-gray-100"
            style={{ borderRadius: resolvedRadius }}
          >
            <ActivityIndicator color={theme.colors.primary?.[500]} />
          </AppView>
        );
      }
      return (
        <AppView center className="absolute inset-0" style={{ borderRadius: resolvedRadius }}>
          {loadingIndicator}
        </AppView>
      );
    }
    return <SkeletonItem />;
  };

  const renderError = () => {
    if (!hasError) return null;
    if (errorPlaceholder) {
      return (
        <Image
          source={errorPlaceholder}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: resolvedRadius,
          }}
          resizeMode={resizeMode}
        />
      );
    }
    if (showError) {
      return (
        <AppView
          center
          className="absolute inset-0 bg-gray-100"
          style={{ borderRadius: resolvedRadius }}
        >
          <Icon name="error" size="lg" color="error-500" />
        </AppView>
      );
    }
    return null;
  };

  const isNumberWidth = typeof width === 'number';
  const isNumberHeight = typeof height === 'number';

  const content = (
    <View
      className={cn('overflow-hidden', className)}
      style={{
        width: isNumberWidth ? width : '100%',
        height: isNumberHeight ? height : undefined,
        aspectRatio:
          typeof height === 'string' && height.startsWith('aspect-')
            ? Number(height.replace('aspect-', '').split('/')[0]) /
              Number(height.replace('aspect-', '').split('/')[1] || 1)
            : undefined,
        borderRadius: resolvedRadius,
      }}
    >
      {renderLoading()}
      <Image
        source={source as any}
        style={imageStyle}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />
      {renderError()}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <AppPressable onPress={onPress} onLongPress={onLongPress}>
        {content}
      </AppPressable>
    );
  }

  return content;
}
