# @gaozh1024/expo-starter 0.2.6 Release Notes

`0.2.6` 是一次模板侧的发布准备更新，重点把模板默认接入方式和 `rn-kit` 当前推荐实践对齐，方便直接发布到 npm 后给新项目使用。

## 更新内容

### 1. 开发态可观测性默认预配置

- `src/app/providers.tsx` 显式开启：
  - `enableLogger`
  - `enableErrorBoundary`
- 增加默认 `loggerProps`
  - `level: 'debug'`
  - `maxEntries: 200`
  - `exportEnabled: true`
- 错误边界增加更明确的兜底文案

这样模板项目在开发环境里开箱即可查看：

- Console 日志
- App 内日志浮层
- 渲染异常错误边界

### 2. API 工厂默认接入 observability

- `src/data/api.ts` 现在默认开启 `createAPI({ observability })`
- 自动记录 `request / response / error`
- 默认写入 `api` 命名空间
- 对常见敏感字段做脱敏处理，例如：
  - `password`
  - `token`
  - `authorization`
  - `secret`

这样模板在联调真实接口时，更适合作为业务项目起点。

### 3. 表单页键盘交互补齐

模板中的登录 / 注册 / 找回密码页面已统一接入点击空白区域收起键盘：

- `SafeScreen dismissKeyboardOnPressOutside`
- `AppScrollView dismissKeyboardOnPressOutside`

同时公共 `PageScreen` 组件也同步带上该默认行为，便于后续页面复用。

### 4. 版本与文档同步

- `@gaozh1024/expo-starter`：`0.2.6`
- `src/bootstrap/app-config.ts` 内置版本号同步更新
- README 补充模板已经预配置 observability 与脱敏说明

## 发布前验证

建议至少执行：

```bash
pnpm --dir templates/expo-starter lint
npm_config_cache=/tmp/npm-cache npm pack --dry-run
```

如果模板依赖的 `@gaozh1024/rn-kit` 还有未发布变更，请先发框架包，再发模板包。
