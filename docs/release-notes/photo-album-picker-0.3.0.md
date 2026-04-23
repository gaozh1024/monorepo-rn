# @gaozh1024/photo-album-picker 0.3.0 Release Notes

`0.3.0` 是一次向前兼容的新特性升级，重点补齐相册流程的 UI 可配置能力，让业务侧可以直接改权限按钮颜色，并统一覆盖整套文案。

## 本次包含

- 新增 `uiConfig.theme.permissionButtonBackgroundColor`，可替换权限页“允许访问”按钮背景色
- 新增 `uiConfig.texts`，统一覆盖按钮入口、权限页、相册页、预览页、裁剪页和错误提示文案
- 默认文案保持中文，已有接入不需要额外改动
- 导出默认文案常量和格式化工具，便于业务侧复用
- README 补充完整接入示例和模板变量说明

## 推荐安装

```bash
pnpm add @gaozh1024/photo-album-picker@^0.3.0
pnpm add @gaozh1024/rn-kit @react-navigation/native @shopify/flash-list
npx expo install expo-image expo-image-manipulator expo-media-library
npx expo install react-native-safe-area-context react-native-gesture-handler react-native-reanimated
pnpm add react-native-zoom-toolkit
```

## 配置示例

```tsx
<PhotoAlbumButton
  onPhotosSelected={handlePhotosSelected}
  options={{
    uiConfig: {
      theme: {
        permissionButtonBackgroundColor: '#16a34a',
      },
      texts: {
        permissionAllowButton: 'Allow Access',
        albumTitle: 'Album',
        completeButton: 'Done',
      },
    },
  }}
/>
```

## 验证结果

```bash
pnpm verify:release
cd packages/photo-album-picker && npm_config_cache=/tmp/npm-cache npm pack --dry-run
```

## 相关包

- `@gaozh1024/photo-album-picker`：`0.3.0`
