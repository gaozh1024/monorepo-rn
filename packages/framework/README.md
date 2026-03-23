# @gaozh1024/rn-kit

> Panther Expo Framework - All-in-one React Native framework

一个集成的 React Native 开发框架，包含主题系统、UI 组件、API 工厂和导航组件。

## ✅ 推荐初始化方式

业务 App 推荐优先使用 `AppProvider`，而不是只手动包一层 `ThemeProvider`。

`AppProvider` 默认会整合：

- `SafeAreaProvider`
- `ThemeProvider`
- `NavigationProvider`
- `OverlayProvider`
- `AppStatusBar`

另外在**开发环境**下，`AppProvider` 默认会启用一套轻量的开发日志基础设施：

- `LoggerProvider`
- CLI 彩色日志输出
- App 内 `LogOverlay` 浮层
- `AppErrorBoundary` React 渲染错误兜底

这样页面切换、主题切换时，状态栏会自动跟随全局主题变化。

## 📦 安装

```bash
npm install @gaozh1024/rn-kit
# 或
pnpm add @gaozh1024/rn-kit
# 或
yarn add @gaozh1024/rn-kit
```

### 前置依赖

#### Expo 项目（推荐）

如果你使用的是 Expo，请优先使用 `expo install`，让 Expo 按当前 SDK 自动选择兼容版本：

```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @expo/vector-icons expo-linear-gradient
npm install react-native-svg
```

如果你的项目是 **Expo SDK 54 / React Native 0.81**，还需要：

```bash
npx expo install react-native-worklets
```

> 注意：**Expo SDK 54 对应的是 React Native 0.81，不是 0.79。**
> 如果你的项目是 React Native 0.79，通常对应 Expo SDK 53 一档，请不要直接按 SDK 54 的版本理解依赖关系。

#### 非 Expo / 手动安装

```bash
npm install react react-native
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install @expo/vector-icons expo-linear-gradient
npm install react-native-svg
```

#### 当前兼容性范围

`0.4.3` 当前将 peerDependencies 收紧到以下范围，避免 npm 解析到和当前 RN 不兼容的过高版本：

- `expo`: `>=53 <55`
- `react-native`: `>=0.79 <0.82`
- `react-native-reanimated`: `>=3.17.0 <4.2.0`
- `react-native-worklets`: `>=0.5.0 <0.6.0`（可选）

如果你在 Expo 项目中安装依赖，建议顺序是：

```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @expo/vector-icons expo-linear-gradient
npx expo install react-native-worklets
npm install @gaozh1024/rn-kit
```

如果你是 Expo SDK 53 / RN 0.79 项目，通常不需要单独安装 `react-native-worklets`，以 `expo install` 给出的结果为准。

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
    'flex-wrap',
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
import { AppProvider, AppView, AppText, AppButton, useToggle } from '@gaozh1024/rn-kit';

function App() {
  const [visible, { toggle }] = useToggle(false);

  return (
    <AppProvider>
      <AppView flex p={4}>
        <AppText size="xl">Hello Panther!</AppText>
        <AppButton onPress={toggle}>{visible ? '隐藏' : '显示'}</AppButton>
      </AppView>
    </AppProvider>
  );
}
```

如果你只需要最小主题能力，也可以单独使用：

```tsx
import { ThemeProvider, createTheme } from '@gaozh1024/rn-kit';

const theme = createTheme({
  colors: {
    primary: '#f38b32',
  },
});
```

## 📚 API 概览

### 🎨 主题系统

```tsx
import { ThemeProvider, createTheme, useTheme } from '@gaozh1024/rn-kit';
```

### 🧱 应用初始化与状态栏

```tsx
import { AppProvider, AppStatusBar } from '@gaozh1024/rn-kit';
```

受控切换主题时，推荐直接给 `AppProvider` / `ThemeProvider` 传 `isDark`，不要再通过重建根组件强制刷新：

```tsx
<AppProvider lightTheme={lightTheme} darkTheme={darkTheme} isDark={themeMode === 'dark'}>
  <RootNavigator />
