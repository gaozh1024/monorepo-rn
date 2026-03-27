# @gaozh1024/photo-album-picker 0.1.0 Release Notes

`0.1.0` 是首个独立发布版本，用于在当前 monorepo 中承载相册选择、预览和裁剪能力。

## 本次包含

- 新增独立包：`packages/photo-album-picker`
- npm 包名改为：`@gaozh1024/photo-album-picker`
- 提供按钮入口、网格选择、完整页面、裁剪页面与底层 hook
- 接入 `tsup`，统一输出 `cjs / esm / dts` 产物
- 补齐安装说明、权限配置、导航接入文档与发布说明

## 安装

```bash
pnpm add @gaozh1024/photo-album-picker
pnpm add @react-navigation/native @shopify/flash-list react-native-zoom-toolkit
npx expo install expo-image expo-image-manipulator expo-media-library
```

## 验证建议

```bash
pnpm --dir packages/photo-album-picker typecheck
pnpm --dir packages/photo-album-picker build
```

## 相关包

- `@gaozh1024/photo-album-picker`：`0.1.0`
