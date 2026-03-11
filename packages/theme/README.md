# @panther-expo/theme

React Native UI 主题系统包，提供跨平台的主题管理和设计系统规范。

## 📦 安装

```bash
npm install @panther-expo/theme
```

**依赖要求**：
- `react` >= 18.0.0
- `react-native` >= 0.70.0

## 🚀 快速开始

### 1. 配置主题 Provider

```typescript
import { ThemeProvider } from '@panther-expo/theme';
import { lightColors, darkColors } from './your-theme-config';

function App() {
  return (
    <ThemeProvider lightColors={lightColors} darkColors={darkColors}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. 在组件中使用主题

```typescript
import { useTheme } from '@panther-expo/theme';

function MyComponent() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        当前主题: {isDark ? '暗色' : '亮色'}
      </Text>
      <Button title="切换主题" onPress={toggleTheme} />
    </View>
  );
}
```

### 3. 使用间距系统

```typescript
import { spacing } from '@panther-expo/theme';

function MyComponent() {
  return (
    <View style={{ 
      padding: spacing.md,      // 16
      marginTop: spacing.lg,    // 24
      gap: spacing.sm,          // 8
    }}>
      {
/* 内容 */}
    </View>
  );
}
```

### 4. 使用排版系统

```typescript
import { typography } from '@panther-expo/theme';

function MyComponent() {
  return (
    <View>
      <Text style={{ 
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.xl,  // 20
        lineHeight: typography.lineHeight.normal,  // 1.5
      }}>
        标题文本
      </Text>
    </View>
  );
}
```

---

## 📚 API 文档

### ThemeProvider

主题 Provider 组件，提供主题上下文和切换功能。

#### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `children` | `ReactNode` | 是 | 子组件 |
| `lightColors` | `BaseColors` | 是 | 亮色模式颜色配置 |
| `darkColors` | `BaseColors` | 是 | 暗色模式颜色配置 |

#### BaseColors 接口

```typescript
interface BaseColors {
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
}
```

#### 使用示例

```typescript
import { ThemeProvider } from '@panther-expo/theme';

