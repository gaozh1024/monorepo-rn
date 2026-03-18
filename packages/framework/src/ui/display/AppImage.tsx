import React, { useState, useCallback } from 'react';
import {
  Image,
  ActivityIndicator,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
  View,
} from 'react-native';
import { useTheme } from '@/theme';
import { cn } from '@/utils';
import { AppPressable, AppView } from '@/ui/primitives';
import { Icon } from './Icon';

/** 图片缩放模式 */
export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

/**
 * AppImage 组件属性接口
 */
export interface AppImageProps {
  /** 图片资源，可以是本地资源或远程 URL */
  source: ImageSourcePropType | { uri: string };
  /** 宽度，数字表示像素，字符串表示百分比 */
  width?: number | string;
  /** 高度，数字表示像素，'auto' 表示自适应，或使用 'aspect-16/9' 等比例格式 */
  height?: number | string;
  /** 圆角大小，支持预设值或数字 */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
  /** 加载时的占位图 */
  placeholder?: ImageSourcePropType;
  /** 加载失败时的占位图 */
  errorPlaceholder?: ImageSourcePropType;
  /** 是否显示加载指示器，设为 true 显示默认指示器，或传入自定义节点 */
  loadingIndicator?: boolean | React.ReactNode;
  /** 是否在加载失败时显示错误图标 */
  showError?: boolean;
  /** 图片缩放模式 */
  resizeMode?: ImageResizeMode;
  /** 图片加载成功回调 */
  onLoad?: () => void;
  /** 图片加载失败回调 */
  onError?: (error: any) => void;
  /** 点击回调 */
  onPress?: () => void;
  /** 长按回调 */
  onLongPress?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: StyleProp<ImageStyle>;
}

/**
 * 圆角映射表
 */
const radiusMap: Record<string, number> = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

/**
 * 解析圆角值
 * @param radius - 圆角值
 * @returns 解析后的数字
 */
function resolveRadius(radius: AppImageProps['borderRadius']): number {
  if (typeof radius === 'number') return radius;
  return radiusMap[radius || 'none'];
}

/**
 * 骨架屏加载效果
 */
function SkeletonItem() {
  return <AppView flex className="bg-gray-200 animate-pulse" />;
}

/**
 * AppImage - 图片组件
 *
 * 功能丰富的图片组件，支持加载状态、错误处理、圆角、点击交互等
 * 自动处理图片加载过程中的各种状态，提供良好的用户体验
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppImage source={{ uri: 'https://example.com/image.jpg' }} />
 *
 * // 指定尺寸和圆角
 * <AppImage
 *   source={require('./photo.png')}
 *   width={200}
 *   height={150}
 *   borderRadius="lg"
 * />
 *
 * // 显示加载指示器
 * <AppImage
 *   source={{ uri: 'https://example.com/large-image.jpg' }}
 *   loadingIndicator={true}
 *   showError={true}
 * />
 *
 * // 可点击图片
 * <AppImage
 *   source={{ uri: 'https://example.com/photo.jpg' }}
 *   onPress={() => navigation.navigate('Detail')}
 *   onLongPress={() => showContextMenu()}
 * />
 *
 * // 使用占位图
 * <AppImage
 *   source={{ uri: user.avatar }}
 *   placeholder={require('./default-avatar.png')}
 *   errorPlaceholder={require('./error-avatar.png')}
 *   borderRadius="full"
 * />
 * ```
 */
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
