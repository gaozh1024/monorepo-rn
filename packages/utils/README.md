# @gaozh/rn-utils

> Panther Expo 框架的工具函数库，提供颜色处理、字符串操作、日期格式化等常用工具函数。

## 📦 安装

```bash
npm install @gaozh/rn-utils
# 或
pnpm add @gaozh/rn-utils
```

> **注意：** 本库为纯工具库，无额外依赖要求。`clsx` 和 `tailwind-merge` 会自动随包安装。

---

## 🚀 快速开始

```ts
import { cn, formatDate, generateColorPalette } from '@gaozh/rn-utils';

// 合并 className
const className = cn('text-red-500', 'bg-blue-500', { 'font-bold': true });

// 格式化日期
const dateStr = formatDate(new Date(), 'yyyy-MM-dd');

// 生成色板
const palette = generateColorPalette('#f38b32');
```

## 📚 API 文档

### ClassName 工具

#### `cn(...inputs)`

使用 `clsx` 和 `tailwind-merge` 合并 Tailwind CSS 类名，自动处理冲突。

```ts
import { cn } from '@gaozh/rn-utils';

cn('text-red-500', 'bg-blue-500');
// => 'text-red-500 bg-blue-500'

cn('px-4 py-2', { 'font-bold': true, hidden: false });
// => 'px-4 py-2 font-bold'

// 自动合并冲突类名
cn('text-red-500', 'text-blue-500');
// => 'text-blue-500'
```

**参数：**

- `inputs: ClassValue[]` - 任意数量的类名值

**返回值：**

- `string` - 合并后的类名字符串

---

### 颜色工具

#### `hexToRgb(hex)`

将十六进制颜色转换为 RGB 对象。

```ts
import { hexToRgb } from '@gaozh/rn-utils';

hexToRgb('#f38b32');
// => { r: 243, g: 139, b: 50 }
```

**参数：**

- `hex: string` - 十六进制颜色字符串

**返回值：**

- `RgbObject` - `{ r: number, g: number, b: number }`

---

#### `rgbToHex(rgb)`

将 RGB 对象转换为十六进制颜色。

```ts
import { rgbToHex } from '@gaozh/rn-utils';

rgbToHex({ r: 243, g: 139, b: 50 });
// => '#f38b32'
```

---

#### `adjustBrightness(rgb, factor)`

调整 RGB 颜色的亮度。

```ts
import { adjustBrightness, hexToRgb } from '@gaozh/rn-utils';

const rgb = hexToRgb('#f38b32');
adjustBrightness(rgb, 0.2); // 提亮 20%
adjustBrightness(rgb, -0.2); // 变暗 20%
```

**参数：**

- `rgb: RgbObject` - RGB 颜色对象
- `factor: number` - 亮度调整因子，正数提亮，负数变暗

---

#### `generateColorPalette(baseHex)`

从基础颜色生成完整的色阶色板（0-950）。

```ts
import { generateColorPalette } from '@gaozh/rn-utils';

const palette = generateColorPalette('#f38b32');
// => {
//   0: '#fff7ed',
//   50: '#fff0dd',
//   100: '#fed9b5',
//   200: '#fcb58d',
//   300: '#fa9a66',
//   400: '#f78d4d',
//   500: '#f38b32',
//   600: '#db7d2d',
//   700: '#c26e27',
//   800: '#a85f22',
//   900: '#8f501d',
//   950: '#754118'
// }

// 使用色板
palette[500]; // 基础色
palette[100]; // 浅色背景
palette[700]; // 深色文字
```

**参数：**

- `baseHex: string` - 基础十六进制颜色

**返回值：**

- `ColorPalette` - 包含 0-950 色阶的色板对象

---

### 平台工具

#### `isDevelopment()`

检查当前是否处于开发环境。

```ts
import { isDevelopment } from '@gaozh/rn-utils';

if (isDevelopment()) {
  console.log('开发环境');
}
```

---

### 日期工具

#### `formatDate(date, format)`

格式化日期为指定格式。

