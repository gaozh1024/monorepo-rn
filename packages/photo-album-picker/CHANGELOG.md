# @gaozh1024/photo-album-picker

## 0.2.0

### Minor Changes

- 644e7c8: 新增独立的相册选择包，提供相册按钮入口、网格选择、预览与裁剪页面，并补齐安装与接入文档。

### Patch Changes

- 修正 `@gaozh1024/photo-album-picker` 的 Expo peer 兼容范围，收敛到 Expo SDK 54，并将 `expo-image-manipulator` 约束改为与 Expo 54 匹配的 `14.x`，避免安装到不兼容的 `55.x` 后在裁剪流程触发原生崩溃。

## 0.1.0

### Minor Changes

- 初始版本发布。
- 提供相册网格选择、预览、裁剪页面、按钮入口与底层 hook。
- 适配 Expo / React Native + React Navigation 场景。