const lightColors = {
  primary: '#f38b32',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

const darkColors = {
  primary: '#f38b32',
  success: '#73D13D',
  warning: '#FFC53D',
  error: '#FF7875',
  info: '#40A9FF',
  background: '#141414',
  backgroundSecondary: '#1F1F1F',
  text: '#FFFFFF',
  textSecondary: '#A6A6A6',
  border: '#303030',
};

function App() {
  return (
    <ThemeProvider lightColors={lightColors} darkColors={darkColors}>
      <Navigation />
    </ThemeProvider>
  );
}
```

---

### useTheme

获取主题上下文 hook。

#### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `colors` | `BaseColors` | 当前主题颜色 |
| `isDark` | `boolean` | 是否为暗色模式 |
| `toggleTheme` | `() => void` | 切换主题函数 |

#### 使用示例

```typescript
import { useTheme } from '@panther-expo/theme';

function Header() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <View 
      style={{ 
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        padding: 16,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18 }}>
        我的应用
      </Text>
      
      <TouchableOpacity onPress={toggleTheme}>
        <Text style={{ color: colors.primary }}>
          {isDark ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

**注意**：`useTheme` 必须在 `ThemeProvider` 内部使用，否则会抛出错误。

---

### spacing

统一的间距系统。

#### 值

| 名称 | 值 | 说明 |
|------|-----|------|
| `xs` | 4 | 极小间距 |
| `sm` | 8 | 小间距 |
| `md` | 16 | 中等间距（默认）|
| `lg` | 24 | 大间距 |
| `xl` | 32 | 超大间距 |
| `2xl` | 48 | 2倍超大间距 |
| `3xl` | 64 | 3倍超大间距 |

#### 使用示例

```typescript
import { spacing } from '@panther-expo/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
    marginBottom: spacing['2xl'],
  },
});
```

#### TypeScript 类型

```typescript
type Spacing = {
  xs: 4;
  sm: 8;
  md: 16;
  lg: 24;
  xl: 32;
  '2xl': 48;
  '3xl': 64;
};
```

---

### typography

排版系统规范。

#### fontFamily

| 名称 | 值 |
|------|-----|
| `regular` | 'Inter-Regular' |
| `medium` | 'Inter-Medium' |
| `semiBold` | 'Inter-SemiBold' |
| `bold` | 'Inter-Bold' |

#### fontSize

| 名称 | 值 | 说明 |
|------|-----|------|
| `xs` | 12 | 极小字号 |
| `sm` | 14 | 小字号 |
| `base` | 16 | 基础字号（默认）|
| `lg` | 18 | 大字号 |
| `xl` | 20 | 超大字号 |

#### lineHeight

| 名称 | 值 | 说明 |
|------|-----|------|
| `tight` | 1.2 | 紧凑行高 |
| `normal` | 1.5 | 标准行高（默认）|
| `relaxed` | 1.75 | 宽松行高 |

#### 使用示例

```typescript
import { typography } from '@panther-expo/theme';

const styles = StyleSheet.create({
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.fontSize.xl * typography.lineHeight.tight,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
  caption: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
});
```

#### TypeScript 类型

```typescript
type Typography = {
  fontFamily: {
    regular: 'Inter-Regular';
    medium: 'Inter-Medium';
    semiBold: 'Inter-SemiBold';
    bold: 'Inter-Bold';
  };
  fontSize: {
    xs: 12;
    sm: 14;
    base: 16;
    lg: 18;
    xl: 20;
  };
  lineHeight: {
    tight: 1.2;
    normal: 1.5;
    relaxed: 1.75;
  };
};
```

---

## 📝 完整示例

### 主题配置文件

```typescript
// theme.ts
import { BaseColors } from '@panther-expo/theme';

export const lightColors: BaseColors = {
  primary: '#f38b32',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1890FF',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const darkColors: BaseColors = {
  primary: '#f38b32',
  success: '#73D13D',
  warning: '#FFC53D',
  error: '#FF7875',
  info: '#40A9FF',
  background: '#141414',
  backgroundSecondary: '#1F1F1F',
  text: '#FFFFFF',
  textSecondary: '#A6A6A6',
  border: '#303030',
};
```

### 应用入口

```typescript
// App.tsx
import React from 'react';
import { ThemeProvider } from '@panther-expo/theme';
import { lightColors, darkColors } from './theme';
import Navigation from './navigation';

export default function App() {
  return (
    <ThemeProvider lightColors={lightColors} darkColors={darkColors}>
      <Navigation />
    </ThemeProvider>
  );
}
```

### 响应式组件

```typescript
// components/Card.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '@panther-expo/theme';

interface CardProps {
  title: string;
  description: string;
}

export function Card({ title, description }: CardProps) {
  const { colors } = useTheme();

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background,
          borderColor: colors.border,
        }
      ]}
    >
      <Text 
        style={[
          styles.title, 
          { color: colors.text }
        ]}
      >
        {title}
      </Text>
      <Text 
        style={[
          styles.description, 
          { color: colors.textSecondary }
        ]}
      >
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
});
```

---

## 🎨 最佳实践

### 1. 主题切换

```typescript
// 监听系统主题变化
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@panther-expo/theme';

function App() {
  const systemColorScheme = useColorScheme();
  
  return (
    <ThemeProvider 
      lightColors={lightColors} 
      darkColors={darkColors}
      // 可以在这里根据 systemColorScheme 设置初始主题
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. 自定义 Hook

```typescript
// hooks/useAppTheme.ts
import { useTheme } from '@panther-expo/theme';

export function useAppTheme() {
  const theme = useTheme();
  
  return {
    ...theme,
    // 添加自定义颜色计算
    cardBackground: theme.isDark 
      ? theme.colors.backgroundSecondary 
      : theme.colors.background,
    dividerColor: theme.colors.border,
  };
}
```

### 3. 样式组合

```typescript
import { spacing, typography } from '@panther-expo/theme';

// 创建可复用的样式组合
export const commonStyles = {
  container: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },
};
```

---

## 📄 License

MIT
