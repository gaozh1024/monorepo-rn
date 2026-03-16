# @gaozh1024/rn-theme

> Panther Expo 框架的主题系统，提供颜色色板生成、明暗主题切换、间距和圆角配置。

## 📦 安装

```bash
npm install @gaozh1024/rn-theme
# 或
pnpm add @gaozh1024/rn-theme
```

### ⚠️ 前置要求

本库依赖 React Native 环境，请确保已安装：

```bash
npm install react react-native
# 或
pnpm add react react-native
```

---

## 🚀 快速开始

```tsx
import { ThemeProvider, createTheme, useTheme } from '@gaozh1024/rn-theme';

// 创建主题配置
const lightTheme = createTheme({
  colors: {
    primary: '#f38b32',
    secondary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
});

const darkTheme = createTheme({
  colors: {
    primary: '#f97316',
    secondary: '#818cf8',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
});

// 应用主题
function App() {
  return (
    <ThemeProvider light={lightTheme} dark={darkTheme}>
      <MyComponent />
    </ThemeProvider>
  );
}

// 使用主题
function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.primary[500] }}>
      <Text>当前主题: {isDark ? '深色' : '浅色'}</Text>
      <Button title="切换主题" onPress={toggleTheme} />
    </View>
  );
}
```

## 📚 API 文档

### createTheme

创建主题配置对象。

```ts
import { createTheme } from '@gaozh1024/rn-theme';

const theme = createTheme({
  colors: {
    primary: '#f38b32',
    secondary: { 0: '#fff', 500: '#6366f1', 950: '#1e1b4b' },
  },
  spacing: { sm: 4, md: 8, lg: 16 },
  borderRadius: { sm: 4, md: 8, lg: 16 },
});
```

**参数：**

- `config: ThemeConfig` - 主题配置

**ThemeConfig 接口：**

```ts
interface ThemeConfig {
  colors: Record<string, ColorToken>; // 颜色配置
  spacing?: Record<string, number>; // 间距配置（可选）
  borderRadius?: Record<string, number>; // 圆角配置（可选）
}

type ColorToken = string | ColorPalette;

interface ColorPalette {
  0: string; // 最浅
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // 基础色
  600: string;
  700: string;
  800: string;
  900: string;
  950: string; // 最深
}
```

**默认配置：**

```ts
// 默认间距
{
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16,
  5: 20, 6: 24, 8: 32, 10: 40, 12: 48
}

// 默认圆角
{
  none: 0, sm: 2, md: 6, lg: 8,
  xl: 12, '2xl': 16, '3xl': 24, full: 9999
}
```

---

### ThemeProvider

主题提供者组件，用于包裹应用并提供主题上下文。

```tsx
import { ThemeProvider } from '@gaozh1024/rn-theme';

<ThemeProvider
  light={lightTheme} // 浅色主题配置
  dark={darkTheme} // 深色主题配置（可选）
  defaultDark={false} // 默认是否使用深色主题
>
  <App />
</ThemeProvider>;
```

**Props：**

| 属性          | 类型          | 必需 | 说明                 |
| ------------- | ------------- | ---- | -------------------- |
| `light`       | `ThemeConfig` | ✅   | 浅色主题配置         |
| `dark`        | `ThemeConfig` | ❌   | 深色主题配置         |
| `defaultDark` | `boolean`     | ❌   | 默认是否使用深色主题 |
| `children`    | `ReactNode`   | ✅   | 子组件               |

---

### useTheme

获取主题上下文，包含当前主题、明暗状态和控制方法。

```tsx
import { useTheme } from '@gaozh1024/rn-theme';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  // theme.colors.primary[500] - 获取主色
  // theme.spacing[4] - 获取间距
  // theme.borderRadius.lg - 获取圆角

  return (
    <View>
      <Text>深色模式: {isDark ? '开启' : '关闭'}</Text>
      <Button title="切换" onPress={toggleTheme} />
    </View>
  );
}
```

**返回值：**

```ts
{
  theme: Theme;           // 当前主题对象
  isDark: boolean;        // 是否深色模式
  toggleTheme: () => void; // 切换主题函数
}
```

---

### generateColorPalette

从基础颜色生成完整的色阶色板。

```ts
import { generateColorPalette } from '@gaozh1024/rn-theme';

const palette = generateColorPalette('#f38b32');

// 返回色阶对象
{
  0: '#fff7ed',   // 极浅，用于背景
  50: '#fff0dd',
  100: '#fed9b5',
  200: '#fcb58d',
  300: '#fa9a66',
  400: '#f78d4d',
  500: '#f38b32', // 基础色
  600: '#db7d2d',
  700: '#c26e27',
  800: '#a85f22',
  900: '#8f501d',
  950: '#754118'  // 极深，用于文字
}
```

---

## 🎨 主题使用示例

### 基础主题配置

```tsx
const theme = createTheme({
  colors: {
    primary: '#f38b32',
    secondary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: '#6b7280',
  },
});

// 生成的主题结构
{
  colors: {
    primary: { 0: '...', 50: '...', ..., 950: '...' },
    secondary: { 0: '...', 50: '...', ..., 950: '...' },
    // ...
  },
  spacing: { 0: 0, 1: 4, 2: 8, ... },
  borderRadius: { none: 0, sm: 2, ... },
}
```

### 自定义间距和圆角

```tsx
const theme = createTheme({
  colors: { primary: '#f38b32' },
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
});
```

### 明暗主题切换

```tsx
import { ThemeProvider, createTheme, useTheme } from '@gaozh1024/rn-theme';

const light = createTheme({
  colors: {
    background: '#ffffff',
    text: '#1f2937',
    primary: '#f38b32',
  },
});

const dark = createTheme({
  colors: {
    background: '#1f2937',
    text: '#f9fafb',
    primary: '#f97316',
  },
});

function App() {
  return (
    <ThemeProvider light={light} dark={dark}>
      <HomeScreen />
    </ThemeProvider>
  );
}

function HomeScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background[500] }}>
      <Text style={{ color: theme.colors.text[500] }}>Hello World</Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}
```

### 与 Tailwind CSS 结合

配合 `@gaozh1024/rn-ui` 组件使用主题：

```tsx
import { AppView, AppText } from '@gaozh1024/rn-ui';
import { useTheme } from '@gaozh1024/rn-theme';

function Card() {
  const { theme } = useTheme();

  return (
    <AppView p={4} rounded="lg" className="bg-white shadow-md">
      <AppText size="lg" weight="bold" className="text-primary-500">
        标题
      </AppText>
    </AppView>
  );
}
```

---

## 🔧 类型定义

```ts
// 主题类型
interface Theme {
  colors: Record<string, ColorPalette>;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
}

// 色板类型
interface ColorPalette {
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// 主题配置类型
interface ThemeConfig {
  colors: Record<string, ColorToken>;
  spacing?: Record<string, number>;
  borderRadius?: Record<string, number>;
}

type ColorToken = string | ColorPalette;
```

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 查看覆盖率
pnpm test:coverage
```

## 📄 许可证

MIT
