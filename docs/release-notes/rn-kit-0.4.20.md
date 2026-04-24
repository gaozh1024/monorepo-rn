# @gaozh1024/rn-kit 0.4.20 Release Notes

`0.4.20` 是一次导航回归修复补丁，主要修复 `0.4.19` 中 `StackNavigator.Screen` 包装后触发的 React Navigation 运行时报错。

## 本次更新

### 1. 修复 `StackNavigator.Screen` direct children 回归

`0.4.19` 为了解决 `animation: 'fade'` 被默认右滑覆盖的问题，引入了一个自定义 `StackScreen` 包装组件，并把：

```tsx
StackNavigator.Screen = StackScreen;
```

改成了包装后的实现。

这会触发 React Navigation 的 direct children 约束，运行时可能报错：

```txt
A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children
```

`0.4.20` 已恢复为原生实现：

```tsx
StackNavigator.Screen = NativeStack.Screen;
```

避免再触发 direct children 校验问题。

### 2. 保留 `0.4.19` 的动画覆盖修复

本次修复不会把 `0.4.19` 中的动画问题打回。

`StackNavigator` 仍然通过 navigator 级 `screenOptions` 提供默认：

- `headerShown: false`
- `animation: 'slide_from_right'`

因此页面级配置仍可正常覆盖，例如：

```tsx
<StackNavigator.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />
```

### 3. 补强测试，覆盖 direct children 约束

导航测试 mock 已补上 direct children 校验，确保以后如果再次把 `Screen` 包装成自定义组件，测试会直接失败。

## 发布前验证

已验证：

- `pnpm --dir packages/rn-kit test -- src/navigation/__tests__/navigators.test.tsx`
- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit build`
- `pnpm verify:release`
- `pnpm --dir packages/rn-kit pack --pack-destination /tmp/rn-kit-pack-0420`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.20`