</AppProvider>
```

### 🧩 UI 组件

```tsx
import {
  AppView,
  AppScrollView,
  AppText,
  AppPressable,
  KeyboardDismissView,
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
  AppList,
  GradientView,
  PageDrawer, // 数据展示 / 页面级抽屉
  Checkbox,
  Radio,
  Switch,
  Select,
  Picker,
  DatePicker, // 表单
} from '@gaozh1024/rn-kit';
```

#### 布局与容器约定

- 这批容器组件已统一支持一套快捷参数，优先走 React Native `style`，不再依赖这些参数对应的 Tailwind safelist：
  - 布局：`flex` / `row` / `wrap` / `center` / `between` / `items` / `justify`
  - 间距：`p` / `px` / `py` / `pt` / `pb` / `pl` / `pr` / `m` / `mx` / `my` / `mt` / `mb` / `ml` / `mr` / `gap`
  - 尺寸：`w` / `h` / `minW` / `minH` / `maxW` / `maxH`
  - 外观：`rounded`
- `SafeScreen` / `AppScreen` 同时支持：
  - `bg="primary-500"` 这类显式颜色
  - `surface="background" | "card" | "muted"` 这类语义背景
  - `dismissKeyboardOnPressOutside`：点击非输入区域时收起键盘
- `AppScrollView` 支持 `dismissKeyboardOnPressOutside`
  - 开启后会自动启用点击空白收起键盘
  - 并默认补上 `keyboardShouldPersistTaps="handled"`
- `KeyboardDismissView` 适合非页面容器、自定义布局场景下单独包裹使用

#### 容器快捷参数支持矩阵

| 组件                       | 默认行为                         | 支持快捷参数                                                                                       | 补充说明                                                   |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `AppView`                  | 基础容器                         | 布局 / 间距 / 尺寸 / `bg` / `surface` / `rounded` / `className`                                    | 通用容器基座                                               |
| `Row`                      | `row`，默认 `items="center"`     | 继承 `AppView` 全部快捷参数                                                                        | `justify` 默认 `start`                                     |
| `Col`                      | 纵向布局，默认 `items="stretch"` | 继承 `AppView` 全部快捷参数                                                                        | `justify` 默认 `start`                                     |
| `Center`                   | 强制居中，默认不撑满             | 继承 `AppView` 大部分快捷参数                                                                      | 内部固定 `center`，需要铺满时请显式传 `flex`               |
| `AppScrollView`            | 滚动容器                         | 外层支持：`flex` / 外边距 / 尺寸 / `bg` / `surface` / `rounded`；内容区支持：布局 / 内边距 / `gap` | `row` / `items` / `justify` 作用于 `contentContainerStyle` |
| `Card`                     | 卡片容器                         | 布局 / 间距 / 尺寸 / `bg` / `surface` / `rounded` / `className`                                    | 另有 `noShadow` / `noBorder` / `noRadius`                  |
| `SafeScreen` / `AppScreen` | 安全区页面容器                   | 布局 / 间距 / 尺寸 / `bg` / `surface` / `rounded` / `className`                                    | 安全区 inset 会自动并入 padding                            |

> 说明：`className` 依然走 NativeWind；上表中的快捷参数本身已经由框架直接转换为内联 `style`。

#### Button 颜色语义

`AppButton` 目前支持以下 `color`：

- `primary`
- `secondary`
- `success`
- `warning`
- `info`
- `error`
- `danger`（`error` 的兼容别名）
- `muted`

```tsx
<AppButton color="success">保存成功</AppButton>
<AppButton color="warning" variant="outline">
  继续操作
</AppButton>
<AppButton color="danger">删除</AppButton>
```

#### 键盘收起交互

`AppButton` 新增：

- `dismissKeyboardOnPress?: boolean`
- 默认值：`true`

也就是说，大多数提交/保存/登录按钮在点击前会先自动收起键盘：

```tsx
<AppButton onPress={handleSubmit}>提交</AppButton>

<AppButton dismissKeyboardOnPress={false} onPress={handleToolbarAction}>
  保持键盘
</AppButton>
```

容器侧推荐这样使用：

```tsx
<AppScreen dismissKeyboardOnPressOutside>
  <AppScrollView dismissKeyboardOnPressOutside>
    <AppInput placeholder="请输入手机号" />
    <AppInput placeholder="请输入密码" secureTextEntry />
    <AppButton onPress={handleLogin}>登录</AppButton>
  </AppScrollView>
</AppScreen>
```

如果不是整页容器，而是局部自定义布局，也可以单独使用：

```tsx
<KeyboardDismissView>
  <AppView p={4} gap={3}>
    <AppInput placeholder="搜索内容" />
    <AppButton onPress={handleSearch}>搜索</AppButton>
  </AppView>
