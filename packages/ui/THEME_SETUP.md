# @panther-expo/ui 颜色配置指南

## 🎨 概述

`@panther-expo/ui` 基于 **Gluestack UI + NativeWind**，使用 Gluestack 标准颜色命名规范。

**关键原则**：
- ✅ 使用 Gluestack 标准颜色名（如 `primary-500`, `typography-700`）
- ✅ 通过 CSS 变量配置，支持亮色/暗色模式
- ✅ 项目只需配置基础色值，自动生成完整色板

---

## 📦 必须配置的颜色

### 核心颜色（最少需要配置这些）

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // 1. 主色系列 - 用于主要按钮、链接、高亮
      primary: {
        0: 'rgb(var(--color-primary-0)/<alpha-value>)',
        50: 'rgb(var(--color-primary-50)/<alpha-value>)',
        100: 'rgb(var(--color-primary-100)/<alpha-value>)',
        200: 'rgb(var(--color-primary-200)/<alpha-value>)',
        300: 'rgb(var(--color-primary-300)/<alpha-value>)',
        400: 'rgb(var(--color-primary-400)/<alpha-value>)',
        500: 'rgb(var(--color-primary-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-primary-600)/<alpha-value>)',  // ⭐ hover状态
        700: 'rgb(var(--color-primary-700)/<alpha-value>)',  // ⭐ active状态
        800: 'rgb(var(--color-primary-800)/<alpha-value>)',
        900: 'rgb(var(--color-primary-900)/<alpha-value>)',
        950: 'rgb(var(--color-primary-950)/<alpha-value>)',
      },

      // 2. 次要色系列 - 用于次要按钮、标签
      secondary: {
        0: 'rgb(var(--color-secondary-0)/<alpha-value>)',
        50: 'rgb(var(--color-secondary-50)/<alpha-value>)',
        100: 'rgb(var(--color-secondary-100)/<alpha-value>)',
        200: 'rgb(var(--color-secondary-200)/<alpha-value>)',
        300: 'rgb(var(--color-secondary-300)/<alpha-value>)',
        400: 'rgb(var(--color-secondary-400)/<alpha-value>)',
        500: 'rgb(var(--color-secondary-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-secondary-600)/<alpha-value>)',
        700: 'rgb(var(--color-secondary-700)/<alpha-value>)',
        800: 'rgb(var(--color-secondary-800)/<alpha-value>)',
        900: 'rgb(var(--color-secondary-900)/<alpha-value>)',
        950: 'rgb(var(--color-secondary-950)/<alpha-value>)',
      },

      // 3. 语义色 - 成功
      success: {
        0: 'rgb(var(--color-success-0)/<alpha-value>)',
        50: 'rgb(var(--color-success-50)/<alpha-value>)',
        100: 'rgb(var(--color-success-100)/<alpha-value>)',
        200: 'rgb(var(--color-success-200)/<alpha-value>)',
        300: 'rgb(var(--color-success-300)/<alpha-value>)',
        400: 'rgb(var(--color-success-400)/<alpha-value>)',
        500: 'rgb(var(--color-success-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-success-600)/<alpha-value>)',
        700: 'rgb(var(--color-success-700)/<alpha-value>)',
        800: 'rgb(var(--color-success-800)/<alpha-value>)',
        900: 'rgb(var(--color-success-900)/<alpha-value>)',
        950: 'rgb(var(--color-success-950)/<alpha-value>)',
      },

      // 4. 语义色 - 错误
      error: {
        0: 'rgb(var(--color-error-0)/<alpha-value>)',
        50: 'rgb(var(--color-error-50)/<alpha-value>)',
        100: 'rgb(var(--color-error-100)/<alpha-value>)',
        200: 'rgb(var(--color-error-200)/<alpha-value>)',
        300: 'rgb(var(--color-error-300)/<alpha-value>)',
        400: 'rgb(var(--color-error-400)/<alpha-value>)',
        500: 'rgb(var(--color-error-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-error-600)/<alpha-value>)',
        700: 'rgb(var(--color-error-700)/<alpha-value>)',
        800: 'rgb(var(--color-error-800)/<alpha-value>)',
        900: 'rgb(var(--color-error-900)/<alpha-value>)',
        950: 'rgb(var(--color-error-950)/<alpha-value>)',
      },

      // 5. 语义色 - 警告
      warning: {
        0: 'rgb(var(--color-warning-0)/<alpha-value>)',
        50: 'rgb(var(--color-warning-50)/<alpha-value>)',
        100: 'rgb(var(--color-warning-100)/<alpha-value>)',
        200: 'rgb(var(--color-warning-200)/<alpha-value>)',
        300: 'rgb(var(--color-warning-300)/<alpha-value>)',
        400: 'rgb(var(--color-warning-400)/<alpha-value>)',
        500: 'rgb(var(--color-warning-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-warning-600)/<alpha-value>)',
        700: 'rgb(var(--color-warning-700)/<alpha-value>)',
        800: 'rgb(var(--color-warning-800)/<alpha-value>)',
        900: 'rgb(var(--color-warning-900)/<alpha-value>)',
        950: 'rgb(var(--color-warning-950)/<alpha-value>)',
      },

      // 6. 语义色 - 信息
      info: {
        0: 'rgb(var(--color-info-0)/<alpha-value>)',
        50: 'rgb(var(--color-info-50)/<alpha-value>)',
        100: 'rgb(var(--color-info-100)/<alpha-value>)',
        200: 'rgb(var(--color-info-200)/<alpha-value>)',
        300: 'rgb(var(--color-info-300)/<alpha-value>)',
        400: 'rgb(var(--color-info-400)/<alpha-value>)',
        500: 'rgb(var(--color-info-500)/<alpha-value>)',  // ⭐ 主要使用
        600: 'rgb(var(--color-info-600)/<alpha-value>)',
        700: 'rgb(var(--color-info-700)/<alpha-value>)',
        800: 'rgb(var(--color-info-800)/<alpha-value>)',
        900: 'rgb(var(--color-info-900)/<alpha-value>)',
        950: 'rgb(var(--color-info-950)/<alpha-value>)',
      },

      // 7. 文本色系列
      typography: {
        0: 'rgb(var(--color-typography-0)/<alpha-value>)',    // ⭐ 反色文本
        50: 'rgb(var(--color-typography-50)/<alpha-value>)',
        100: 'rgb(var(--color-typography-100)/<alpha-value>)',
        200: 'rgb(var(--color-typography-200)/<alpha-value>)',
        300: 'rgb(var(--color-typography-300)/<alpha-value>)',
        400: 'rgb(var(--color-typography-400)/<alpha-value>)',
        500: 'rgb(var(--color-typography-500)/<alpha-value>)',
        600: 'rgb(var(--color-typography-600)/<alpha-value>)',
        700: 'rgb(var(--color-typography-700)/<alpha-value>)',  // ⭐ 主要文本
        800: 'rgb(var(--color-typography-800)/<alpha-value>)',
        900: 'rgb(var(--color-typography-900)/<alpha-value>)',
        950: 'rgb(var(--color-typography-950)/<alpha-value>)',
        white: '#FFFFFF',
        gray: '#D4D4D4',
        black: '#181718',
      },

      // 8. 背景色系列
      background: {
        0: 'rgb(var(--color-background-0)/<alpha-value>)',      // ⭐ 纯白/纯黑
        50: 'rgb(var(--color-background-50)/<alpha-value>)',    // ⭐ 卡片背景
        100: 'rgb(var(--color-background-100)/<alpha-value>)',
        200: 'rgb(var(--color-background-200)/<alpha-value>)',
        300: 'rgb(var(--color-background-300)/<alpha-value>)',  // ⭐ 输入框边框
        400: 'rgb(var(--color-background-400)/<alpha-value>)',
        500: 'rgb(var(--color-background-500)/<alpha-value>)',
        600: 'rgb(var(--color-background-600)/<alpha-value>)',
        700: 'rgb(var(--color-background-700)/<alpha-value>)',
        800: 'rgb(var(--color-background-800)/<alpha-value>)',
        900: 'rgb(var(--color-background-900)/<alpha-value>)',
        950: 'rgb(var(--color-background-950)/<alpha-value>)',
        error: 'rgb(var(--color-background-error)/<alpha-value>)',
        warning: 'rgb(var(--color-background-warning)/<alpha-value>)',
        muted: 'rgb(var(--color-background-muted)/<alpha-value>)',
        success: 'rgb(var(--color-background-success)/<alpha-value>)',
        info: 'rgb(var(--color-background-info)/<alpha-value>)',
        light: '#FBFBFB',
        dark: '#181719',
      },

      // 9. 边框色系列
      outline: {
        0: 'rgb(var(--color-outline-0)/<alpha-value>)',
        50: 'rgb(var(--color-outline-50)/<alpha-value>)',
        100: 'rgb(var(--color-outline-100)/<alpha-value>)',
        200: 'rgb(var(--color-outline-200)/<alpha-value>)',  // ⭐ 常用边框
        300: 'rgb(var(--color-outline-300)/<alpha-value>)',
        400: 'rgb(var(--color-outline-400)/<alpha-value>)',
        500: 'rgb(var(--color-outline-500)/<alpha-value>)',
        600: 'rgb(var(--color-outline-600)/<alpha-value>)',
        700: 'rgb(var(--color-outline-700)/<alpha-value>)',
        800: 'rgb(var(--color-outline-800)/<alpha-value>)',
        900: 'rgb(var(--color-outline-900)/<alpha-value>)',
        950: 'rgb(var(--color-outline-950)/<alpha-value>)',
      },

      // 10. 指示器色（用于焦点状态）
      indicator: {
        primary: 'rgb(var(--color-indicator-primary)/<alpha-value>)',
        info: 'rgb(var(--color-indicator-info)/<alpha-value>)',
        error: 'rgb(var(--color-indicator-error)/<alpha-value>)',
      },
    }
  }
}
```

---

## 🎯 简化配置方案

### 如果只配置基础色（推荐）

```javascript
// global.css 或 theme.config.ts
:root {
  /* 主色 - 橙色示例 */
  --color-primary-0: 255 255 255;
  --color-primary-50: 255 247 237;
  --color-primary-100: 255 237 213;
  --color-primary-200: 254 215 170;
  --color-primary-300: 253 186 116;
  --color-primary-400: 251 146 60;
  --color-primary-500: 243 139 50;    /* ⭐ 主色 */
  --color-primary-600: 234 88 12;     /* ⭐ hover */
  --color-primary-700: 194 65 12;     /* ⭐ active */
  --color-primary-800: 154 52 16;
  --color-primary-900: 124 45 18;
  --color-primary-950: 67 20 7;

  /* 次要色 - 灰色示例 */
  --color-secondary-500: 74 85 104;

  /* 语义色 */
  --color-success-500: 82 196 26;     /* 绿色 */
  --color-error-500: 255 77 79;       /* 红色 */
  --color-warning-500: 250 173 20;    /* 黄色 */
  --color-info-500: 24 144 255;       /* 蓝色 */

  /* 文本色 - 亮色模式 */
  --color-typography-0: 255 255 255;   /* 反色（深色背景上的白字） */
  --color-typography-700: 0 0 0;       /* 主要文本 */
  --color-typography-400: 107 114 128; /* 次要文本 */

  /* 背景色 - 亮色模式 */
  --color-background-0: 255 255 255;   /* 纯白 */
  --color-background-50: 249 250 251;  /* 卡片背景 */
  --color-background-300: 209 213 219; /* 边框 */

  /* 边框色 */
  --color-outline-200: 229 231 235;

  /* 指示器 */
  --color-indicator-primary: 243 139 50;
  --color-indicator-error: 255 77 79;
}

