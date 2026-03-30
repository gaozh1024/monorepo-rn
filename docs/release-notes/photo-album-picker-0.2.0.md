# @gaozh1024/photo-album-picker 0.2.0 Release Notes

`0.2.0` 是首个面向稳定接入整理过的发布版本，包含相册选择包的完整能力说明，并修正了 Expo SDK 54 下的依赖兼容问题。

## 本次包含

- 保留相册网格选择、全屏预览、裁剪页面、按钮入口和 hook 能力
- 修正 `peerDependencies`，将 Expo 兼容基线收敛到 SDK 54
- 将 `expo-image-manipulator` 约束改为与 Expo 54 匹配的 `14.x`
- 补充 Expo 54 推荐安装方式与兼容性排障说明

## 推荐安装

```bash
pnpm add @gaozh1024/photo-album-picker@^0.2.0
pnpm add @gaozh1024/rn-kit @react-navigation/native @shopify/flash-list
npx expo install expo-image expo-image-manipulator expo-media-library
npx expo install react-native-safe-area-context react-native-gesture-handler react-native-reanimated
pnpm add react-native-zoom-toolkit
```

## 兼容性说明

当前版本按 Expo SDK 54 验证，推荐依赖基线：

- `expo`: `~54.0.33`
- `expo-image`: `~3.0.11`
- `expo-image-manipulator`: `~14.0.8`
- `expo-media-library`: `~18.2.1`

如果在 Expo 54 项目里错误安装了 `expo-image-manipulator@55.x`，裁剪流程可能触发原生崩溃。请优先使用 `npx expo install` 安装 Expo 官方依赖。

## 验证建议

```bash
pnpm --dir packages/photo-album-picker typecheck
pnpm --dir packages/photo-album-picker build
cd packages/photo-album-picker && npm pack --dry-run
```

## 相关包

- `@gaozh1024/photo-album-picker`：`0.2.0`
