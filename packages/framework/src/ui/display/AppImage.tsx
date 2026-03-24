import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { AppPressable, AppView } from '@/ui/primitives';
import { SkeletonBlock } from '@/ui/feedback';
import { Icon } from './Icon';
import {
  type CommonLayoutProps,
  type LayoutRounded,
  type LayoutSurface,
} from '../utils/layout-shortcuts';

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
export interface AppImageProps extends Pick<
  CommonLayoutProps,
  | 'flex'
  | 'm'
  | 'mx'
  | 'my'
  | 'mt'
  | 'mb'
  | 'ml'
  | 'mr'
  | 'w'
  | 'h'
  | 'minW'
  | 'minH'
  | 'maxW'
  | 'maxH'
  | 'rounded'
> {
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
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: LayoutSurface;
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
function resolveRadius(radius: AppImageProps['borderRadius'] | LayoutRounded): number {
  if (typeof radius === 'number') return radius;
  return radiusMap[radius || 'none'];
}

/**
 * AppImage - 基于 expo-image 的图片组件
 */
export function AppImage({
  flex,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  rounded,
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
  bg,
  surface,
}: AppImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { theme } = useOptionalTheme();

  const resolvedRadius = resolveRadius(rounded ?? borderRadius);
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
  const resolvedWidth = w ?? width;
  const resolvedHeight = h ?? height;
  const resolvedWrapperWidth = (w === undefined ? resolvedWidth : undefined) as ViewStyle['width'];
  const resolvedWrapperHeight = (
    (h === undefined && typeof resolvedHeight === 'number') ||
    (h === undefined &&
      typeof resolvedHeight === 'string' &&
      resolvedHeight !== 'auto' &&
      !resolvedHeight.startsWith('aspect-'))
      ? resolvedHeight
      : undefined
  ) as ViewStyle['height'];
  const resolvedWrapperAspectRatio =
    h === undefined && typeof resolvedHeight === 'string' && resolvedHeight.startsWith('aspect-')
      ? Number(resolvedHeight.replace('aspect-', '').split('/')[0]) /
        Number(resolvedHeight.replace('aspect-', '').split('/')[1] || 1)
      : undefined;
  const wrapperStyle = useMemo(
    () => [
      {
        overflow: 'hidden' as const,
        width: resolvedWrapperWidth,
        height: resolvedWrapperHeight,
        aspectRatio: resolvedWrapperAspectRatio,
      },
    ],
    [resolvedWrapperAspectRatio, resolvedWrapperHeight, resolvedWrapperWidth]
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

  const content = (
    <>
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
    </>
  );

  if (onPress || onLongPress) {
    return (
      <AppPressable
        flex={flex}
        m={m}
        mx={mx}
        my={my}
        mt={mt}
        mb={mb}
        ml={ml}
        mr={mr}
        w={w}
        h={typeof h === 'number' || typeof h === 'string' ? h : undefined}
        minW={minW}
        minH={minH}
        maxW={maxW}
        maxH={maxH}
        rounded={rounded ?? borderRadius}
        bg={bg}
        surface={surface}
        className={cn(className)}
        style={wrapperStyle}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {content}
      </AppPressable>
    );
  }

  return (
    <AppView
      flex={flex}
      m={m}
      mx={mx}
      my={my}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      w={w}
      h={typeof h === 'number' || typeof h === 'string' ? h : undefined}
      minW={minW}
      minH={minH}
      maxW={maxW}
      maxH={maxH}
      rounded={rounded ?? borderRadius}
      bg={bg}
      surface={surface}
      className={cn(className)}
      style={wrapperStyle}
    >
      {content}
    </AppView>
  );
}