/* 暗色模式 */
.dark {
  --color-typography-0: 0 0 0;         /* 反色（浅色背景上的黑字） */
  --color-typography-700: 255 255 255; /* 主要文本变白 */
  --color-typography-400: 166 166 166;

  --color-background-0: 20 20 20;      /* 纯黑 */
  --color-background-50: 31 31 31;     /* 卡片背景变深 */
  --color-background-300: 64 64 64;

  --color-outline-200: 64 64 64;
}
```

---

## 🔍 颜色与组件对应关系

| 颜色 | 使用场景 | 示例组件 |
|------|----------|----------|
| `primary-500` | 主按钮背景 | Button primary |
| `primary-600` | 主按钮 hover | Button hover |
| `secondary-500` | 次要按钮 | Button secondary |
| `success-500` | 成功状态、正面操作 | Button positive |
| `error-500` | 错误状态、危险操作 | Button negative、错误提示 |
| `typography-700` | 主要文本 | Text 默认颜色 |
| `typography-0` | 按钮上的文字 | ButtonText |
| `background-0` | 纯白背景 | Card elevated |
| `background-50` | 卡片背景 | Card、输入框背景 |
| `background-300` | 边框 | Input 边框 |
| `outline-200` | 浅色边框 | Card outline |

---

## ✅ 完整使用示例

### 步骤 1: 安装依赖

```bash
npm install @panther-expo/ui nativewind tailwindcss
```

### 步骤 2: 配置 Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@panther-expo/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 复制上面的完整颜色配置
        primary: { /* ... */ },
        secondary: { /* ... */ },
        success: { /* ... */ },
        error: { /* ... */ },
        warning: { /* ... */ },
        info: { /* ... */ },
        typography: { /* ... */ },
        background: { /* ... */ },
        outline: { /* ... */ },
        indicator: { /* ... */ },
      }
    }
  }
}
```