```ts
import { formatDate } from '@gaozh/rn-utils';

formatDate(new Date('2024-03-15'), 'yyyy-MM-dd');
// => '2024-03-15'

formatDate(new Date('2024-03-15'), 'yyyy/MM/dd');
// => '2024/03/15'
```

**参数：**

- `date: Date` - 日期对象
- `format: string` - 格式字符串，支持 `yyyy`, `MM`, `dd`

---

#### `formatRelativeTime(date)`

格式化为相对时间（刚刚、几分钟前等）。

```ts
import { formatRelativeTime } from '@gaozh/rn-utils';

formatRelativeTime(new Date(Date.now() - 5 * 60000));
// => '5分钟前'

formatRelativeTime(new Date(Date.now() - 2 * 3600000));
// => '2小时前'

formatRelativeTime(new Date('2024-01-01'));
// => '2024-01-01' (超过30天返回日期)
```

---

### 字符串工具

#### `truncate(str, length, suffix)`

截断字符串并添加后缀。

```ts
import { truncate } from '@gaozh/rn-utils';

truncate('Hello World', 8);
// => 'Hello...'

truncate('Hello World', 8, '---');
// => 'Hello---'
```

---

#### `slugify(str)`

将字符串转换为 URL 友好的 slug。

```ts
import { slugify } from '@gaozh/rn-utils';

slugify('Hello World!');
// => 'hello-world'

slugify('React Native App');
// => 'react-native-app'
```

---

#### `capitalize(str)`

首字母大写。

```ts
import { capitalize } from '@gaozh/rn-utils';

capitalize('hello');
// => 'Hello'
```

---

### 数字工具

#### `formatNumber(num)`

格式化数字为千分位格式。

```ts
import { formatNumber } from '@gaozh/rn-utils';

formatNumber(1234567);
// => '1,234,567'
```

---

#### `formatCurrency(num, currency)`

格式化为货币格式。

```ts
import { formatCurrency } from '@gaozh/rn-utils';

formatCurrency(1234.5);
// => '¥1,234.5'

formatCurrency(1234.5, '$');
// => '$1,234.5'
```

---

#### `formatPercent(num, decimals)`

格式化为百分比。

```ts
import { formatPercent } from '@gaozh/rn-utils';

formatPercent(0.1567);
// => '15.67%'

formatPercent(0.1567, 1);
// => '15.7%'
```

---

#### `clamp(num, min, max)`

将数字限制在指定范围内。

```ts
import { clamp } from '@gaozh/rn-utils';

clamp(100, 0, 50);
// => 50

clamp(-10, 0, 50);
// => 0
```

---

### 对象工具

#### `deepMerge(target, source)`

深度合并两个对象。

```ts
import { deepMerge } from '@gaozh/rn-utils';

const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };

deepMerge(target, source);
// => { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

---

#### `pick(obj, keys)`

从对象中选取指定属性。

```ts
import { pick } from '@gaozh/rn-utils';

const user = { id: 1, name: 'Tom', age: 25, password: 'secret' };

pick(user, ['id', 'name']);
// => { id: 1, name: 'Tom' }
```

---

#### `omit(obj, keys)`

从对象中排除指定属性。

```ts
import { omit } from '@gaozh/rn-utils';

const user = { id: 1, name: 'Tom', age: 25, password: 'secret' };

omit(user, ['password']);
// => { id: 1, name: 'Tom', age: 25 }
```

---

### 验证工具

#### `isValidEmail(email)`

验证邮箱格式。

```ts
import { isValidEmail } from '@gaozh/rn-utils';

isValidEmail('user@example.com');
// => true

isValidEmail('invalid-email');
// => false
```

---

#### `isValidPhone(phone)`

验证中国大陆手机号格式。

```ts
import { isValidPhone } from '@gaozh/rn-utils';

isValidPhone('13800138000');
// => true

isValidPhone('12345678901');
// => false
```

---

#### `getValidationErrors(error)`

从 Zod 错误中提取字段错误信息。

```ts
import { getValidationErrors } from '@gaozh/rn-utils';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

const result = schema.safeParse({ email: 'invalid', age: 15 });
if (!result.success) {
  const errors = getValidationErrors(result.error);
  // => { email: 'Invalid email', age: 'Number must be >= 18' }
}
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
