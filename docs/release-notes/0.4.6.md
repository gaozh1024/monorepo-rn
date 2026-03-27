# @gaozh1024/rn-kit 0.4.6 Release Notes

`0.4.6` 是一次能力增强发布，重点补齐了图片与骨架屏体验，并新增了更统一的原生列表封装。

## 本次更新

### 1. `AppImage` 升级为基于 `expo-image`

- 底层实现切换为 `expo-image`
- 支持 `cachePolicy`
- 支持 `transition`
- 保留原有 `placeholder` / `errorPlaceholder` / `loadingIndicator` / `showError`

### 2. 新增统一骨架屏组件

新增：

- `Skeleton`
- `SkeletonBlock`
- `SkeletonText`
- `SkeletonAvatar`

同时：

- `AppImage` 默认加载占位已接入统一骨架
- `AppList` 内部 skeleton 已复用统一骨架样式

### 3. 新增 `AppFlatList`

- 提供与 `AppScrollView` 一致的快捷布局参数
- 支持 `bg` / `surface`
- 支持 `dismissKeyboardOnPressOutside`
- 保持原生 `FlatListProps<T>` 兼容

### 4. 文档与依赖说明更新

- README 新增图片与骨架屏章节
- README 补充 `AppFlatList` 使用说明
- `expo-image` 已加入框架 peer dependency 约束

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit build`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `packages/rn-kit` 目录）

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.6`
- `@gaozh1024/expo-starter`：`0.2.11`