### 步骤 3: 配置 CSS 变量

```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* 配置你的品牌色 */
  --color-primary-500: 243 139 50;  /* 橙色 */
  --color-primary-600: 234 88 12;
  --color-primary-700: 194 65 12;
  
  /* 其他颜色... */
}

.dark {
  /* 暗色模式颜色... */
}
```

### 步骤 4: 使用组件

```typescript
import { Button, Input, Card, Text } from '@panther-expo/ui';

function App() {
  return (
    <Card>
      <Text>欢迎使用</Text>
      <Input placeholder="请输入" />
      <Button action="primary">
        <ButtonText>提交</ButtonText>
      </Button>
    </Card>
  );
}
```

---

## 📝 注意事项

1. **必须配置所有颜色**：缺少任何颜色都会导致样式异常
2. **使用 RGB 格式**：CSS 变量使用 `R G B` 格式（如 `255 255 255`），不是 hex
3. **支持透明度**：通过 `<alpha-value>` 支持透明度控制
4. **暗色模式**：在 `.dark` 类中重新定义颜色变量

---

## 🎨 推荐颜色方案

### 方案 1：现代蓝色系

```css
:root {
  --color-primary-500: 59 130 246;    /* 蓝色 */
  --color-success-500: 34 197 94;     /* 绿色 */
  --color-error-500: 239 68 68;       /* 红色 */
}
```

