# @gaozh1024/rn-kit 0.4.16 Release Notes

`0.4.16` 是一次小型补丁发布，主要补齐 `AppHeader` 的颜色覆盖能力，解决深色头部、品牌色头部场景下标题和图标只能跟随主题默认文字色的问题。

## 本次更新

### 1. `AppHeader` 支持标题与图标颜色覆盖

`AppHeader` 新增以下 props：

- `titleColor`
- `subtitleColor`
- `leftIconColor`
- `rightIconColor`

现在可以直接针对头部内容做颜色控制，而不需要依赖全局主题切换。

例如：

```tsx
<AppHeader
  title="详情"
  titleColor="#ffffff"
  subtitleColor="#cbd5e1"
  leftIconColor="#ffffff"
  rightIconColor="#ffd700"
  style={{ backgroundColor: '#111827' }}
/>
```

默认行为保持不变：

- 未传颜色时，标题和图标仍沿用主题里的 `colors.text`
- 副标题仍沿用主题里的 `colors.textMuted`

### 2. 补充颜色透传测试

新增 `AppHeader` 颜色透传测试，覆盖：

- 标题颜色
- 副标题颜色
- 左侧图标颜色
- 右侧图标颜色

确保这次改动不会破坏原有默认主题行为。

### 3. 文档同步

- 更新 `packages/rn-kit/README.md`
- 更新 `packages/rn-kit/CHANGELOG.md`
- 更新 `docs/README.md` release notes 索引

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test -- AppHeader`
- `pnpm --dir packages/rn-kit build`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `packages/rn-kit` 目录）

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.16`
