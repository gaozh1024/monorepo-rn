# @gaozh1024/expo-starter 0.2.14 Release Notes

**发布日期**: 2026-04-02

## 本次更新

### 模板基础设施增强

- 默认接入 `expo-secure-store`，并在启动阶段注入 `rn-kit` storage 适配器
- 新增 `src/navigation/linking.ts`，提供最小可用的 deep linking 脚手架
- 新增 `src/providers/AppProviders.tsx`，预留业务级 Provider 扩展位

### 工程与文档同步

- 模板 README 补充持久化 storage、deep linking、Provider 扩展位说明
- `keywords` 新增 `@gaozh1024` 与 `@gaozh1024/expo-starter`
- 版本号同步至 `0.2.14`
- `app.json` 中 `expo.version` 同步至 `0.2.14`
- LaunchScreen 版本显示同步至 `v0.2.14`
- 模板蓝图文档中的初始化版本示例同步至 `0.2.14`

### 发布前校验链路

- 根仓库新增 `pnpm verify:release`
- 发布文档改为优先使用统一校验入口，减少漏检模板包的风险

## 适用场景

`0.2.14` 适合作为新的模板基线，尤其适用于：

1. 需要默认持久化登录态/本地会话信息的 Expo 项目
2. 需要预留 deep linking 能力的 App
3. 希望在模板中清晰区分基础设施 Provider 与业务 Provider 的团队

## 验证命令

```bash
pnpm verify:release
npm_config_cache=/tmp/npm-cache-expo-starter npm pack --dry-run --prefix templates/expo-starter
```

## 相关包

- `@gaozh1024/expo-starter`：`0.2.14`
- `@gaozh1024/rn-kit`：`^0.4.15`
