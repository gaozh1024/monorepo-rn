# @gaozh1024/rn-kit 0.4.18 Release Notes

`0.4.18` 是一次小型补丁发布，主要为 `AppHeader` 补齐自定义标题节点入口，解决品牌标题、带图标标题、搜索框标题等场景只能退回自写 Header 的问题。

## 本次更新

### 1. `AppHeader` 支持自定义标题节点

`AppHeader` 新增以下 prop：

- `titleNode`

现在可以直接替换中间标题区，而不需要绕过类型系统把自定义内容塞进 `title`。

例如：

```tsx
<AppHeader
  leftIcon="arrow-back"
  titleNode={
    <AppView row items="center" gap={2}>
      <Icon name="sparkles" size={18} color="#f59e0b" />
      <AppText weight="semibold">品牌标题</AppText>
    </AppView>
  }
/>
```

默认行为保持不变：

- 未传 `titleNode` 时，仍按 `title` / `subtitle` 渲染默认文本标题
- 传入 `titleNode` 时，会直接替换默认文本标题区
- `collapsibleMotion.titleStyle` 仍会作用在标题包裹层上

### 2. 补充标题节点回归测试

新增 `AppHeader` 自定义标题节点测试，覆盖：

- `titleNode` 可以被正确渲染
- 传入 `titleNode` 时，默认 `title` / `subtitle` 不会重复出现

确保新增插槽不会破坏现有文本标题路径。

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

- `@gaozh1024/rn-kit`：`0.4.18`