### 方案 2：活力橙色系（当前项目）

```css
:root {
  --color-primary-500: 243 139 50;    /* 橙色 */
  --color-success-500: 82 196 26;     /* 绿色 */
  --color-error-500: 255 77 79;       /* 红色 */
}
```

### 方案 3：专业紫色系

```css
:root {
  --color-primary-500: 147 51 234;    /* 紫色 */
  --color-success-500: 34 197 94;     /* 绿色 */
  --color-error-500: 239 68 68;       /* 红色 */
}
```

---

## ❓ 常见问题

**Q: 必须配置所有色阶（50-950）吗？**
A: 是的，组件可能使用不同色阶。建议至少配置 50, 100, 200, 300, 400, 500, 600, 700。

**Q: 可以只使用 Hex 颜色吗？**
A: 不建议。组件使用 CSS 变量的 RGB 格式以支持透明度。如果必须用 hex，需要修改组件源码。

**Q: 如何覆盖特定组件的颜色？**
A: 通过 `className` 覆盖：`<Button className="bg-red-500">`。但建议统一在主题中配置。

**Q: 支持渐变吗？**
A: Gluestack 组件主要使用纯色。如需渐变，需要自定义组件或使用 NativeWind 的渐变工具。

---

**你的当前配置已经非常完整了！** ✅

你现在的 `tailwind.config.js` 和 `colors.ts` 已经包含了所有必需的颜色配置，可以直接使用 `@panther-expo/ui` 组件。
