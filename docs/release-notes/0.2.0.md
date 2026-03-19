# @gaozh1024/rn-kit 0.2.0 Release Notes

发布日期：2026-03-19

## 概览

`0.2.0` 是一次面向“可落地使用”的版本升级，重点补强了：

- 应用初始化体验
- 主题与状态栏联动
- 导航默认底栏体验
- 表单组件可用性与测试覆盖
- 对外公开 API 与文档完整度

## Highlights

### 1. 推荐使用 `AppProvider`

`AppProvider` 现在作为推荐入口更加明确，默认整合：

- `SafeAreaProvider`
- `ThemeProvider`
- `NavigationProvider`
- `OverlayProvider`
- `AppStatusBar`

这意味着大多数业务 App 可以直接从统一 Provider 启动，并获得更一致的主题、导航和全局 UI 体验。

### 2. 新增/强化 `AppStatusBar`

状态栏能力在 `0.2.0` 中被明确纳入公共能力：

- 默认可随主题切换自动更新 `barStyle`
- 支持页面级覆盖
- 更适合登录页、沉浸式页面、品牌色全屏页等场景

### 3. `TabNavigator` 默认使用内置 `BottomTabBar`

导航默认体验更完整：

- 未传 `tabBar` 时，默认使用框架内置 `BottomTabBar`
- 默认高度为 `65`
- `tabBarOptions` 支持更完整的自定义能力

## 新增与改进

### 主题系统

- 导出 `useThemeColors`
- 导出 `getThemeColors`
- 补充主题 token 相关测试与文档说明

### UI / 容器

- 新增 `AppScrollView` 公开导出
- 文档中补充 `AppProvider`、`AppStatusBar`、`AppScrollView` 的推荐用法

### 表单模块

补齐以下模块的测试：

- `AppInput`
- `CheckboxGroup`
- `RadioGroup`
- `Switch`
- `Select`
- `DatePicker`
- `Slider`
- `FormItem`
- `useForm`

同时完成两项内部整理：

- 提取 group 相关通用逻辑
- 重构 `useForm` 校验流程，改为基于 `safeParseAsync`

收益：

- 逻辑更稳定
- 类型更清晰
- 对 `zod` schema 内部结构的依赖更少

## 质量状态

在 `0.2.0` 发布前，已完成以下检查：

- Typecheck：通过
- 全量测试：通过（211/211）
- Build：通过

## 升级建议

如果你正在从 `0.1.x` 升级到 `0.2.0`，建议优先关注：

1. 根组件是否切换为 `AppProvider`
2. 是否使用 `AppStatusBar` 管理页面级状态栏
3. `TabNavigator` 是否需要覆写默认 `BottomTabBar`
4. 消费端是否已正确配置 NativeWind / Tailwind 扫描范围

## 已知说明

当前测试仍会输出 `react-test-renderer is deprecated` 警告，但不影响：

- 类型检查
- 测试通过
- 构建产物
- 版本发布

后续版本可继续逐步收敛测试基础设施，以减少测试日志噪音。
