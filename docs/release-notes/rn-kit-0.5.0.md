# @gaozh1024/rn-kit 0.5.0 Release Notes

`0.5.0` 是一次组件能力增强版本，新增页面内使用的滑块式 Tab/Menu 切换组件 `SegmentedTabs`。

## 本次更新

### 1. 新增 `SegmentedTabs`

`SegmentedTabs` 适合页面内分类、状态筛选、顶部 menu 等非路由切换场景。它会在点击选项后移动底层 `Animated.View`，形成左右滑动的选中块效果。

```tsx
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '已完成', value: 'done' },
];

<SegmentedTabs
  options={tabs}
  value={status}
  onChange={nextStatus => setStatus(nextStatus)}
  indicatorColor="#f38b32"
  backgroundColor="#f3f4f6"
  style={{ width: 280 }}
/>;
```

### 2. 支持完整样式与渲染扩展

新增组件支持：

- 受控 / 非受控：`value`、`defaultValue`、`onChange`
- 尺寸：`size="sm" | "md" | "lg"`
- 滑块样式：`indicatorColor`、`indicatorInset`、`indicatorStyle`、`indicatorClassName`
- 选项样式：`itemStyle`、`activeItemStyle`、`itemClassName`、`activeItemClassName`
- 标签样式：`labelStyle`、`activeLabelStyle`、`disabledLabelStyle`
- 自定义渲染：`renderLabel`、`renderItem`
- 禁用：整组 `disabled` 或单个 option 的 `disabled`

### 3. 接入 rn-kit motion 配置

`SegmentedTabs` 支持已有 motion 参数：

- `animated`
- `motionDuration`
- `motionSpringPreset`
- `motionReduceMotion`

未传 `motionSpringPreset` 时使用 timing 动画；传入 `snappy` / `smooth` / `bouncy` 时使用 spring 动画。

### 4. 文档与 AI recipe 同步

本次同步补充：

- README 组件表、Props 表和示例
- `AI_USAGE.md` 使用建议与常见问题
- `ai-manifest.json` stable API 与 canonical example
- expo-starter recipe：`src/recipes/segmented-tabs.tsx`

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit exec tsc --noEmit`
- `pnpm --dir packages/rn-kit exec vitest run src/ui/__tests__/display/SegmentedTabs.test.tsx`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit run build`
- `pnpm --dir templates/expo-starter lint`
- `pnpm verify:release`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `packages/rn-kit` 下执行）

## 配套版本

- `@gaozh1024/rn-kit`：`0.5.0`
- `@gaozh1024/expo-starter`：推荐配套 `0.2.16`，模板依赖 `@gaozh1024/rn-kit ^0.5.0`
