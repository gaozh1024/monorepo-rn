# AppImage 组件设计文档

> 位置: `packages/ui/src/components/AppImage.tsx`
> 依赖: `react-native-fast-image`（可选但推荐）或 RN 内置 Image

---

## 1. 设计目标

- **加载优化**: 图片懒加载、缓存策略、加载优先级
- **体验完善**: 占位图、加载指示、错误处理、渐进加载
- **开发便捷**: 统一的图片处理 API，减少样板代码
- **性能优先**: 支持图片尺寸优化、格式转换

---

## 2. 架构决策

### 2.1 底层实现选择

```typescript
// 方案A: 优先使用 react-native-fast-image（性能更好）
// 如果未安装则回退到 RN 内置 Image

try {
  const FastImage = require('react-native-fast-image');
  // 使用 FastImage
} catch {
  // 回退到 Image
}
```

### 2.2 缓存策略

- **内存缓存**: 最近使用的图片保存在内存
- **磁盘缓存**: 持久化存储，支持自定义过期时间
- **HTTP 缓存**: 遵循 Cache-Control 响应头

---

## 3. API 设计

### 3.1 基础用法

```tsx
import { AppImage } from '@gaozh1024/rn-ui';

// 基础用法（与 RN Image 相同）
<AppImage
  source={{ uri: 'https://example.com/photo.jpg' }}
  style={{ width: 200, height: 200 }}
/>

// 本地图片
<AppImage
  source={require('./assets/logo.png')}
  style={{ width: 100, height: 100 }}
/>

// 完整配置
<AppImage
  source={{ uri: 'https://example.com/photo.jpg' }}
  width={200}
  height={200}
  borderRadius="lg"
  placeholder={require('./assets/placeholder.png')}
  errorPlaceholder={require('./assets/error.png')}
  loadingIndicator
  resizeMode="cover"
  priority="high"
  cache="immutable"
  onLoad={() => console.log('loaded')}
  onError={(error) => console.log('error:', error)}
/>
```

### 3.2 Props 定义

```typescript
import type { ImageProps, ImageSourcePropType, ImageResizeMode } from 'react-native';

type Priority = 'low' | 'normal' | 'high';
type CacheType = 'immutable' | 'web' | 'cacheOnly';

interface AppImageProps extends Omit<ImageProps, 'source'> {
  /**
   * 图片源（支持 URI 或本地资源）
   */
  source: ImageSourcePropType | { uri: string };

  /**
   * 图片宽度（数字或字符串）
   * - 数字：固定像素值
   * - 字符串：如 'full'（100%）、'1/2'（50%）
   * @default 'full'
   */
  width?: number | string;

  /**
   * 图片高度
   * - 数字：固定像素值
   * - 字符串：如 'auto'（根据宽度自适应）、'aspect-16/9'（固定比例）
   * @default 'auto'
   */
  height?: number | string;

  /**
   * 圆角（支持主题 token）
   * - 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
   * - 数字：固定像素值
   * @default 'none'
   */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;

  /**
   * 加载时的占位图
   */
  placeholder?: ImageSourcePropType;

  /**
   * 加载失败时的占位图
   */
  errorPlaceholder?: ImageSourcePropType;

  /**
   * 是否显示加载指示器
   * - boolean：是否显示默认 Loading
   * - ReactNode：自定义加载 UI
   * @default false
   */
  loadingIndicator?: boolean | React.ReactNode;

  /**
   * 是否显示错误提示
   * @default false
   */
  showError?: boolean;

  /**
   * 图片缩放模式
   * @default 'cover'
   */
  resizeMode?: ImageResizeMode;

  /**
   * 加载优先级（FastImage 支持）
   * @default 'normal'
   */
  priority?: Priority;

  /**
   * 缓存策略（FastImage 支持）
   * - 'immutable': 图片永不改变（默认）
   * - 'web': 遵循 HTTP 缓存头
   * - 'cacheOnly': 只从缓存加载
   * @default 'immutable'
   */
  cache?: CacheType;

  /**
   * 是否启用渐显动画
   * @default true
   */
  fadeDuration?: number;

  /**
   * 加载成功回调
   */
  onLoad?: () => void;

  /**
   * 加载失败回调
   */
  onError?: (error: { nativeEvent: { error: string } }) => void;

  /**
   * 点击回调
   */
  onPress?: () => void;

  /**
   * 长按回调
   */
  onLongPress?: () => void;
}
```

