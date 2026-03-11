# @panther-expo/utils

React Native 通用工具函数包，提供开发中常用的工具函数和辅助方法。

## 📦 安装

```bash
npm install @panther-expo/utils
```

**依赖要求**：
- `zod` ^4.0.0（验证工具需要）

## 🚀 快速开始

### 1. 表单验证工具

```typescript
import { z } from 'zod';
import { getValidationErrors, hasErrors, getFieldError } from '@panther-expo/utils';

// 定义验证模式
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

// 验证表单
try {
  loginSchema.parse({ email: 'user@example.com', password: '123456' });
  console.log('验证通过');
} catch (error) {
  if (error instanceof z.ZodError) {
    // 获取字段错误映射
    const errors = getValidationErrors(error);
    console.log(errors);  // { email: '...', password: '...' }
    
    // 检查是否有错误
    if (hasErrors(errors)) {
      console.log('表单有错误');
    }
    
    // 获取特定字段错误
    const emailError = getFieldError(errors, 'email');
    console.log(emailError);  // '请输入有效的邮箱地址'
  }
}
```

### 2. 颜色转换工具

```typescript
import { hexToRgb, rgbaToRgb } from '@panther-expo/utils';

// 十六进制转 RGB
const rgb = hexToRgb('#f38b32');
console.log(rgb);  // '243 139 50'

// RGBA 转 RGB
const rgb2 = rgbaToRgb('rgba(243, 139, 50, 0.1)');
console.log(rgb2);  // '243 139 50'
```

### 3. 颜色调色板生成

```typescript
import { generateColorPalette, generateFullCssConfig } from '@panther-expo/utils';

// 生成单个颜色调色板
const palette = generateColorPalette('#f38b32');
console.log(palette[500]);   // '243 139 50' (原色)
console.log(palette[600]);   // '219 125 45' (变暗)
console.log(palette[400]);   // '247 174 112' (变亮)

// 生成完整 CSS 配置
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

## 📚 API 文档

### 表单验证工具

#### getValidationErrors(error: z.ZodError): Record<string, string>

将 Zod 验证错误转换为字段错误映射对象。

**参数**：
- `error` - ZodError 实例

**返回值**：
- `Record<string, string>` - 字段名到错误消息的映射

**示例**：

```typescript
import { z } from 'zod';
import { getValidationErrors } from '@panther-expo/utils';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

try {
  schema.parse({ email: 'invalid', age: 16 });
} catch (error) {
  if (error instanceof z.ZodError) {
    const errors = getValidationErrors(error);
    console.log(errors);
    // {
    //   email: 'Invalid email',
    //   age: 'Number must be greater than or equal to 18'
    // }
  }
}
```

---

#### hasErrors(errors: Record<string, string>): boolean

检查表单是否有错误。

**参数**：
- `errors` - 字段错误映射对象

**返回值**：
- `boolean` - 是否存在错误

**示例**：

```typescript
import { hasErrors } from '@panther-expo/utils';

const errors = { email: 'Invalid email' };

if (hasErrors(errors)) {
  console.log('表单验证失败');
} else {
  console.log('表单验证通过');
}
```

---

#### getFieldError(errors: Record<string, string>, field: string): string | undefined

获取指定字段的错误消息。

**参数**：
- `errors` - 字段错误映射对象
- `field` - 字段名称

**返回值**：
- `string | undefined` - 错误消息或 undefined

**示例**：

```typescript
import { getFieldError } from '@panther-expo/utils';

const errors = {
  email: '邮箱格式不正确',
  password: '密码太短',
};

const emailError = getFieldError(errors, 'email');
console.log(emailError);  // '邮箱格式不正确'

