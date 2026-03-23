# @gaozh1024/expo-starter 0.2.9 Release Notes

`0.2.9` 是一次模板跟进发布，主要同步依赖到 `@gaozh1024/rn-kit@0.4.4`，并更新模板内置版本号。

## 本次版本说明

- 模板依赖升级到 `@gaozh1024/rn-kit@^0.4.4`
- 模板内置版本号同步为 `0.2.9`
- 保持当前 app-config 配置方式与模板结构不变

## 发布前验证

已验证：

- `pnpm --dir templates/expo-starter lint`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `templates/expo-starter` 目录）

## 配套版本

- `@gaozh1024/expo-starter`：`0.2.9`
- `@gaozh1024/rn-kit`：`0.4.4`