### 3.3 高级 Props

```typescript
interface AppImageAdvancedProps {
  /**
   * 是否启用图片预览（点击放大查看）
   * @default false
   */
  previewable?: boolean;

  /**
   * 预览时的图片 URL（原图）
   * 如果不提供，使用 source
   */
  previewSource?: { uri: string };

  /**
   * 图片加载失败时的重试次数
   * @default 0
   */
  retryCount?: number;

  /**
   * 是否启用图片懒加载（仅在可视区域加载）
   * @default true（当没有 placeholder 时）
   */
  lazy?: boolean;

  /**
   * 图片样式（支持 tailwind 类名）
   */
  className?: string;
}
```

---

## 4. 实现细节

### 4.1 核心组件实现

```tsx
// src/components/AppImage.tsx

import React, { useState, useCallback } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  ImageSourcePropType,
  StyleProp,
  ImageStyle,
} from 'react-native';
import { cn } from '@gaozh1024/rn-utils';
import { useTheme } from '@gaozh1024/rn-theme';
import { AppPressable, AppView } from '../primitives';
import { Loading } from '../feedback';

// 尝试加载 FastImage
let FastImage: any;
try {
  FastImage = require('react-native-fast-image').default;
} catch {
  FastImage = null;
}

export interface AppImageProps {
  source: ImageSourcePropType | { uri: string };
  width?: number | string;
  height?: number | string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
  placeholder?: ImageSourcePropType;
  errorPlaceholder?: ImageSourcePropType;
  loadingIndicator?: boolean | React.ReactNode;
  showError?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  priority?: 'low' | 'normal' | 'high';
  cache?: 'immutable' | 'web' | 'cacheOnly';
  fadeDuration?: number;
  lazy?: boolean;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
  style?: StyleProp<ImageStyle>;
}

const radiusMap = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

function resolveSize(
  size: number | string | undefined,
  containerWidth: number
): number | undefined {
  if (typeof size === 'number') return size;
  if (size === 'full' || size === undefined) return containerWidth;
  if (size === 'auto') return undefined;
  // 支持比例如 '1/2'
  if (size.includes('/')) {
    const [num, den] = size.split('/').map(Number);
    return (containerWidth * num) / den;
  }
  return Number(size);
}

function resolveRadius(radius: AppImageProps['borderRadius']): number {
  if (typeof radius === 'number') return radius;
  return radiusMap[radius || 'none'];
}

export function AppImage({
  source,
  width = 'full',
  height = 'auto',
  borderRadius = 'none',
  placeholder,
  errorPlaceholder,
  loadingIndicator = false,
  showError = false,
  resizeMode = 'cover',
  priority = 'normal',
  cache = 'immutable',
  fadeDuration = 300,
  lazy = true,
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

  const imageProps = {
    source,
    style: [
      {
        width: '100%',
        height: '100%',
        borderRadius: resolvedRadius,
      },
      style,
    ],
    resizeMode,
    onLoad: handleLoad,
    onError: handleError,
  };

  // 渲染图片组件
  const renderImage = () => {
    if (FastImage && typeof source === 'object' && 'uri' in source) {
      return (
        <FastImage
          {...imageProps}
          source={{
            uri: source.uri,
            priority: FastImage.priority[priority.toUpperCase()],
            cache: FastImage.cacheControl[cache.toUpperCase()],
          }}
        />
      );
    }
    return <Image {...imageProps} fadeDuration={fadeDuration} />;
  };

  // 渲染加载状态
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
            <Loading />
          </AppView>
        );
      }
      return (
        <AppView center className="absolute inset-0" style={{ borderRadius: resolvedRadius }}>
          {loadingIndicator}
        </AppView>
      );
    }
    return null;
  };

  // 渲染错误状态
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

  const content = (
    <View
      className={cn('overflow-hidden', className)}
      style={{
        width: typeof width === 'number' ? width : '100%',
        height: typeof height === 'number' ? height : undefined,
        aspectRatio:
          typeof height === 'string' && height.startsWith('aspect-')
            ? Number(height.replace('aspect-', '').replace('/', ':').split(':')[0]) /
              Number(height.replace('aspect-', '').replace('/', ':').split(':')[1])
            : undefined,
        borderRadius: resolvedRadius,
      }}
    >
      {renderLoading()}
      {renderImage()}
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
```