</KeyboardDismissView>
```

#### 可本地化文案参数（i18n 推荐）

- `AppList`
  - `errorTitle`：错误标题（默认 `加载失败`）
  - `errorDescription`：错误描述兜底（默认 `请检查网络后重试`）
  - `retryText`：重试按钮文案（默认 `重新加载`）
- `Select`
  - `singleSelectTitle` / `multipleSelectTitle`：弹窗标题
  - `searchPlaceholder`：搜索占位文案
  - `emptyText`：空状态文案
  - `selectedCountText`：多选计数模板，支持 `{{count}}`
  - `confirmText`：多选确认按钮文案
- `Picker`
  - `pickerTitle` / `cancelText` / `confirmText`：弹窗文案
  - `renderDisplayText`：自定义触发区展示文本
  - `renderFooter`：自定义底部区域，适合扩展省市区、级联选择等场景
- `DatePicker`
  - `cancelText` / `confirmText`：弹窗操作按钮文案
  - `pickerTitle`：弹窗标题文案
  - `yearLabel` / `monthLabel` / `dayLabel`：列标题文案
  - `todayText` / `minDateText` / `maxDateText`：快捷按钮文案

#### 表单与反馈 Hook 当前 API

```tsx
import { useForm, useToast, useLoading, useAlert, useLogger } from '@gaozh1024/rn-kit';

const form = useForm({
  schema,
  defaultValues: { name: '' },
});

form.values;
form.errors;
form.setValue('name', 'Panther');
await form.validate();
await form.validateField('name');
await form.handleSubmit(async values => {
  console.log(values);
});

const toast = useToast();
toast.show('已保存', 'success', 2000);
toast.success('成功');

const loading = useLoading();
loading.show('加载中...');
loading.hide();

const alert = useAlert();
alert.alert({ title: '提示', message: '操作完成' });
alert.confirm({ title: '确认删除', message: '删除后不可恢复' });

const logger = useLogger('auth');
logger.info('开始登录', { page: 'Login' });
logger.error('登录失败', { code: 401 });
```

说明：

- `useForm` 使用 `defaultValues`，不是 `initialValues`
- `useForm` 提供 `setValue` / `handleSubmit`，不是 `setFieldValue` / `submit`
- `useToast` 当前签名为 `show(message, type?, duration?)`
- `useLoading` 当前签名为 `show(text?)` / `hide()`
- `useAlert` 当前提供 `alert()` / `confirm()`，不包含 `prompt()` / `custom()`
- `useLogger(namespace?)` 提供 `debug / info / warn / error / clear / entries`

#### 开发日志 / 可观测性基础设施

框架现在内置了一套**开发态可观测性基础设施**，目标是帮助排查问题，而不是直接做线上监控平台。

默认能力：

- `useLogger(namespace?)`：组件内打点
- 内存日志缓冲：保留最近若干条日志
- Console Transport：CLI 中按 level 彩色输出
- `LogOverlay`：App 内浮动日志面板
- 浮层增强：level 筛选 / namespace 筛选 / 导出当前日志 / 按钮可拖动吸边并按当前 storage 实现恢复位置

##### 1. 最简单用法：直接跟随 `AppProvider`

```tsx
import { AppProvider, useLogger, AppButton } from '@gaozh1024/rn-kit';

function LoginButton() {
  const logger = useLogger('login');

  return (
    <AppButton
      onPress={() => {
        logger.info('点击登录按钮');
      }}
    >
      登录
    </AppButton>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LoginButton />
    </AppProvider>
  );
}
```

说明：

- `AppProvider` 在开发环境下默认 `enableLogger = true`
- 生产环境默认关闭
- 开启后会同时启用 console 输出和 App 内日志浮层

##### 2. 显式控制是否启用

```tsx
<AppProvider
  enableLogger
  enableErrorBoundary
  loggerProps={{
    level: 'info',
    maxEntries: 300,
    consoleEnabled: true,
    defaultExpanded: false,
  }}
>
  <App />
</AppProvider>
```

常用 `loggerProps`：

- `enabled`
- `level`: `'debug' | 'info' | 'warn' | 'error'`
- `maxEntries`
- `consoleEnabled`
- `overlayEnabled`
- `defaultExpanded`
- `exportEnabled`
- `onExport`

`onExport` 会收到：

```tsx
{
  entries: LogEntry[];
  serialized: string;
}
```

错误边界相关：

- `enableErrorBoundary`：是否启用 React 错误边界
- `errorBoundaryProps.title`：兜底标题
- `errorBoundaryProps.description`：兜底说明
- `errorBoundaryProps.showDetails`：是否显示错误详情
- `errorBoundaryProps.resetText`：重试按钮文案

当错误边界与 logger 同时开启时，组件渲染异常会自动写入 `react` 命名空间日志，便于在控制台和 `LogOverlay` 中回看。

##### 3. 单独使用 `OverlayProvider` / `LoggerProvider`

如果你不是通过 `AppProvider` 接入，而是自己手动包 Provider，需要注意：

- `LoggerProvider` 默认 `enabled = false`
- `OverlayProvider` 里传入的 logger 也默认不主动开启

所以需要显式打开：

```tsx
import { OverlayProvider } from '@gaozh1024/rn-kit';

