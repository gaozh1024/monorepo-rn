import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, type ImageStyle, type StyleProp, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { AppPressable, AppView } from '@/ui/primitives';
import { SkeletonBlock } from '@/ui/feedback';
import { Icon } from './Icon';

type ExpoImageComponentProps = React.ComponentProps<typeof ExpoImage>;

/** 图片缩放模式 */
export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

const resizeModeToContentFit: Record<
  ImageResizeMode,
  NonNullable<ExpoImageComponentProps['contentFit']>
> = {
  cover: 'cover',
  contain: 'contain',
  stretch: 'fill',
  center: 'none',
};

/**
 * AppImage 组件属性接口
 */
export interface AppImageProps {
  /** 图片资源，可以是本地资源或远程 URL */
  source: ExpoImageComponentProps['source'];
  /** 宽度，数字表示像素，字符串表示百分比 */
  width?: number | string;
  /** 高度，数字表示像素，'auto' 表示自适应，或使用 'aspect-16/9' 等比例格式 */
  height?: number | string;
  /** 圆角大小，支持预设值或数字 */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
  /** 加载时的占位图 */
  placeholder?: ExpoImageComponentProps['placeholder'];
  /** 加载失败时的占位图 */
  errorPlaceholder?: ExpoImageComponentProps['source'];
  /** 是否显示加载指示器，设为 true 显示默认指示器，或传入自定义节点 */
  loadingIndicator?: boolean | React.ReactNode;
  /** 是否在加载失败时显示错误图标 */
  showError?: boolean;
  /** 图片缩放模式 */
  resizeMode?: ImageResizeMode;
  /** Expo Image 缓存策略 */
  cachePolicy?: ExpoImageComponentProps['cachePolicy'];
  /** 图片过渡动画时长 */
  transition?: ExpoImageComponentProps['transition'];
  /** 图片加载优先级 */
  priority?: ExpoImageComponentProps['priority'];
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
 */
function resolveRadius(radius: AppImageProps['borderRadius']): number {
  if (typeof radius === 'number') return radius;
  return radiusMap[radius || 'none'];
}

/**
 * AppImage - 基于 expo-image 的图片组件
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
  cachePolicy = 'memory-disk',
  transition = 150,
  priority = 'normal',
  onLoad,
  onError,
  onPress,
  onLongPress,
  className,
  style,
}: AppImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { theme } = useOptionalTheme();

  const resolvedRadius = resolveRadius(borderRadius);
  const contentFit = resizeModeToContentFit[resizeMode];

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
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

  const imageStyle = useMemo<StyleProp<ImageStyle>>(
    () => [
      {
        width: '100%',
        height: '100%',
        borderRadius: resolvedRadius,
      },
      style,
    ],
    [resolvedRadius, style]
  );

  const renderLoading = () => {
    if (!isLoading || placeholder) return null;

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

    return <SkeletonBlock className="absolute inset-0" rounded={borderRadius} />;
  };

  const renderError = () => {
    if (!hasError) return null;

    if (errorPlaceholder) {
      return (
        <ExpoImage
          source={errorPlaceholder}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: resolvedRadius,
          }}
          contentFit={contentFit}
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
      <ExpoImage
        source={source}
        placeholder={placeholder}
        placeholderContentFit={contentFit}
        style={imageStyle}
        contentFit={contentFit}
        cachePolicy={cachePolicy}
        transition={transition}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
      />
      {renderLoading()}
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
