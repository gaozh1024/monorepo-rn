# @panther-expo/ui

基于 Gluestack UI + NativeWind 的 React Native 组件库

## 📦 安装

```bash
npm install @panther-expo/ui nativewind tailwindcss
```

## 🚀 快速开始

### 第一步：生成主题配置

使用 CLI 工具快速生成主题配置：

```bash
# 使用默认主题（活力橙）
npx @panther-expo/ui generate-theme

# 使用预设主题
npx @panther-expo/ui generate-theme orange    # 活力橙
npx @panther-expo/ui generate-theme blue      # 现代蓝
npx @panther-expo/ui generate-theme purple    # 专业紫

# 使用自定义颜色
npx @panther-expo/ui generate-theme #3b82f6
```

### 第二步：应用配置

将生成的文件复制到你的项目中：

```bash
# 复制 CSS 变量到全局样式
cp theme-generated/colors.css global.css

# 或追加到现有 global.css
cat theme-generated/colors.css >> global.css

# 复制 Tailwind 配置
cp theme-generated/tailwind.config.js tailwind.config.js
```

### 第三步：使用组件

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

## 🛠️ CLI 工具详细说明

### 命令

```bash
npx @panther-expo/ui generate-theme [options]
```

### 选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `orange` | 活力橙主题（默认） | `npx @panther-expo/ui generate-theme orange` |
| `blue` | 现代蓝主题 | `npx @panther-expo/ui generate-theme blue` |
| `purple` | 专业紫主题 | `npx @panther-expo/ui generate-theme purple` |
| `#RRGGBB` | 自定义颜色 | `npx @panther-expo/ui generate-theme #3b82f6` |

### 生成的文件

运行命令后会在 `./theme-generated/` 目录生成：

```
theme-generated/
├── colors.css              # CSS 变量配置
├── tailwind.config.js      # Tailwind 配置
└── README.md               # 使用说明
```

#### colors.css

包含所有 Gluestack UI 需要的 CSS 变量：

```css
:root {
  --color-primary-500: 243 139 50;
  --color-primary-600: 219 125 45;
  --color-success-500: 82 196 26;
  --color-error-500: 255 77 79;
  /* ... 更多颜色 */
}

.dark {
  /* 暗色模式配置 */
}
```

#### tailwind.config.js

完整的 Tailwind 配置，包含所有颜色定义：

```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@panther-expo/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'rgb(var(--color-primary-500)/<alpha-value>)',
          /* ... */
        }
      }
    }
  }
}
```

---

## 📚 手动配置（不使用 CLI）

如果你不想使用 CLI，可以手动配置：

### 1. 安装依赖

```bash
npm install @panther-expo/ui nativewind tailwindcss
```

### 2. 配置 CSS 变量

在 `global.css` 中添加：

```css
:root {
  /* 主色 */
  --color-primary-0: 255 255 255;
  --color-primary-50: 255 247 237;
  --color-primary-100: 255 237 213;
  --color-primary-200: 254 215 170;
  --color-primary-300: 253 186 116;
  --color-primary-400: 251 146 60;
  --color-primary-500: 243 139 50;    /* 你的主色 */
  --color-primary-600: 234 88 12;
  --color-primary-700: 194 65 12;
  --color-primary-800: 154 52 16;
  --color-primary-900: 124 45 18;
  --color-primary-950: 67 20 7;

  /* 其他颜色... */
}
```

### 3. 配置 Tailwind

在 `tailwind.config.js` 中：

```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './node_modules/@panther-expo/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'rgb(var(--color-primary-500)/<alpha-value>)',
          // ... 其他色阶
        }
      }
    }
  }
}
```

---

## 🎨 API 使用

### generateColorPalette

生成单个颜色的完整色阶：

```typescript
import { generateColorPalette } from '@panther-expo/ui/theme';

const palette = generateColorPalette('#f38b32');

console.log(palette);
// {
//   0: '255 247 237',
//   50: '254 231 205',
//   100: '253 205 153',
//   ...
//   500: '243 139 50',
//   600: '219 125 45',
//   ...
//   950: '99 46 10'
// }
```

### generateFullCssConfig

生成完整 CSS 配置：

```typescript
import { generateFullCssConfig } from '@panther-expo/ui/theme';

const css = generateFullCssConfig({
  primary: '#f38b32',
  secondary: '#4A5568',
  success: '#52C41A',
  error: '#FF4D4F',
});

console.log(css);
// 输出完整的 CSS 变量代码
```

---

## 📦 可用组件

### 布局组件

- `Box` - 基础容器
- `Card` - 卡片容器

### 表单组件

- `Button` / `ButtonText` / `ButtonIcon` / `ButtonSpinner` / `ButtonGroup` - 按钮
- `Input` / `InputField` / `InputIcon` / `InputSlot` - 输入框

### 展示组件

- `Text` - 文本

---

## 📖 文档

- [主题配置详细说明](./THEME_SETUP.md)

---

## 📝 注意事项

1. **必须配置颜色**：组件依赖 CSS 变量，缺少颜色会导致样式异常
2. **RGB 格式**：CSS 变量使用 `R G B` 格式，不是 hex
3. **暗色模式**：支持亮色/暗色模式切换

---

## 🔧 开发

```bash
# 克隆仓库
git clone <repository>

# 安装依赖
npm install

# 构建
npm run build

# 生成主题（测试）
npm run generate-theme
```

---

## 📄 License

MIT
