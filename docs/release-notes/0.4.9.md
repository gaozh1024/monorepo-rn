# @gaozh1024/rn-kit 0.4.9 Release Notes

`0.4.9` 是一次 `AppPressable` 兼容性修正发布，重点修复静态 `style` 在真实项目中的显示异常，并同步恢复 `AppButton` 与开发日志浮层按钮的显示。

## 本次更新

### 1. 修复 `AppPressable` 静态 `style` 兼容问题

此前 `AppPressable` 为了兼容原生 `Pressable` 的 `style(state)` 语义，统一把 `style` 走成了 callback 形式。

这会导致某些项目环境下，下面这种静态写法显示异常：

```tsx
<AppPressable style={{ backgroundColor: '#6366f1' }} />
```

现在已调整为：

- 静态 `style` → 直接走静态样式数组
- `style(state)` → 保持原生 `Pressable` callback 语义

### 2. 恢复 `AppButton` 的实际显示

由于 `AppButton` 底层基于 `AppPressable` 实现，所以本次修复也同步解决了：

- `AppButton` 设置 `color="primary"` / `variant="solid"` 时按钮不显示
- `w` / `h` / `rounded` 等参数正常但背景不出现的问题

### 3. 恢复 `LogOverlay` 的浮动按钮显示

开发日志浮层右下角的 `Log` 按钮同样基于 `AppPressable` 实现。

本次修复后：

- `enableLogger`
- `overlayEnabled`

对应的浮动按钮会恢复正常显示。

### 4. API 与 `AppPressable` 相关文档同步完善

- 继续保留 `createAPI` 的路径参数提前校验与请求构建错误统一错误链路
- README 补充 `AppPressable` 同时支持静态 `style` 与 `style(state)` 两种写法

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit build`
- `npm pack --dry-run`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.9`
- npm 当前已发布最新版本：`0.4.7`
