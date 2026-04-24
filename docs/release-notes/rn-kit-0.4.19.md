# @gaozh1024/rn-kit 0.4.19 Release Notes

`0.4.19` 是一次导航修复补丁，主要修正 `StackNavigator` 默认转场与页面级 `animation` 配置之间的覆盖关系。

## 本次更新

### 1. 修复 `StackNavigator.Screen` 的 `animation` 覆盖默认右滑失效问题

此前 `StackNavigator` 默认展开了 `TransitionPresets.SlideFromRightIOS`，会把
`cardStyleInterpolator` 一并写入 navigator 级默认配置。这样即使页面显式设置：

```tsx
<StackNavigator.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />
```

页面进入时仍可能表现为右侧滑入，而不是 fade。

现在默认转场改为更轻量的 `animation: 'slide_from_right'`，不再预先固定
`cardStyleInterpolator`。页面级 `animation`、`presentation`、
`cardStyleInterpolator` 等配置可以按预期覆盖默认值。

### 2. 放宽 `StackScreenOptions` 类型，完整透传 React Navigation 转场配置

`rn-kit` 现在直接复用 `@react-navigation/stack` 的官方 `StackNavigationOptions`
类型，避免把 `cardStyleInterpolator`、`transitionSpec` 等能力裁掉。

同时，`StackNavigatorProps.screenOptions` 也支持对象或函数两种写法，与 React Navigation 的原生习惯保持一致。

### 3. 补充导航回归测试

新增测试覆盖：

- `StackNavigator` 默认应使用 `slide_from_right` 动画，而不是固定插值器
- `StackNavigator.Screen` 的 `options={{ animation: 'fade' }}` 能正确覆盖默认右滑

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit test -- src/navigation/__tests__/navigators.test.tsx`
- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit build`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.19`
