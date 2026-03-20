# Tailwind CSS / NativeWind 配置指南

> 本框架使用 Tailwind CSS 类名来实现样式，需要在你的项目中配置 NativeWind 才能正常使用。

## 为什么需要这个配置？

框架的 UI 组件（如 `AppView`, `AppText`, `AppButton` 等）使用 Tailwind CSS 类名（如 `bg-primary-500`, `flex-1`, `p-4`）来定义样式。

这些类名需要 **NativeWind** 在构建时解析并转换为 React Native 的 StyleSheet。

`AppHeader` 也是同样的机制。它的布局依赖 `AppView` 生成的 `flex-row`、`items-center`、`px-4` 等类名，所以如果 app 没把 NativeWind 和 Tailwind 配完整，`AppHeader` 会直接表现成“没有样式”。

## 安装依赖

```bash
npm install nativewind
npm install -D tailwindcss
```

## 配置文件

### 1. 创建 Tailwind 配置文件

在项目根目录创建 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 你的项目文件
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',

    // 使用发布包时，必须包含框架产物路径
    './node_modules/@gaozh1024/rn-kit/dist/**/*.{js,mjs}',

    // 如果你通过 workspace / file: / 本地源码接入框架，
    // 还需要把实际源码路径加进来
    // '../rn-monorepo/packages/framework/src/**/*.{ts,tsx}',
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
  theme: {
    extend: {
      // 可以扩展或覆盖框架主题
      colors: {
        primary: {
          DEFAULT: '#f38b32',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f38b32',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // ... 其他颜色
      },
    },
  },
  plugins: [],
};
```

### 为什么还需要 `safelist`？

因为框架部分组件会通过 props 动态生成类名，例如：

```tsx
<AppView px={4} items="center" bg="primary-500" rounded="lg" />
```

这类写法在运行时才会变成：

- `px-4`
- `items-center`
- `bg-primary-500`
- `rounded-lg`

如果不通过 `safelist` 提前告诉 Tailwind，这些类名可能不会被生成，最终表现为：

- 间距不生效
- 背景色不生效
- 圆角不生效
- `AppHeader` 没有布局

### 2. 配置 Babel

修改 `babel.config.js`：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  };
};
```

关键点：

- `nativewind/babel` 在 NativeWind 4.x 里是 `preset`，不要放进 `plugins`
- Expo 项目需要在 `babel-preset-expo` 上补 `jsxImportSource: 'nativewind'`
- 对 Expo SDK 54 + Reanimated 4 场景，不需要再额外挂 `react-native-reanimated/plugin`

错误示例：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'], // 错误：这里会触发 .plugins is not a valid Plugin property
  };
};
```

### 3. 配置 Metro（如果需要）

对于某些 React Native 版本，可能需要配置 `metro.config.js`：

```javascript
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('nativewind/src/css-interop/transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'css'),
      sourceExts: [...sourceExts, 'css'],
    },
  };
})();
```

### 4. 创建 CSS 入口文件（推荐）

创建 `global.css` 文件：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在应用入口导入（如 `App.tsx`）：

```tsx
import './global.css';
// ... 其他导入
```

## 验证配置

创建一个测试页面验证样式是否正常：

```tsx
import { AppView, AppText, AppButton } from '@gaozh1024/rn-kit';

export function TestScreen() {
  return (
    <AppView flex center p={4} bg="gray-100">
      <AppText size="xl" weight="bold" color="primary-500">
        如果这行文字是橙色，说明配置成功！
      </AppText>

      <AppButton
        className="mt-4 px-6 py-3 bg-primary-500 rounded-lg"
        onPress={() => console.log('Clicked!')}
      >
        测试按钮
      </AppButton>
    </AppView>
  );
}
```

## 常见问题

### Q: 样式不生效，组件显示默认样式？

**检查清单**：

1. ✅ `tailwind.config.js` 中的 `content` 是否包含框架路径？
2. ✅ `babel.config.js` 是否按 NativeWind 4.x 写成 `presets` 配置？
3. ✅ `tailwind.config.js` 是否添加了框架需要的 `safelist`？
4. ✅ 是否重启了 Metro bundler？（修改配置后需要重启）
5. ✅ 是否清除了缓存？（Expo 推荐 `npx expo start -c`，React Native CLI 可用 `npx react-native start --reset-cache`）
6. ✅ `babel-preset-expo` 是否配置了 `jsxImportSource: 'nativewind'`？

### Q: 为什么 `AppHeader` 也没有样式？

`AppHeader` 不是纯 `StyleSheet` 组件，它依赖框架内部的：

- `AppView row`
- `items="center"`
- `px={4}`

这些最终都会走 NativeWind 的 `className` 管线。所以如果：

- Babel 没加 `nativewind/babel`
- `content` 没扫到框架文件
- `safelist` 没覆盖动态类

那么 `AppHeader` 会非常像“完全没有样式”。

### Q: 这是框架 bug 吗？

通常不是渲染 bug，而是消费方配置不完整。

但要注意一点：框架当前确实使用了部分**动态 className** 生成方式，因此消费方 app 不能只配最基础的 NativeWind，还必须把 `safelist` 配上。

另一个常见例外是本地链接包没有同步：

- 如果你通过 `yalc`、`file:`、workspace 或本地源码方式接入框架，app 里跑的未必是最新构建产物
- 框架源码虽然已经修复，但 app 里的 `.yalc` 或本地链接目录如果没更新，最终表现仍然会是“没有样式”

推荐排查顺序：

```bash
# 在框架仓库
pnpm --filter @gaozh1024/rn-kit build

# 如果使用 yalc
yalc publish

# 在 app 仓库
yalc update @gaozh1024/rn-kit
npx expo start -c
```

### Q: `AppHeader` 没样式，但 `tailwind.config.js` 已经配了，为什么？

优先检查 `babel.config.js` 有没有把 `nativewind/babel` 错写到 `plugins`，或者漏掉 `jsxImportSource: 'nativewind'`。

这类错误会让 NativeWind 转换根本没有接通，表现通常是：

- `AppHeader` 没有左右内边距
- 标题不居中
- `AppView` 的 `row`、`items="center"`、`px={4}` 像完全失效

### Q: 如何自定义主题颜色？

在 `tailwind.config.js` 中扩展主题：

```javascript
module.exports = {
  content: [
    /* ... */
  ],
  theme: {
    extend: {
      colors: {
        // 覆盖框架默认主色
        primary: {
          500: '#1890ff', // 改为蓝色
        },
        // 添加自定义颜色
        brand: {
          500: '#ff6b6b',
        },
      },
    },
  },
};
```

然后在组件中使用：

```tsx
<AppView bg="brand-500" /> // 使用自定义颜色
```

### Q: 与框架主题系统的关系？

框架的 `ThemeProvider` 和 `createTheme` 提供**运行时主题数据**（如颜色值、间距值）。

Tailwind CSS 提供**构建时样式类名**。

两者配合工作：

- Tailwind 类名决定样式结构（如 `flex`, `p-4`, `rounded-lg`）
- 主题系统提供具体的颜色值（如 `primary-500` 对应的颜色）

## 相关文档

- [NativeWind 官方文档](https://www.nativewind.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [框架快速开始](../SETUP.md)
