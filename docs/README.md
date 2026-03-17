# 📚 Panther Expo Framework 文档

## 📦 包文档

| 包                | 描述       | 链接                                      |
| ----------------- | ---------- | ----------------------------------------- |
| @gaozh1024/rn-kit | 统一框架包 | [README](../packages/framework/README.md) |

## 🚀 指南

- [初始化指南](../SETUP.md)
- [发布指南](../PUBLISH.md)
- [Ignore 配置指南](../IGNORE_GUIDE.md)

## 📖 设计文档

| 文档                                                         | 描述                           | 状态      |
| ------------------------------------------------------------ | ------------------------------ | --------- |
| [01-navigation-package](./design/01-navigation-package.md)   | 导航包设计（Stack/Tab/Drawer） | ✅ 已完成 |
| [02-icon-component](./design/02-icon-component.md)           | Icon 组件设计                  | ✅ 已完成 |
| [03-app-image-component](./design/03-app-image-component.md) | AppImage 组件设计              | ✅ 已完成 |
| [04-app-list-component](./design/04-app-list-component.md)   | AppList 组件设计               | ✅ 已完成 |
| [05-core-hooks](./design/05-core-hooks.md)                   | 核心 Hooks 设计                | ✅ 已完成 |
| [06-form-components](./design/06-form-components.md)         | 表单组件设计                   | ✅ 已完成 |

## 📊 功能状态总览

### ✅ 已完成

#### UI 组件

- [x] 原子组件: AppView, AppText, AppPressable, AppInput
- [x] 布局组件: Row, Col, Center
- [x] 反馈组件: Toast, Alert, Loading, Progress
- [x] 数据展示: Card, Icon, AppImage, AppList
- [x] 表单组件: Checkbox, Radio, Switch, Select, DatePicker
- [x] 组合组件: AppButton

#### Hooks

- [x] UI Hooks: useToggle, useDebounce, useThrottle, useKeyboard, useDimensions, useOrientation
- [x] Core Hooks: useAsyncState, useRequest, usePagination, useRefresh, useInfinite, useStorage, usePrevious, useSetState, useMemoizedFn, useUpdateEffect

#### 导航

- [x] NavigationProvider
- [x] StackNavigator
- [x] TabNavigator
- [x] DrawerNavigator
- [x] AppHeader, BottomTabBar, DrawerContent

#### 其他

- [x] 主题系统: createTheme, ThemeProvider, useTheme
- [x] API 工厂: createAPI
- [x] 错误处理: ErrorCode, AppError, useAsyncState
- [x] 存储: storage, MemoryStorage
