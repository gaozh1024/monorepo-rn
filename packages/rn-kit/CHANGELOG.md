# @gaozh1024/rn-kit

## 0.4.15

### Patch Changes

- 补齐高级动画能力封装：
  - 新增高级布局动画预设：`motionLayoutPreset`、`motionLayoutDuration`、`motionLayoutDelay`、`motionLayoutSpring`
  - 新增 spring 动画参数：`motionSpringPreset`
  - `Presence`、`MotionView`、`StaggerItem`、`AppList` 接入高级布局动画预设
  - `Progress`、`Switch`、`Checkbox`、`Radio` 接入 spring 动画预设
  - 补充 `resolveMotionLayoutPreset`、`withSpring`、`withRepeat` 以及常用 reanimated hooks 导出
  - `BottomSheetModal`、`PageDrawer`、`Select`、`Picker`、`DatePicker` 新增 `motionOpenDuration` / `motionCloseDuration`
  - `BottomSheetModal` / `PageDrawer` 拖拽关闭运行时切换到 `react-native-gesture-handler` + reanimated
  - `AppList` 拆分 `motionReduceMotion` 与 `staggerReduceMotion` 语义，避免互相干扰
  - `Switch` 交互锁定时长改为跟随 motion 配置，不再固定写死 `220ms`
  - 新增 `CollapseView`，用于真实高度折叠 / 展开动画
  - 新增 `KeyboardInsetView`，用于底部输入栏 / 聊天输入框键盘避让
  - `BottomTabBar` 与 `DrawerContent` 默认关闭激活指示条，并支持显式开启
  - 修复 `AppHeader` 无法通过 `style.backgroundColor` 覆盖背景色的问题
  - 同步 README 与 release notes