const phoneError = getFieldError(errors, 'phone');
console.log(phoneError);  // undefined
```

---

### 颜色工具

#### hexToRgb(hex: string): string

将十六进制颜色转换为 RGB 格式字符串。

**参数**：
- `hex` - 十六进制颜色值，如 `'#f38b32'` 或 `'#fff'`

**返回值**：
- `string` - RGB 格式字符串，如 `'243 139 50'`

**示例**：

```typescript
import { hexToRgb } from '@panther-expo/utils';

// 6位十六进制
hexToRgb('#f38b32');  // '243 139 50'

// 3位十六进制
hexToRgb('#f38');     // '255 51 136'

// 带 # 前缀
hexToRgb('#ffffff');  // '255 255 255'
```

---

#### rgbaToRgb(rgba: string): string

将 RGBA 颜色字符串转换为 RGB 格式字符串。

**参数**：
- `rgba` - RGBA 颜色字符串，如 `'rgba(243, 139, 50, 0.1)'`

**返回值**：
- `string` - RGB 格式字符串，如 `'243 139 50'`

**示例**：

```typescript
import { rgbaToRgb } from '@panther-expo/utils';

rgbaToRgb('rgba(243, 139, 50, 0.1)');  // '243 139 50'
rgbaToRgb('rgba(255, 255, 255, 1)');   // '255 255 255'
```

---

### 颜色调色板工具

#### generateColorPalette(baseColor: string): ColorPalette

根据基础颜色生成 0-950 完整色阶。

**参数**：
- `baseColor` - 基础颜色，十六进制如 `'#f38b32'` 或 RGBA 如 `'rgba(243, 139, 50, 0.1)'`

**返回值**：
- `ColorPalette` - 包含 0-950 色阶的对象

**ColorPalette 结构**：

```typescript
interface ColorPalette {
  0: string;    // 最亮（接近白色）
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // 原色
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;  // 最暗（接近黑色）
}
```

**示例**：

```typescript
import { generateColorPalette } from '@panther-expo/utils';

const palette = generateColorPalette('#f38b32');

console.log(palette);
// {
//   0: '255 247 237',
//   50: '254 243 235',
//   100: '253 226 204',
//   200: '251 197 153',
//   300: '249 174 112',
//   400: '247 157 82',
//   500: '243 139 50',    // 原色
//   600: '219 125 45',    // 变暗 10%
//   700: '182 104 38',    // 变暗 25%
//   800: '146 83 30',     // 变暗 40%
//   900: '109 62 23',     // 变暗 55%
//   950: '73 42 15'       // 变暗 70%
// }

// 使用在样式中
const primaryColor = palette[500];      // 主色
const hoverColor = palette[600];        // hover 状态
const lightBg = palette[50];            // 浅色背景
```

---

#### generateColorPalettes(colors: Record<string, string>): Record<string, ColorPalette>

批量生成多个颜色的调色板。

**参数**：
- `colors` - 颜色配置对象，key 为颜色名，value 为十六进制颜色值

**返回值**：
- `Record<string, ColorPalette>` - 包含所有颜色调色板的对象

**示例**：

```typescript
import { generateColorPalettes } from '@panther-expo/utils';

const palettes = generateColorPalettes({
  primary: '#f38b32',
  secondary: '#4A5568',
  success: '#52C41A',
  error: '#FF4D4F',
});

console.log(palettes.primary[500]);    // '243 139 50'
console.log(palettes.secondary[500]);  // '74 85 104'
console.log(palettes.success[500]);    // '82 196 26'
```

---

#### generateCssVariables(name: string, palette: ColorPalette): string

生成 CSS 变量配置字符串。

**参数**：
- `name` - 颜色名称，如 `'primary'`, `'success'`
- `palette` - 颜色调色板对象

**返回值**：
- `string` - CSS 变量字符串

**示例**：

```typescript
import { generateCssVariables, generateColorPalette } from '@panther-expo/utils';

const palette = generateColorPalette('#f38b32');
const css = generateCssVariables('primary', palette);

