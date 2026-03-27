# @gaozh1024/rn-kit 0.4.4 Release Notes

`0.4.4` 是一次容器布局能力统一与发布前收口版本，主要解决基础容器快捷参数不一致、`Center` 默认撑开导致尺寸难控等问题。

## 本次更新

### 1. 统一基础容器快捷参数

以下组件已统一支持一套容器快捷参数：

- `AppView`
- `Row`
- `Col`
- `Center`
- `AppScrollView`
- `Card`
- `SafeScreen` / `AppScreen`

支持范围包括：

- 布局：`flex` / `row` / `wrap` / `center` / `between` / `items` / `justify`
- 间距：`p px py pt pb pl pr m mx my mt mb ml mr gap`
- 尺寸：`w h minW minH maxW maxH`
- 外观：`rounded`
- 背景：`bg` / `surface`

### 2. 快捷参数改为框架直接转 style

- 上述容器快捷参数现在主要由框架直接转换为 React Native `style`
- 不再依赖这些参数对应的 Tailwind safelist
- 容器行为更稳定，也更容易在测试中验证

### 3. 修正 `Center` 默认行为

- `Center` 不再默认 `flex: 1`
- 现在默认只负责居中，不会自动撑满剩余空间
- 需要铺满时请显式传入 `flex`

这项修正主要解决类似下面这种场景里，宽高被默认 flex 干扰的问题：

```tsx
<Center style={{ width: 36, height: 36 }} />
```

### 4. 文档更新

- `README.md` 新增容器快捷参数支持矩阵
- `TAILWIND_SETUP.md` 更新 safelist 说明
- 明确区分：
  - 哪些能力仍依赖 NativeWind `className`
  - 哪些快捷参数已由框架直接处理

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit build`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（在 `packages/rn-kit` 目录）

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.4`
- `@gaozh1024/expo-starter`：`0.2.9`（依赖 `@gaozh1024/rn-kit@^0.4.4`）
