# @gaozh1024/expo-starter 0.2.7 Release Notes

`0.2.7` 是一次补丁版本发布，主要用于跟进 `@gaozh1024/rn-kit@0.4.2`，并确保模板发布链路可以继续推进。

## 本次版本说明

`0.2.7` 延续 `0.2.6` 的模板更新内容，重点包括：

- 默认启用开发态 logger / error boundary
- API 工厂默认接入 observability
- 表单页统一补齐点击空白区域收起键盘
- 删除 `.env.example`，统一使用 `app-config`

## 版本同步

- `@gaozh1024/expo-starter`：`0.2.7`
- 模板内置 `app-config.version`：`0.2.7`
- 模板依赖 `@gaozh1024/rn-kit`：`^0.4.2`

## 发布前验证

建议至少执行：

```bash
pnpm --dir templates/expo-starter lint
npm_config_cache=/tmp/npm-cache npm pack --dry-run
```
