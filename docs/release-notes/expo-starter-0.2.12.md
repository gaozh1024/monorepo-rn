# @gaozh1024/expo-starter 0.2.12 Release Notes

`0.2.12` 是一次模板跟进发布，主要同步 `@gaozh1024/rn-kit@0.4.7` 的页面容器与顶部安全区使用规则。

## 本次版本说明

- 模板依赖升级到 `@gaozh1024/rn-kit@^0.4.7`
- 模板内置版本号同步为 `0.2.12`
- README 补充 Header 页 / 非 Header 页的 `AppScreen` 使用约定
- `PageScreen` 示例补充注释，明确顶部安全区由 `AppHeader` 承接

## 发布前验证

已验证：

- `pnpm --dir templates/expo-starter lint`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit build`

## 配套版本

- `@gaozh1024/expo-starter`：`0.2.12`
- `@gaozh1024/rn-kit`：`0.4.7`
