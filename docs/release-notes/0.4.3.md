# @gaozh1024/rn-kit 0.4.3 Release Notes

`0.4.3` 是一次发布前修正版本，主要收敛本轮 logger 与安全区相关体验问题，并为模板提供新的可依赖版本号。

## 本次更新

### 1. 修复页面切换时 Header 安全区闪动

- `AppProvider` 中的 `SafeAreaProvider` 现在显式传入 `initialWindowMetrics`
- 避免首帧 `insets.top = 0`、下一帧再补安全区导致的 Header 下跳
- 这一项主要改善带 `AppHeader` 页面在新开页面时的视觉闪动

### 2. 调整开发日志浮层按钮样式

- `Log` 按钮缩为更紧凑的固定尺寸
- 显式修正按钮内容的水平 / 垂直居中
- 同步更新吸边边界计算与测试

### 3. 发布前验证通过

已验证：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit build`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.3`
- `@gaozh1024/expo-starter`：`0.2.8`（依赖 `@gaozh1024/rn-kit@^0.4.3`）
