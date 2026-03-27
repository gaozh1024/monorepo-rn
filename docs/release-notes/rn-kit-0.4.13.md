# @gaozh1024/rn-kit 0.4.13 Release Notes

`0.4.13` 延续动画与导航体验完善，补齐了聊天输入区键盘避让、导航默认指示条策略，以及 `AppHeader` 背景色覆盖能力。

## 本次更新

### 1. 新增高级布局动画预设

新增统一布局动画封装：

- `motionLayoutPreset`
- `motionLayoutDuration`
- `motionLayoutDelay`
- `motionLayoutSpring`

当前可选预设：

- `fade`
- `fade-up`
- `fade-down`
- `slide-left`
- `slide-right`
- `zoom-fade`
- `list-item`
- `list-reorder`
- `accordion`
- `dialog`

已接入：

- `Presence`
- `MotionView`
- `StaggerItem`
- `AppList`

### 2. 补齐 spring 动画抽象

新增统一 spring 预设：

- `motionSpringPreset="snappy" | "smooth" | "bouncy"`

已接入：

- `Progress`
- `Switch`
- `Checkbox`
- `Radio`

未传 `motionSpringPreset` 时，组件仍默认沿用 timing 动画，保持向后兼容。

### 3. Motion helper 导出补充

新增/补充：

- `resolveMotionLayoutPreset`
- `withSpring`

便于业务侧直接复用框架内的高级 motion 预设。

### 4. 文档同步

- README 补充高级布局动画预设说明
- README 补充 spring 动画参数说明
- README 补充 `KeyboardInsetView` 用法

### 5. 新增 `KeyboardInsetView`

新增页面级键盘避让容器：

- `KeyboardInsetView`

适合：

- 聊天输入栏
- 评论输入栏
- 底部回复框

默认支持：

- 跟随键盘高度追加底部 inset
- 自动兼容底部安全区
- `keyboardOffset` 微调

### 6. 导航激活指示条默认关闭，并支持显式开启

这次调整了导航组件的默认行为：

- `BottomTabBar` 默认不再显示选中态横条指示器
- `DrawerContent` 默认不再显示当前项指示条

同时 `TabNavigator.tabBarOptions` 新增支持：

- `showActiveIndicator`
- `indicatorColor`
- `indicatorHeight`

如需开启：

- `BottomTabBar` 可直接在 `tabBarOptions` 中显式配置
- `DrawerContent` 可直接传入 `showActiveIndicator`

### 7. 修复 `AppHeader` 背景色覆盖问题

现在 `AppHeader` 会正确读取 `style.backgroundColor` 作为背景色来源。

也就是说，下面这种写法已经可以直接生效：

```tsx
<AppHeader title="消息" leftIcon={null} style={{ backgroundColor: '#f00' }} />
```

## 发布前验证

已验证：

- `pnpm --filter @gaozh1024/rn-kit typecheck`
- `pnpm --filter @gaozh1024/rn-kit test`
- `pnpm --filter @gaozh1024/rn-kit build`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.13`
