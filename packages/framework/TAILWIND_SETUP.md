# Tailwind CSS / NativeWind 配置指南

> 本框架使用 Tailwind CSS 类名来实现样式，需要在你的项目中配置 NativeWind 才能正常使用。

## 为什么需要这个配置？

框架的 UI 组件（如 `AppView`, `AppText`, `AppButton` 等）使用 Tailwind CSS 类名（如 `bg-primary-500`, `flex-1`, `p-4`）来定义样式。

这些类名需要 **NativeWind** 在构建时解析并转换为 React Native 的 StyleSheet。

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

    // 必须包含框架组件路径
    './node_modules/@gaozh1024/rn-kit/dist/**/*.{js,mjs}',
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

### 2. 配置 Babel

修改 `babel.config.js`：

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'], // 添加这一行
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

### 4. 创建 CSS 入口文件（可选）

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
2. ✅ `babel.config.js` 是否添加了 `nativewind/babel`？
3. ✅ 是否重启了 Metro bundler？（修改配置后需要重启）
4. ✅ 是否清除了缓存？（`npx react-native start --reset-cache`）

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
