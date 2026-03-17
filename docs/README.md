# 📚 Panther Expo Framework 文档

## 📦 包文档

| 包                | 描述       | 链接                                      |
| ----------------- | ---------- | ----------------------------------------- |
| @gaozh1024/rn-kit | 统一框架包 | [README](../packages/framework/README.md) |

## 🚀 指南

- [初始化指南](../SETUP.md)
- [发布指南](../PUBLISH.md)
- [Ignore 配置指南](../IGNORE_GUIDE.md)

## 📊 功能清单

### ✅ UI 组件

- [x] 原子组件: AppView, AppText, AppPressable, AppInput
- [x] 布局组件: Row, Col, Center
- [x] 反馈组件: Toast, Alert, Loading, Progress
- [x] 数据展示: Card, Icon, AppImage, AppList
- [x] 表单组件: Checkbox, Radio, Switch, Select, DatePicker
- [x] 组合组件: AppButton

### ✅ Hooks

- [x] UI Hooks: useToggle, useDebounce, useThrottle, useKeyboard, useDimensions, useOrientation
- [x] Core Hooks: useAsyncState, useRequest, usePagination, useRefresh, useInfinite, useStorage, usePrevious, useSetState, useMemoizedFn, useUpdateEffect

### ✅ 导航

- [x] NavigationProvider
- [x] StackNavigator
- [x] TabNavigator
- [x] DrawerNavigator
- [x] AppHeader, BottomTabBar, DrawerContent

### ✅ 其他

- [x] 主题系统: createTheme, ThemeProvider, useTheme
- [x] API 工厂: createAPI
- [x] 错误处理: ErrorCode, AppError, useAsyncState
- [x] 存储: storage, MemoryStorage
