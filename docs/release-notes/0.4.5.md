# @gaozh1024/rn-kit 0.4.5 Release Notes

`0.4.5` 主要重构了 `AppScreen` 的语义定位，让它真正成为“业务页面容器”，同时保留 `SafeScreen` 作为底层安全区原子组件。

## 本次更新

### 1. 重新定义 `AppScreen` 默认行为

`AppScreen` 现在默认：

- `top = false`
- `bottom = true`
- `surface = "background"`
- `flex = true`

这意味着它默认更适合与 `AppHeader` 搭配使用：顶部安全区由 Header 负责，页面根容器不再重复处理。

### 2. `AppScreen` 现在允许覆盖安全区边缘参数

现在可以直接这样使用：

```tsx
<AppScreen top bottom={false}>
  {/* custom page */}
</AppScreen>
```

不再限制 `top / bottom / left / right` 的透传。

### 3. `SafeScreen` 与 `AppScreen` 的职责进一步明确

- `SafeScreen`：底层安全区容器，默认 `top=true` / `bottom=true`
- `AppScreen`：页面语义容器，默认 `top=false` / `bottom=true`

这样可以避免 `SafeScreen` 和 `AppHeader` 在顶部安全区上职责重叠。

### 4. 文档更新

- README 中补充了 `AppScreen` / `SafeScreen` 的语义说明
- 补充了推荐使用场景与示例代码
- 容器支持矩阵已同步更新

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test -- SafeScreen`
- `pnpm --dir packages/rn-kit build`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `packages/rn-kit` 目录）

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.5`
- `@gaozh1024/expo-starter`：`0.2.10`（依赖 `@gaozh1024/rn-kit@^0.4.5`）
