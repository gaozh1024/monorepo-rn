# @gaozh1024/expo-starter 0.2.16 Release Notes

`0.2.16` 是配套 `@gaozh1024/rn-kit 0.5.0` 的模板文档与 recipe 更新版本。

## 本次更新

### 1. 升级 rn-kit 依赖范围

模板依赖升级为：

```json
"@gaozh1024/rn-kit": "^0.5.0"
```

用于接入 `SegmentedTabs` 等 `rn-kit 0.5.0` 组件能力。

### 2. 新增 `SegmentedTabs` recipe

新增参考文件：

- `src/recipes/segmented-tabs.tsx`

该 recipe 展示页面内状态筛选 / 分类切换场景下如何使用 `SegmentedTabs`，并明确它适合本地筛选，不替代 `TabNavigator` 的路由切换能力。

## 发布前验证

已验证：

- `pnpm --dir templates/expo-starter lint`
- `pnpm verify:release`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `templates/expo-starter` 下执行）

## 配套版本

- `@gaozh1024/expo-starter`：`0.2.16`
- `@gaozh1024/rn-kit`：`^0.5.0`
