# @gaozh1024/rn-kit 0.3.0 Release Notes

`0.3.0` 聚焦三件事：

- 页面级抽屉能力补齐：`PageDrawer` / `usePageDrawer`
- 主题响应修复：`AppText` 默认文字色自动跟随主题
- 渐变背景能力集成：`GradientView`

## 新增能力

### 1. 页面级抽屉

新增：

- `PageDrawer`
- `usePageDrawer`

支持：

- 左 / 右侧抽屉
- 手势关闭
- 点击遮罩关闭
- Android 返回键优先收起抽屉

### 2. 渐变背景

新增：

- `GradientView`

底层封装 `expo-linear-gradient`，可用于：

- 登录页渐变头图
- 启动页背景
- Banner / Hero 区块
- 渐变卡片

## 修复与改进

### 1. 深色模式文本颜色

修复 `AppText` 在未显式传 `tone/color` 时不自动跟随主题的问题。

现在：

- 默认文本会使用当前主题的 `text` 色
- 显式传入 `tone`
- 显式传入 `color`
- 显式使用 `style.color`
- 显式使用 `className` 文字色类

以上场景都不会被默认主题色误覆盖。

### 2. 模板升级

模板同步更新：

- 升级 Expo SDK 54 兼容依赖
- 内置 `expo-linear-gradient`
- 登录页 / 启动页改为渐变背景示例
- Logo / 图标资源统一为 `assets/logo.png`
- 抽出 `ListItem` / `ListSection`，减少重复分隔线代码

## 版本建议

如果你是手动接入框架，请同时安装：

```bash
npx expo install expo-linear-gradient
```

如果你是从模板创建项目，则模板已内置该依赖。

## 发布前检查

在 `0.3.0` 发布前，已完成：

- `pnpm --filter @gaozh1024/rn-kit test`
- `pnpm --filter @gaozh1024/rn-kit typecheck`
- `pnpm --filter @gaozh1024/rn-kit build`
- `templates/expo-starter expo install --check`
- `templates/expo-starter npm run lint`
