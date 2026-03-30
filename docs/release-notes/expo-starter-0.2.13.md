# expo-starter 0.2.13 Release Notes

**发布日期**: 2026-03-30

## 同步内容

### 依赖与版本

- 版本号同步至 `0.2.13`
- `@gaozh1024/rn-kit` 依赖提升至 `^0.4.15`
- `app.json` 中 `expo.version` 同步至 `0.2.13`
- LaunchScreen 版本显示同步至 `v0.2.13`

### Monorepo 联调链路

- `pnpm-workspace.yaml` 已包含 `templates/*`
- 模板纳入 workspace 后可直接消费本地 `rn-kit`，无需 yalc

### 数据层优化

- `src/data/api.ts` 补充 `getHeaders` 注入，通过 `session.getToken()` 自动携带 Authorization
- `observability.sanitize` / `onError` / `parseBusinessError` 添加明确类型（消除 implicit any）
- `onError` 保持轻量，仅打印日志，不耦合具体 UI 反馈

### 页面组件优化

- 登录页、注册页、找回密码页：主提交按钮统一使用 `AppButton`，保留原视觉风格与 loading/disabled 语义
- 设置页：`SwitchSettingItem` 中开关改为使用 rn-kit `Switch` 组件，移除手搓轨道实现

### 文档同步

- `README.md`：
  - 版本号更新至 0.2.13 / rn-kit 0.4.15
  - 目录结构移除 AuthStack/MyStack，明确 RootNavigator + MainTabs 架构
  - 补充 monorepo 内联调说明
- `项目模板蓝图.md`：
  - 目录结构与导航结构更新为与真实模板一致
  - 移除 AuthStack/MyStack 描述
- 新增本文档

## 迁移建议

从 0.2.12 升级无需额外改动，本次更新主要为：

1. 模板内部实现对齐最新 rn-kit 推荐用法
2. 文档与代码结构保持一致
3. monorepo 内联调体验优化

## 验证命令

```bash
# 在仓库根目录
pnpm install
pnpm --dir templates/expo-starter lint
```
