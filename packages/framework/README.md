# @gaozh1024/rn-kit

> Panther Expo Framework - All-in-one React Native framework

一个集成的 React Native 开发框架，包含主题系统、UI 组件、API 工厂和导航组件。

## 📦 安装

```bash
npm install @gaozh1024/rn-kit
# 或
pnpm add @gaozh1024/rn-kit
# 或
yarn add @gaozh1024/rn-kit
```

### 前置依赖

```bash
npm install react react-native
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-svg
```

## 🚀 快速开始

```tsx
import {
  ThemeProvider,
  createTheme,
  AppView,
  AppText,
  AppButton,
  useToggle,
} from '@gaozh1024/rn-kit';

const theme = createTheme({
  colors: {
    primary: '#f38b32',
  },
});

function App() {
  const [visible, { toggle }] = useToggle(false);

  return (
    <ThemeProvider light={theme}>
      <AppView flex p={4}>
        <AppText size="xl">Hello Panther!</AppText>
        <AppButton onPress={toggle}>{visible ? '隐藏' : '显示'}</AppButton>
      </AppView>
    </ThemeProvider>
  );
}
```

## 📚 API 概览

### 🎨 主题系统

```tsx
import { ThemeProvider, createTheme, useTheme } from '@gaozh1024/rn-kit';
```

### 🧩 UI 组件

```tsx
import {
  AppView,
  AppText,
  AppPressable,
  AppInput, // 原子组件
  Row,
  Col,
  Center, // 布局
  AppButton, // 组合组件
  Toast,
  Alert,
  Loading,
  Progress, // 反馈
  Card,
  Icon,
  AppImage,
  AppList, // 数据展示
  Checkbox,
  Radio,
  Switch,
  Select,
  DatePicker, // 表单
} from '@gaozh1024/rn-kit';
```

### 🪝 Hooks

```tsx
import {
  // UI Hooks
  useToggle,
  useDebounce,
  useThrottle,
  useKeyboard,
  useDimensions,
  useOrientation,
  // Core Hooks
  useAsyncState,
  useRequest,
  usePagination,
  useRefresh,
  useInfinite,
  useStorage,
} from '@gaozh1024/rn-kit';
```

### 🧭 导航

```tsx
import {
  NavigationProvider,
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  useNavigation,
  useRoute,
} from '@gaozh1024/rn-kit';
```

### 🔌 API 工厂

```tsx
import { createAPI, z, storage, ErrorCode } from '@gaozh1024/rn-kit';

const api = createAPI({
  baseURL: 'https://api.example.com',
  endpoints: {
    getUser: {
      method: 'GET',
      path: '/users/:id',
    },
  },
});
```

## 📄 文档

- [框架文档](../../docs/README.md) - 完整文档索引
- [设计文档](../../docs/design/) - 架构设计文档

## 📄 许可证

MIT
