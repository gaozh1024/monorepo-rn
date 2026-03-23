# @gaozh1024/expo-starter 0.2.10 Release Notes

`0.2.10` 是一次模板跟进发布，主要同步依赖到 `@gaozh1024/rn-kit@0.4.5`。

## 本次版本说明

- 模板依赖升级到 `@gaozh1024/rn-kit@^0.4.5`
- 模板内置版本号同步为 `0.2.10`
- 带 `AppHeader` 的模板页面容器切换为 `AppScreen`
- 模板 README 已同步补充 `AppScreen` / `SafeScreen` 的推荐使用场景

## 发布前验证

已验证：

- `pnpm --dir templates/expo-starter lint`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `templates/expo-starter` 目录）

## 配套版本

- `@gaozh1024/expo-starter`：`0.2.10`
- `@gaozh1024/rn-kit`：`0.4.5`
