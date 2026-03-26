# @gaozh1024/rn-kit

## 0.4.13

### Patch Changes

- 补齐高级动画能力封装：
  - 新增高级布局动画预设：`motionLayoutPreset`、`motionLayoutDuration`、`motionLayoutDelay`、`motionLayoutSpring`
  - 新增 spring 动画参数：`motionSpringPreset`
  - `Presence`、`MotionView`、`StaggerItem`、`AppList` 接入高级布局动画预设
  - `Progress`、`Switch`、`Checkbox`、`Radio` 接入 spring 动画预设
  - 补充 `resolveMotionLayoutPreset` 与 `withSpring` 导出
  - 新增 `KeyboardInsetView`，用于底部输入栏 / 聊天输入框键盘避让
  - `BottomTabBar` 与 `DrawerContent` 默认关闭激活指示条，并支持显式开启
  - 修复 `AppHeader` 无法通过 `style.backgroundColor` 覆盖背景色的问题
  - 同步 README 与 release notes
