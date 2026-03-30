# @gaozh1024/photo-album-picker

> Expo / React Native 相册选择组件包，内置网格选择、全屏预览和图片裁剪流程。

适合聊天发送图片、头像裁剪、发布页多图选择等场景。

## ✨ 包含能力

- `PhotoAlbumButton`：开箱即用的相册按钮入口
- `PhotoAlbumGrid`：相册网格选择组件
- `usePhotoAlbum`：相册数据加载与选择状态管理 hook
- `PhotoAlbumScreen`：完整相册页面
- `PhotoCropScreen`：图片裁剪页面
- `MEDIA_PICKER_ROUTES`：默认路由名常量
- `normalizeOpenOptions` / `resolveMediaTypes` / `createCroppedPhotoAlbumItem`

## 📦 安装

```bash
pnpm add @gaozh1024/photo-album-picker
```

### 当前兼容基线

当前版本按 Expo SDK 54 验证，推荐依赖基线：

- `expo`: `~54.0.33`
- `expo-image`: `~3.0.11`
- `expo-image-manipulator`: `~14.0.8`
- `expo-media-library`: `~18.2.1`

当前 npm 包版本：`0.2.0`

### 必需依赖

这个包本身依赖以下库：

```bash
pnpm add @gaozh1024/rn-kit
pnpm add @react-navigation/native @shopify/flash-list
npx expo install expo-image expo-image-manipulator expo-media-library
npx expo install react-native-safe-area-context react-native-gesture-handler react-native-reanimated
pnpm add react-native-zoom-toolkit
```

请优先使用 `npx expo install` 安装 Expo 官方包，让 Expo 根据当前 SDK 自动选择兼容版本；不要手动把 `expo-image-manipulator` 升到 55.x，否则在 Expo 54 项目里可能出现原生不兼容。

### Expo 54 推荐安装示例

```bash
pnpm add @gaozh1024/photo-album-picker@^0.2.0
pnpm add @gaozh1024/rn-kit @react-navigation/native @shopify/flash-list
npx expo install expo-image expo-image-manipulator expo-media-library
npx expo install react-native-safe-area-context react-native-gesture-handler react-native-reanimated
pnpm add react-native-zoom-toolkit
```

### 哪些库是必须的？

#### 直接必需

- `@gaozh1024/rn-kit`
- `@react-navigation/native`
- `@shopify/flash-list`
- `expo-image`
- `expo-image-manipulator`
- `expo-media-library`
- `react-native-safe-area-context`
- `react-native-zoom-toolkit`

#### 间接必需

`react-native-zoom-toolkit` 依赖：

- `react-native-gesture-handler`
- `react-native-reanimated`

如果你的项目已经在使用 `@gaozh1024/rn-kit`，通常这几个基础依赖已经存在；但接入 `@gaozh1024/photo-album-picker` 时仍建议确认版本兼容。

## 版本兼容与排障

### Expo SDK 54

当前版本按 Expo SDK 54 验证，裁剪能力依赖的 `expo-image-manipulator` 必须使用 `14.x`。

如果你在 Expo 54 项目里手动安装了 `expo-image-manipulator@55.x`，可能在裁剪时看到类似错误：

```txt
Error: Call to function 'ExpoImageManipulator.manipulate' has been rejected.
Caused by: java.lang.NoSuchMethodError
```

处理方式：

```bash
npx expo install expo-image-manipulator
```

不要使用 `npm install --legacy-peer-deps` 去掩盖这个问题；正确做法是让 Expo 官方依赖回到和当前 SDK 一致的版本。

## 权限与 Expo 配置

### 1. 配置 `expo-media-library` plugin

在 `app.json` 中加入：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "允许访问相册以选择图片或视频"
        }
      ]
    ]
  }
}
```

### 2. 重新生成原生工程

如果你的项目使用 Expo prebuild / dev build：

```bash
npx expo prebuild
```

或重新运行：

```bash
npx expo run:ios
npx expo run:android
```

## 🚀 最小接入方式

### 第一步：注册路由

```tsx
import { StackNavigator } from '@gaozh1024/rn-kit';
import {
  MEDIA_PICKER_ROUTES,
  PhotoAlbumScreen,
  PhotoCropScreen,
} from '@gaozh1024/photo-album-picker';

