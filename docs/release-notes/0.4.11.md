# @gaozh1024/rn-kit 0.4.11 Release Notes

`0.4.11` 是一次动画能力增强发布，重点补齐了高级布局动画封装与 spring 动画抽象。

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

## 发布前验证

已验证：

- `pnpm --filter @gaozh1024/rn-kit typecheck`
- `pnpm --filter @gaozh1024/rn-kit test`
- `pnpm --filter @gaozh1024/rn-kit build`

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.11`
