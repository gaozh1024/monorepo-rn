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

### ⚠️ 样式配置（必看）

本框架使用 **Tailwind CSS** 类名实现样式（如 `bg-primary-500`, `flex-1`, `p-4`），需要在你的项目中配置 **NativeWind** 才能正常显示样式。

如果你发现 `AppHeader`、`AppView`、`AppButton` 没有样式或布局错乱，通常不是框架内部渲染失败，而是消费方 app 没有把 NativeWind 和 Tailwind 扫描范围配置完整。

```bash
npm install nativewind
npm install -D tailwindcss
```

创建 `tailwind.config.js`：

```javascript
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@gaozh1024/rn-kit/dist/**/*.{js,mjs}', // 必须包含框架路径
  ],
  safelist: [
    { pattern: /^(flex)-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^(items)-(start|center|end|stretch)$/ },
    { pattern: /^(justify)-(start|center|end|between|around)$/ },
    { pattern: /^(p|px|py|gap)-(0|1|2|3|4|5|6|8|10|12)$/ },
    { pattern: /^(rounded)-(none|sm|md|lg|xl|2xl|full)$/ },
    {
      pattern: /^(bg|text)-(primary|secondary|success|warning|error|info|gray|white|black)(-.+)?$/,
    },
  ],
  theme: { extend: {} },
  plugins: [],
};
```

修改 `babel.config.js`：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
```

📖 [查看完整 Tailwind 配置指南](./TAILWIND_SETUP.md)

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

## 📄 许可证

MIT