console.log(css);
//   --color-primary-0: 255 247 237;
//   --color-primary-50: 254 243 235;
//   --color-primary-100: 253 226 204;
//   ...
```

---

#### generateFullCssConfig(theme: Record<string, string>): string

生成完整的 CSS 变量配置。

**参数**：
- `theme` - 主题颜色配置对象

**返回值**：
- `string` - 完整的 CSS 代码

**示例**：

```typescript
import { generateFullCssConfig } from '@panther-expo/utils';

const css = generateFullCssConfig({
  primary: '#f38b32',
  secondary: '#4A5568',
  success: '#52C41A',
  error: '#FF4D4F',
  warning: '#FAAD14',
  info: '#1890FF',
});

console.log(css);
// 输出完整的 :root CSS 代码，包含所有颜色的 0-950 色阶
```

---

## 📝 完整示例

### 表单验证示例

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { z } from 'zod';
import { getValidationErrors, hasErrors, getFieldError } from '@panther-expo/utils';

// 定义验证模式
const registerSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      registerSchema.parse(formData);
      // 验证通过，提交表单
      console.log('提交表单:', formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(getValidationErrors(error));
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="用户名"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />
      {getFieldError(errors, 'username') && (
        <Text style={{ color: 'red' }}>{getFieldError(errors, 'username')}</Text>
      )}

      <TextInput
        placeholder="邮箱"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      {getFieldError(errors, 'email') && (
        <Text style={{ color: 'red' }}>{getFieldError(errors, 'email')}</Text>
      )}

      <TextInput
        placeholder="密码"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />
      {getFieldError(errors, 'password') && (
        <Text style={{ color: 'red' }}>{getFieldError(errors, 'password')}</Text>
      )}

      <TextInput
        placeholder="确认密码"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        secureTextEntry
      />
      {getFieldError(errors, 'confirmPassword') && (
        <Text style={{ color: 'red' }}>{getFieldError(errors, 'confirmPassword')}</Text>
      )}

      <Button 
        title={hasErrors(errors) ? '请修正错误' : '注册'} 
        onPress={handleSubmit} 
        disabled={hasErrors(errors)}
      />
    </View>
  );
}
```

### 主题配置生成示例

```typescript
// scripts/generate-theme.ts
import { generateFullCssConfig } from '@panther-expo/utils';
import * as fs from 'fs';

const css = generateFullCssConfig({
  primary: '#f38b32',
  secondary: '#4A5568',
  success: '#52C41A',
  error: '#FF4D4F',
  warning: '#FAAD14',
  info: '#1890FF',
});

fs.writeFileSync('theme.css', css);
console.log('主题配置已生成到 theme.css');
```

---

## 🎨 最佳实践

### 1. 表单验证组合

```typescript
import { z } from 'zod';
import { getValidationErrors, hasErrors, getFieldError } from '@panther-expo/utils';

// 创建自定义 hook
function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): boolean => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(getValidationErrors(error));
      }
      return false;
    }
  };

  const getError = (field: string) => getFieldError(errors, field);
  const hasError = () => hasErrors(errors);

  return { errors, validate, getError, hasError };
}

// 使用
const { validate, getError, hasError } = useFormValidation(loginSchema);
```

### 2. 颜色工具组合

```typescript
import { generateColorPalette, hexToRgb } from '@panther-expo/utils';

// 创建主题工具
export const themeUtils = {
  // 生成品牌色板
  generateBrandPalette: (primaryColor: string) => {
    return generateColorPalette(primaryColor);
  },

  // 转换为 Tailwind 配置格式
  toTailwindConfig: (palette: ColorPalette) => {
    const config: Record<number, string> = {};
    for (const [key, value] of Object.entries(palette)) {
      config[parseInt(key)] = `rgb(${value})`;
    }
    return config;
  },

  // 检查颜色亮度
  isLightColor: (hex: string) => {
    const rgb = hexToRgb(hex).split(' ').map(Number);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 128;
  },
};
```

---

## 📄 License

MIT
