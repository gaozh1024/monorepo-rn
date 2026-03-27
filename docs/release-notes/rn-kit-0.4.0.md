# @gaozh1024/rn-kit 0.4.0 Release Notes

`0.4.0` 是一版以“组件交互修复 + 开发态可观测性”为核心的增强发布。除了集中修复表单、弹层、反馈类组件的一致性问题，这一版还补上了开发期日志、错误边界与 API 自动打点能力，方便在 App 内直接排查问题。

## 重点更新

### 1. 表单与选择器交互统一

- 修复 `Switch`：
  - 选中态圆点边距不一致
  - 增加切换动画
  - 动画期间禁止重复点击
  - 修复禁用态圆点半透明导致下层内容透出
- 修复 `Checkbox` 选中后对号不居中
- 修复 `Slider` 首次触摸显示 `NaN`、无法拖动的问题
- 调整 `Select` / `DatePicker` / `Picker` 的底部弹层样式与动画，统一为：
  - 遮罩淡入淡出
  - 面板自底部进入/退出
  - 点击遮罩关闭
- `DatePicker` 改为更通用的多列滚轮选择体验，可复用于日期、省市区等场景
- 新增通用 `Picker` 组件，承接多列数据选择能力

### 2. 输入体验与键盘交互增强

- 新增 `KeyboardDismissView`
- `AppScreen` / `AppScrollView` 支持点击空白区域收起键盘
- `AppButton` 新增点击前自动收起键盘能力，默认开启，可关闭
- 模板页已同步接入，减少表单页焦点残留问题

### 3. 反馈类组件体验修复

- 修复 `Toast`：
  - `success` / `error` / `warning` 具备默认颜色与展示效果
- 修复 `Alert`：
  - 弹出时增加内部动画，不再依赖原生 `Modal` 默认动画
- 增强 `Loading`：
  - 支持最短显示时长，避免闪烁
  - 支持并发显示保护
  - 持续显示超过 30 秒后出现关闭按钮

### 4. 开发态可观测性基础设施

- 新增 `logger` 基础设施：
  - `LoggerProvider`
  - `useLogger(namespace?)`
  - `LogOverlay`
- 日志面板支持：
  - level 筛选
  - namespace 筛选
  - 搜索
  - 导出当前筛选结果
- 新增 `AppErrorBoundary`，开发环境默认可启用
- `createAPI` 新增 observability：
  - `request`
  - `response`
  - `error`
- 支持通过全局 logger 将 API 请求链路自动打到日志面板中

### 5. 示例与兼容性修复

- 修复 `AppList` 某些示例场景下的列表重建问题
- 修复示例页中 `Functions are not valid as a React child` 一类调用错误
- 规避 `PageDrawer` 相关示例页的 Hook 调用异常用法
- 补充大批回归测试，覆盖新增交互与可观测性行为

## 验证结果

本次发布前已完成：

- `pnpm --dir packages/rn-kit typecheck`
- `pnpm --dir packages/rn-kit test`
- `pnpm --dir packages/rn-kit build`
- `pnpm --dir templates/expo-starter lint`
- `npm_config_cache=/tmp/npm-cache npm pack --dry-run`（framework / expo-starter）

## 已知非阻塞项

当前没有发现阻塞发布的问题，但测试环境仍有两类告警值得后续继续清理：

- `react-test-renderer` 在 React 19 下的弃用告警
- 个别测试 mock 的 `vi.fn()` 实现方式会输出警告

这两项目前不影响框架构建、类型检查、打包和功能发布。

## 配套版本

- `@gaozh1024/rn-kit`：`0.4.0`
- `@gaozh1024/expo-starter`：`0.2.4`（依赖 `@gaozh1024/rn-kit@^0.4.0`）