export function RootNavigator() {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      {/* 你的业务页面 */}

      <StackNavigator.Screen
        name={MEDIA_PICKER_ROUTES.PHOTO_ALBUM}
        component={PhotoAlbumScreen}
        options={{ freezeOnBlur: true }}
      />

      <StackNavigator.Screen
        name={MEDIA_PICKER_ROUTES.PHOTO_CROP}
        component={PhotoCropScreen}
        options={{
          animation: 'none',
          detachPreviousScreen: false,
          gestureEnabled: false,
          freezeOnBlur: true,
        }}
      />
    </StackNavigator>
  );
}
```

> 如果你不会用裁剪流程，也可以先只注册 `PhotoAlbumScreen`；但推荐两个页面都注册好，后续开启 `crop` 时无需再改导航。

### 第二步：页面里调用按钮

```tsx
import { PhotoAlbumButton } from '@gaozh1024/photo-album-picker';

function ChatToolbar() {
  return (
    <PhotoAlbumButton
      buttonText="选择图片"
      options={{
        maxSelection: 9,
        mediaType: 'all',
      }}
      onPhotosSelected={photos => {
        console.log('selected photos', photos);
      }}
    />
  );
}
```

## 🧩 常见用法

### 1. 只选图片

```tsx
<PhotoAlbumButton
  onPhotosSelected={handlePhotosSelected}
  options={{
    maxSelection: 9,
    mediaType: 'photo',
  }}
/>
```

### 2. 只选视频

```tsx
<PhotoAlbumButton
  onPhotosSelected={handleVideosSelected}
  options={{
    maxSelection: 1,
    mediaType: 'video',
    maxVideoDuration: 60,
  }}
/>
```

### 3. 单图裁剪

```tsx
<PhotoAlbumButton
  onPhotosSelected={photos => {
    const [photo] = photos;
    console.log('cropped photo', photo);
  }}
  options={{
    crop: {
      aspect: [1, 1],
      shape: 'rect',
      quality: 1,
    },
  }}
/>
```

`crop` 开启后会自动收敛为：

- `mediaType = 'photo'`
- `maxSelection = 1`
- `allowsMultipleSelection = false`

### 4. 自定义路由名

```tsx
<PhotoAlbumButton
  onPhotosSelected={handlePhotosSelected}
  routeNames={{
    photoAlbum: 'MyPhotoAlbum',
    photoCrop: 'MyPhotoCrop',
  }}
/>
```

同时你也要在导航里注册同名页面。

## 🖼️ 直接使用网格组件

```tsx
import { PhotoAlbumGrid } from '@gaozh1024/photo-album-picker';

function AlbumBody() {
  return (
    <PhotoAlbumGrid
      maxSelection={9}
      allowsMultipleSelection
      onComplete={photos => {
        console.log('done', photos);
      }}
      onCancel={() => {
        console.log('cancel');
      }}
      onSelectionChange={photos => {
        console.log('selection change', photos.length);
      }}
    />
  );
}
```

## 🪝 使用底层 hook

```tsx
import { usePhotoAlbum } from '@gaozh1024/photo-album-picker';

function CustomAlbumView() {
  const {
    photos,
    loading,
    hasMore,
    selectedCount,
    toggleSelection,
    loadMore,
    refresh,
    getSelectedPhotos,
  } = usePhotoAlbum({
    initialLoadCount: 60,
    loadMoreCount: 40,
    mediaType: ['photo', 'video'],
  });

  return null;
}
```

## 📚 主要类型

```ts
import type {
  PhotoAlbumItem,
  PhotoAlbumOpenOptions,
  PhotoAlbumCropOptions,
  PhotoAlbumButtonProps,
  PhotoAlbumGridProps,
  MediaPickerRouteNames,
  PhotoAlbumRouteParams,
  PhotoCropRouteParams,
  DefaultPhotoAlbumParamList,
} from '@gaozh1024/photo-album-picker';
```

## 默认路由名

```ts
MEDIA_PICKER_ROUTES.PHOTO_ALBUM; // 'PhotoAlbum'
MEDIA_PICKER_ROUTES.PHOTO_CROP; // 'PhotoCrop'
```

## ⚠️ 注意事项

1. 这个包依赖 React Navigation 页面跳转，不是纯函数式 picker。
2. 开启裁剪能力时，需要同时接入 `PhotoCropScreen`。
3. `expo-media-library` 权限没配好时，组件会停留在权限申请界面。
4. 视频时长限制通过 `maxVideoDuration` 控制，单位是秒。
5. 当前裁剪流程只支持图片，不支持视频裁剪。

## 🛠️ 本地开发

```bash
pnpm --filter @gaozh1024/photo-album-picker typecheck
pnpm --filter @gaozh1024/photo-album-picker build
```