---

## 5. 使用示例

### 5.1 基础用法

```tsx
import { AppImage } from '@gaozh1024/rn-ui';

// 网络图片
<AppImage
  source={{ uri: 'https://example.com/photo.jpg' }}
  width={200}
  height={200}
/>

// 固定比例
<AppImage
  source={{ uri: 'https://example.com/banner.jpg' }}
  width="full"
  height="aspect-16/9"
  borderRadius="lg"
/>

// 圆形头像
<AppImage
  source={{ uri: user.avatar }}
  width={64}
  height={64}
  borderRadius="full"
/>
```

### 5.2 加载状态处理

```tsx
// 使用占位图
<AppImage
  source={{ uri: photoUrl }}
  width="full"
  height="aspect-4/3"
  placeholder={require('./assets/photo-placeholder.png')}
  errorPlaceholder={require('./assets/photo-error.png')}
/>

// 使用加载指示器
<AppImage
  source={{ uri: photoUrl }}
  width={200}
  height={200}
  loadingIndicator
  showError
/>
```

### 5.3 列表图片优化

```tsx
import { AppList } from '@gaozh1024/rn-ui';

// 列表中的图片使用低优先级和懒加载
function ProductItem({ product }) {
  return (
    <AppView row gap={3} p={3}>
      <AppImage
        source={{ uri: product.image }}
        width={80}
        height={80}
        borderRadius="md"
        priority="low" // 低优先级
        lazy // 懒加载
        cache="web" // 遵循 HTTP 缓存
      />
      <AppView flex>
        <AppText weight="semibold">{product.name}</AppText>
        <AppText color="primary-500">¥{product.price}</AppText>
      </AppView>
    </AppView>
  );
}
```

### 5.4 可点击查看大图

```tsx
import { useState } from 'react';
import { Modal } from 'react-native';

function GalleryImage({ thumbnail, fullImage }) {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <>
      <AppImage
        source={{ uri: thumbnail }}
        width="1/3"
        height={120}
        borderRadius="md"
        onPress={() => setPreviewVisible(true)}
      />

      <Modal visible={previewVisible} transparent onRequestClose={() => setPreviewVisible(false)}>
        <AppView flex bg="black" center>
          <AppImage source={{ uri: fullImage }} width="full" height="auto" resizeMode="contain" />
          <AppPressable
            onPress={() => setPreviewVisible(false)}
            className="absolute top-10 right-4"
          >
            <Icon name="close" size={32} color="white" />
          </AppPressable>
        </AppView>
      </Modal>
    </>
  );
}
```

---

## 6. 依赖清单

```json
{
  "dependencies": {
    // 可选但强烈推荐
    "react-native-fast-image": "^8.6.3"
  },
  "peerDependencies": {
    "@gaozh1024/rn-utils": "^0.1.0",
    "@gaozh1024/rn-theme": "^0.1.0",
    "@gaozh1024/rn-ui": "^0.1.0",
    "react": "*",
    "react-native": "*"
  }
}
```

---

## 7. 验收标准

- [ ] 支持 URI 和本地图片源
- [ ] 支持 FastImage（自动降级到 RN Image）
- [ ] 支持占位图（loading 和 error）
- [ ] 支持加载指示器（默认或自定义）
- [ ] 支持多种圆角模式（theme token 和数字）
- [ ] 支持多种尺寸模式（固定值、比例、自适应）
- [ ] 支持点击/长按交互
- [ ] 支持优先级和缓存策略配置
- [ ] 图片加载成功/失败回调
- [ ] 单元测试覆盖状态流转

---

**审核状态**: 📝 待审核  
**预计开发时间**: 2-3 天  
**优先级**: P0（核心组件）