<OverlayProvider
  loggerProps={{
    enabled: true,
    overlayEnabled: true,
    consoleEnabled: true,
  }}
>
  <App />
</OverlayProvider>;
```

或者：

```tsx
import { AppErrorBoundary, LoggerProvider } from '@gaozh1024/rn-kit';

<LoggerProvider enabled overlayEnabled consoleEnabled>
  <AppErrorBoundary enabled showDetails>
    <App />
  </AppErrorBoundary>
</LoggerProvider>;
```

### 🪝 Hooks

```tsx
import {
  // UI Hooks
  useToggle,
  usePageDrawer,
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
  BottomTabBar,
  DrawerNavigator,
  useNavigation,
  useRoute,
} from '@gaozh1024/rn-kit';
```

`TabNavigator` 在未显式传入 `tabBar` 时，会默认使用框架内置的 `BottomTabBar`（默认高度 `65`）。

```tsx
<TabNavigator
  tabBarOptions={{
    activeTintColor: '#f38b32',
    inactiveTintColor: '#9ca3af',
    height: 72,
    style: { borderTopWidth: 0 },
  }}
>
  {/* screens */}
</TabNavigator>
```

如果你需要完全自定义底栏，也可以手动覆盖：

```tsx
<TabNavigator tabBar={props => <BottomTabBar {...props} height={72} />}>
  {/* screens */}
</TabNavigator>
```

### 🧲 抽屉

框架同时提供两类抽屉能力：

- **导航级抽屉**：`DrawerNavigator` / `DrawerContent`
- **页面级抽屉**：`PageDrawer`

#### 1. 页面级抽屉

适合当前页面内的筛选面板、操作栏、详情侧栏。

```tsx
import React from 'react';
import { AppButton, AppText, AppView, PageDrawer } from '@gaozh1024/rn-kit';

function FilterPanel() {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <AppButton onPress={() => setVisible(true)}>打开筛选</AppButton>

      <PageDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        title="筛选条件"
        placement="right"
        width={320}
      >
        <AppView gap={3}>
          <AppText>这里放筛选项</AppText>
        </AppView>
      </PageDrawer>
    </>
  );
}
```

`PageDrawer` 支持：

- 左 / 右侧抽屉
- 点击遮罩关闭
- 自定义 `header` / `footer`
- 手势滑动关闭
- Android 返回键优先关闭抽屉

常用参数：

- `placement`: `'left' | 'right'`
- `width`: 抽屉宽度，默认 `320`
- `swipeEnabled`: 是否启用手势关闭，默认 `true`
- `swipeThreshold`: 触发关闭阈值，默认 `80`
- `closeOnBackdropPress`: 点击遮罩关闭，默认 `true`

### 🌈 渐变背景

框架提供 `GradientView` 作为渐变背景容器，底层封装 `expo-linear-gradient`。

```tsx
import { GradientView, AppText } from '@gaozh1024/rn-kit';

<GradientView colors={['#f38b32', '#fb923c']} style={{ padding: 24, borderRadius: 16 }}>
  <AppText color="white" weight="bold">
    渐变卡片
  </AppText>
</GradientView>;
```

TypeScript 下如果你把颜色数组先提到变量里，建议写成 tuple：

```tsx
const heroColors = ['#f38b32', '#fb923c'] as const;

<GradientView colors={heroColors} />;
```

如果你的应用是手动集成 `@gaozh1024/rn-kit`，请同时安装：

```bash
npx expo install expo-linear-gradient
```

如果你不想在页面里重复写 `useState(false)`，也可以直接使用：

```tsx
import { AppButton, PageDrawer, usePageDrawer } from '@gaozh1024/rn-kit';

const drawer = usePageDrawer();

<AppButton onPress={drawer.open}>打开</AppButton>;
<PageDrawer visible={drawer.visible} onClose={drawer.close} />;
```

#### 2. 导航级抽屉

适合整个导航结构都交给抽屉接管的场景：

```tsx
import { DrawerContent, DrawerNavigator } from '@gaozh1024/rn-kit';

<DrawerNavigator
  drawerContent={props => (
    <DrawerContent
      {...props}
      items={[
        { name: 'Home', label: '首页', icon: 'home' },
        { name: 'Settings', label: '设置', icon: 'settings' },
      ]}
    />
  )}
>
  {/* screens */}
