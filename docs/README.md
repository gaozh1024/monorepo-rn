# 📚 Panther Expo Framework 文档

## 📦 包文档

| 包                | 描述       | 链接                                      |
| ----------------- | ---------- | ----------------------------------------- |
| @gaozh1024/rn-kit | 统一框架包 | [README](../packages/framework/README.md) |

---

## 📖 文档导航

### 01-入门指南

必看的基础配置说明：

- [Tailwind CSS 配置指南](./01-入门指南/TailwindCSS配置指南.md) ⚠️ **必看：框架样式配置说明**
  - 如果 `AppHeader` / `AppView` / `AppButton` 没样式，先看这篇

### 02-架构设计

框架架构相关的设计文档：

- [公共 API 清单](./02-架构设计/公共API清单.md) - 框架所有稳定 API 的详细说明
- [单包边界说明](./02-架构设计/单包边界说明.md) - 单包内部模块边界和依赖规则
- [单包验证策略](./02-架构设计/单包验证策略.md) - 验证方法和拆包触发条件
- [三方库导出策略](./02-架构设计/三方库导出策略.md) - 第三方库二次导出的决策依据

### 03-项目模板

项目模板相关文档：

- [项目模版蓝图](./03-项目模板/项目模板蓝图.md) - 基于框架启动真实业务 App 的项目结构
- [API 错误处理指南](./03-项目模板/API错误处理指南.md) - 全局错误监听和业务域 API 的推荐写法

### 04-开发规范

开发规范和维护说明：

- [测试基础设施说明](./04-开发规范/测试基础设施说明.md) - 测试架构和编写规范

### 05-发布说明

版本发布记录：

- [rn-kit 0.3.1 Release Notes](./release-notes/0.3.1.md)
- [rn-kit 0.3.0 Release Notes](./release-notes/0.3.0.md)
- [rn-kit 0.2.0 Release Notes](./release-notes/0.2.0.md)

---

## 🚀 其他指南

- [初始化指南](../SETUP.md)
- [发布指南](../PUBLISH.md)
- [Ignore 配置指南](../IGNORE_GUIDE.md)

---

## 📊 功能清单

### ✅ UI 组件

- [x] 原子组件: AppView, AppText, AppPressable, AppInput
- [x] 布局组件: Row, Col, Center
- [x] 反馈组件: Toast, Alert, Loading, Progress
- [x] 数据展示: Card, Icon, AppImage, AppList, GradientView, PageDrawer
- [x] 表单组件: Checkbox, Radio, Switch, Select, DatePicker
- [x] 组合组件: AppButton

### ✅ Hooks

- [x] UI Hooks: useToggle, usePageDrawer, useDebounce, useThrottle, useKeyboard, useDimensions, useOrientation
- [x] Core Hooks: useAsyncState, useRequest, usePagination, useRefresh, useInfinite, useStorage, usePrevious, useSetState, useMemoizedFn, useUpdateEffect

### ✅ 导航

- [x] NavigationProvider
- [x] StackNavigator
- [x] TabNavigator
- [x] DrawerNavigator
- [x] AppHeader, BottomTabBar, DrawerContent, PageDrawer

### ✅ 其他

- [x] 主题系统: createTheme, ThemeProvider, useTheme
- [x] API 工厂: createAPI
- [x] 错误处理: ErrorCode, AppError, useAsyncState
- [x] 存储: storage, MemoryStorage
