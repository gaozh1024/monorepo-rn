# @gaozh1024/expo-starter 0.2.11 Release Notes

`0.2.11` 是一次模板跟进发布，主要同步 `@gaozh1024/rn-kit@0.4.6` 的图片与骨架屏能力，并补齐模板使用说明。

## 本次版本说明

- 模板依赖升级到 `@gaozh1024/rn-kit@^0.4.6`
- 模板内置版本号同步为 `0.2.11`
- 模板补充 `expo-image` 依赖，和 `AppImage` 实现保持一致
- 模板 README 已同步补充 `AppImage` / `Skeleton` 系列组件推荐用法

## 发布前验证

已验证：

- `pnpm --dir templates/expo-starter lint`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `templates/expo-starter` 目录）

## 配套版本

- `@gaozh1024/expo-starter`：`0.2.11`
- `@gaozh1024/rn-kit`：`0.4.6`