</DrawerNavigator>;
```

### 🔌 API 工厂

```tsx
import { createAPI, createApiLoggerTransport, z, storage, ErrorCode } from '@gaozh1024/rn-kit';

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

#### API 自动打点（request / response / error）

`createAPI` 已支持开发态自动打点。

默认行为：

- 开发环境下 `observability.enabled` 默认开启
- 如果当前 App 已通过 `AppProvider` / `LoggerProvider` 启用了 logger
- 那么 API 请求会自动写入 `api` 命名空间日志

记录阶段：

- request
- response
- error

```tsx
const api = createAPI({
  baseURL: 'https://api.example.com',
  observability: {
    enabled: true,
    includeInput: true,
    includeResponseData: false,
  },
  endpoints: {
    getProfile: {
      method: 'GET',
      path: '/profile',
    },
  },
});
```

也可以添加自定义 transport：

```tsx
const api = createAPI({
  baseURL: 'https://api.example.com',
  observability: {
    enabled: true,
    transports: [
      event => {
        console.log('api event', event.stage, event.endpointName);
      },
    ],
  },
  endpoints: {
    getProfile: {
      method: 'GET',
      path: '/profile',
    },
  },
});
```

如果你想手动指定写到某个 logger，也可以：

```tsx
const transport = createApiLoggerTransport({
  namespace: 'network',
  includeInput: true,
  includeResponseData: true,
});

const api = createAPI({
  baseURL: 'https://api.example.com',
  observability: {
    enabled: true,
    transports: [transport],
  },
  endpoints: {
    getProfile: {
      method: 'GET',
      path: '/profile',
    },
  },
});
```

## 📄 文档

- [框架文档](../../docs/README.md) - 完整文档索引

## 📱 状态栏使用说明

### 1. 全局默认行为

推荐：

```tsx
import { AppProvider } from '@gaozh1024/rn-kit';

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
```

此时框架会自动注入全局 `AppStatusBar`：

- 亮色主题：`dark-content`
- 暗色主题：`light-content`
- 默认 `translucent={false}`
- Android 状态栏背景默认跟随当前主题背景色

### 2. 使用 `AppHeader` 时的默认行为

如果页面使用了 `AppHeader`，通常不需要再单独处理状态栏：

- `AppHeader` 内部会自动注入 `AppFocusedStatusBar`
- 配置为 `translucent + backgroundColor="transparent"`
- 顶部状态栏区域会直接显示 Header 自身背景色

适合：

- 普通详情页
- 设置页
- 使用有色 Header 的二级页面

### 3. 页面级覆盖

如果某个页面需要单独控制状态栏，可以在页面内显式渲染：

```tsx
import { AppFocusedStatusBar } from '@gaozh1024/rn-kit';

<AppFocusedStatusBar barStyle="light-content" backgroundColor="transparent" translucent />;
```

适合：

- 登录页
- 沉浸式详情页
- 顶部大图/渐变背景页

对于导航页面，优先使用 `AppFocusedStatusBar`，这样只有当前聚焦页面会覆盖状态栏配置。

### 4. 登录页全屏背景示例

如果登录页希望顶部状态栏区域也和页面背景保持一致，不要直接使用默认白底容器。

推荐：

```tsx
import { AppFocusedStatusBar, SafeScreen, AppView } from '@gaozh1024/rn-kit';

export function LoginScreen() {
  return (
    <>
      <AppFocusedStatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <SafeScreen bg="primary-500">
        <AppView flex className="bg-primary-500">
          {/* page content */}
        </AppView>
      </SafeScreen>
    </>
  );
}
```

### 5. 沉浸式状态栏示例

```tsx
import { AppFocusedStatusBar, SafeScreen, AppView } from '@gaozh1024/rn-kit';

export function HeroScreen() {
  return (
    <>
      <AppFocusedStatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <SafeScreen top={false} bottom={false}>
        <AppView flex className="bg-black">
          {/* hero content */}
        </AppView>
      </SafeScreen>
    </>
  );
}
```

### 6. 常见问题

#### 为什么顶部还是白色？

通常是以下原因之一：

1. 当前页面没有使用 `AppHeader`，也没有单独覆盖 `AppFocusedStatusBar` / `AppStatusBar`
2. 页面容器本身是白底
3. 使用了 `AppScreen` / `SafeScreen`，但没有设置 `bg`
4. 顶部安全区没有和页面背景统一

如果你用的是：

```tsx
<AppScreen>
```

那它默认不适合登录页这类全屏品牌色场景。请改成：

```tsx
<AppScreen bg="primary-500">
```

或者直接用：

```tsx
<SafeScreen bg="primary-500">
```

## 📄 许可证

MIT
