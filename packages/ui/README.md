# @gaozh/rn-ui

> Panther Expo 框架的 UI 组件库，提供原子组件、布局组件、反馈组件等，基于 NativeWind 和 Tailwind CSS。

## 📦 安装

```bash
npm install @gaozh/rn-ui
# 或
pnpm add @gaozh/rn-ui
```

### ⚠️ 前置要求

本库依赖 **NativeWind v4** 来处理样式，使用前需要完成以下配置：

#### 1. 安装依赖

```bash
npm install nativewind tailwindcss react-native-reanimated react-native-svg
# 或
pnpm add nativewind tailwindcss react-native-reanimated react-native-svg
```

> **注意：** `react-native-reanimated` 和 `react-native-svg` 是必需的 peer 依赖，动画功能和图标组件需要它们。

#### 2. 配置 Tailwind CSS

创建 `tailwind.config.js`：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@gaozh/rn-ui/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // 其他主题色...
      },
    },
  },
  plugins: [],
};
```

#### 3. 配置 Metro（重要）

创建或修改 `metro.config.js`：

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 配置 NativeWind
module.exports = withNativeWind(config, {
  input: './global.css',
});
```

#### 4. 配置 Babel

修改 `babel.config.js`：

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // 必须添加，用于动画
    ],
  };
};
```

#### 5. 创建 CSS 文件

在项目根目录创建 `global.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 6. 导入样式

在应用入口（如 `App.tsx`）导入：

```tsx
import './global.css';
// 或者对于 Expo Router 项目，在 app/_layout.tsx 中导入
```

更多配置详情请参考 [NativeWind 文档](https://www.nativewind.dev/)。

#### ✅ 配置检查清单

确保以下文件都已正确配置：

```
项目根目录/
├── metro.config.js      # 配置 withNativeWind
├── babel.config.js      # 添加 nativewind/babel 插件
├── tailwind.config.js   # 配置 content 路径
├── global.css           # Tailwind 指令
└── App.tsx              # 导入 global.css
```

#### 🚨 常见问题

**Q: 样式不生效？**

- 检查 `metro.config.js` 是否正确配置了 `withNativeWind`
- 检查 `global.css` 是否正确导入
- 检查 `tailwind.config.js` 的 `content` 是否包含组件路径

**Q: 动画不工作？**

- 确保 `babel.config.js` 中添加了 `'react-native-reanimated/plugin'`
- 确保已安装 `react-native-reanimated`

**Q: 图标不显示？**

- 确保已安装 `react-native-svg`

---

## 🚀 快速开始

```tsx
import {
  AppView,
  AppText,
  AppButton,
  Row,
  Col,
  Center,
  Card,
  Toast,
  Alert,
  Loading,
  Progress,
} from '@gaozh/rn-ui';

function Example() {
  return (
    <AppView flex p={4} gap={4}>
      <AppText size="xl" weight="bold">
        欢迎使用 Panther UI
      </AppText>

      <Row gap={2}>
        <AppButton onPress={() => {}}>主要按钮</AppButton>
        <AppButton variant="outline" color="secondary">
          次要按钮
        </AppButton>
      </Row>

      <Progress value={75} size="md" color="primary" />
    </AppView>
  );
}
```

## 📚 组件文档

### 🔷 原子组件 (Primitives)

基础 UI 组件，封装了 React Native 原生组件并添加 Tailwind 支持。

#### AppView

增强的 View 组件，支持便捷的布局属性。

```tsx
import { AppView } from '@gaozh/rn-ui';

<AppView
  flex // flex-1 或 flex-{number}
  row // flex-row（默认为 column）
  center // items-center justify-center
  between // justify-between
  items="center" // items-{start|center|end|stretch}
  justify="between" // justify-{start|center|end|between|around}
  p={4} // padding
  px={2} // padding-horizontal
  py={3} // padding-vertical
  gap={2} // gap
  bg="primary-500" // background-color
  rounded="lg" // border-radius
  className="shadow-md"
>
  <Text>内容</Text>
</AppView>;
```

**属性：**

| 属性        | 类型                                                    | 说明                    |
| ----------- | ------------------------------------------------------- | ----------------------- |
| `flex`      | `boolean \| number`                                     | 弹性布局                |
| `row`       | `boolean`                                               | 水平排列                |
| `center`    | `boolean`                                               | 居中                    |
| `between`   | `boolean`                                               | 两端对齐                |
| `items`     | `'start' \| 'center' \| 'end' \| 'stretch'`             | 交叉轴对齐              |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | 主轴对齐                |
| `p`         | `number`                                                | 内边距                  |
| `px`        | `number`                                                | 水平内边距              |
| `py`        | `number`                                                | 垂直内边距              |
| `gap`       | `number`                                                | 间距                    |
| `bg`        | `string`                                                | 背景色（Tailwind 类名） |
| `rounded`   | `string`                                                | 圆角（Tailwind 类名）   |
| `className` | `string`                                                | 自定义类名              |

---

#### AppText

增强的 Text 组件，支持预设大小和字重。

```tsx
import { AppText } from '@gaozh/rn-ui';

<AppText
  size="lg" // xs, sm, md, lg, xl, 2xl, 3xl
  weight="bold" // normal, medium, semibold, bold
  color="primary-500" // 文字颜色
  className="text-center"
>
  标题文字
</AppText>;
```

**属性：**

| 属性        | 类型                                                     | 说明                      |
| ----------- | -------------------------------------------------------- | ------------------------- |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | 文字大小                  |
| `weight`    | `'normal' \| 'medium' \| 'semibold' \| 'bold'`           | 字重                      |
| `color`     | `string`                                                 | 文字颜色（Tailwind 类名） |
| `className` | `string`                                                 | 自定义类名                |

**尺寸映射：**

```
xs  -> text-xs  (12px)
sm  -> text-sm  (14px)
md  -> text-base (16px)
lg  -> text-lg  (18px)
xl  -> text-xl  (20px)
2xl -> text-2xl (24px)
3xl -> text-3xl (30px)
```

---

#### AppPressable

增强的 Pressable 组件，支持按下状态样式。

```tsx
import { AppPressable } from '@gaozh/rn-ui';

<AppPressable
  className="px-4 py-3 bg-blue-500 rounded-lg"
  pressedClassName="bg-blue-600" // 按下时的样式
  onPress={() => console.log('pressed')}
>
  <Text className="text-white">点击我</Text>
</AppPressable>;
```

**属性：**

| 属性               | 类型     | 说明         |
| ------------------ | -------- | ------------ |
| `className`        | `string` | 默认样式     |
| `pressedClassName` | `string` | 按下时的样式 |

---

#### AppInput

带标签和错误提示的输入框组件。

```tsx
import { AppInput } from '@gaozh/rn-ui';

<AppInput
  label="邮箱地址"
  placeholder="请输入邮箱"
  value={email}
  onChangeText={setEmail}
  error={errors.email} // 错误信息，有值时显示红色边框
/>;
```

**属性：**

| 属性        | 类型     | 说明       |
| ----------- | -------- | ---------- |
| `label`     | `string` | 标签文字   |
| `error`     | `string` | 错误信息   |
| `className` | `string` | 自定义类名 |

继承 `TextInput` 的所有其他属性。

---

### 📐 布局组件 (Layout)

简化常用布局的组件。

#### Row

水平排列容器。

```tsx
import { Row } from '@gaozh/rn-ui';

<Row
  justify="between" // start, center, end, between, around
  items="center" // start, center, end, stretch
  gap={2}
>
  <Text>左侧</Text>
  <Text>右侧</Text>
</Row>;
```

---

#### Col

垂直排列容器。

````tsx
import { Col } from '@gaozh/rn-ui';

<Col justify="start" items="stretch" gap={4}>
  <Text>第一行</Text>
  <Text>第二行</Text>
</Col>;
` ``

---

#### Center

居中对齐容器。

```tsx
import { Center } from '@gaozh/rn-ui';

<Center flex>  {/* flex 属性控制是否填充父容器 */}
  <Text>居中内容</Text>
</Center>

<Center>  {/* 仅包裹内容 */}
  <Icon name="check" />
</Center>
````

---

### 🔘 组合组件 (Composables)

复杂交互组件。

#### AppButton

多功能按钮组件，支持多种变体和状态。

```tsx
import { AppButton } from '@gaozh/rn-ui';

// 基础用法
<AppButton onPress={handlePress}>点击我</AppButton>

// 变体
<AppButton variant="solid">实心按钮</AppButton>
<AppButton variant="outline">描边按钮</AppButton>
<AppButton variant="ghost">幽灵按钮</AppButton>

// 颜色
<AppButton color="primary">主要</AppButton>
<AppButton color="secondary">次要</AppButton>
<AppButton color="danger">危险</AppButton>

// 尺寸
<AppButton size="sm">小</AppButton>
<AppButton size="md">中</AppButton>
<AppButton size="lg">大</AppButton>

// 状态
<AppButton loading>加载中</AppButton>
<AppButton disabled>禁用</AppButton>
```

**属性：**

| 属性        | 类型                                   | 默认值      | 说明       |
| ----------- | -------------------------------------- | ----------- | ---------- |
| `variant`   | `'solid' \| 'outline' \| 'ghost'`      | `'solid'`   | 按钮样式   |
| `size`      | `'sm' \| 'md' \| 'lg'`                 | `'md'`      | 按钮尺寸   |
| `color`     | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | 主题色     |
| `loading`   | `boolean`                              | `false`     | 加载状态   |
| `disabled`  | `boolean`                              | `false`     | 禁用状态   |
| `onPress`   | `() => void`                           | -           | 点击回调   |
| `className` | `string`                               | -           | 自定义类名 |

---

### 💬 反馈组件 (Feedback)

用户反馈相关组件。

#### Toast

轻量级消息提示。

```tsx
import { Toast } from '@gaozh/rn-ui';

// 成功提示
<Toast type="success" message="操作成功" />

// 错误提示
<Toast type="error" message="操作失败" />

// 警告提示
<Toast type="warning" message="请注意" />

// 信息提示
<Toast type="info" message="普通消息" />

// 控制显示
<Toast visible={showToast} type="success" message="保存成功" />
```

**属性：**

| 属性      | 类型                                          | 默认值   | 说明     |
| --------- | --------------------------------------------- | -------- | -------- |
| `message` | `string`                                      | 必填     | 消息内容 |
| `type`    | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | 消息类型 |
| `visible` | `boolean`                                     | `true`   | 是否显示 |

---

#### Alert

对话框组件。

```tsx
import { Alert } from '@gaozh/rn-ui';

<Alert
  title="确认删除"
  message="此操作不可撤销，是否继续？"
  confirmText="删除"
  cancelText="取消"
  onConfirm={() => handleDelete()}
  onCancel={() => setShowAlert(false)}
  visible={showAlert}
/>

// 仅确认按钮
<Alert
  title="提示"
  message="操作已完成"
  confirmText="知道了"
  onConfirm={() => setShowAlert(false)}
/>
```

**属性：**

| 属性          | 类型         | 默认值   | 说明         |
| ------------- | ------------ | -------- | ------------ |
| `title`       | `string`     | 必填     | 标题         |
| `message`     | `string`     | -        | 消息内容     |
| `confirmText` | `string`     | `'确认'` | 确认按钮文字 |
| `cancelText`  | `string`     | `'取消'` | 取消按钮文字 |
| `onConfirm`   | `() => void` | -        | 确认回调     |
| `onCancel`    | `() => void` | -        | 取消回调     |
| `visible`     | `boolean`    | `true`   | 是否显示     |

---

#### Loading

加载指示器。

```tsx
import { Loading } from '@gaozh/rn-ui';

// 简单加载
<Loading />

// 带文字
<Loading text="加载中..." />

// 全屏遮罩
<Loading overlay text="请稍候..." />

// 条件显示
<Loading visible={isLoading} overlay text="提交中..." />
```

**属性：**

| 属性      | 类型      | 默认值  | 说明         |
| --------- | --------- | ------- | ------------ |
| `text`    | `string`  | -       | 加载文字     |
| `overlay` | `boolean` | `false` | 是否显示遮罩 |
| `visible` | `boolean` | `true`  | 是否显示     |

---

### 📊 数据展示 (Components)

#### Card

卡片容器组件，用于包裹内容。

```tsx
import { Card, AppText, AppView } from '@gaozh/rn-ui';

// 基础用法
<Card className="p-4">
  <AppText>卡片内容</AppText>
</Card>

// 自定义样式
<Card className="m-4 p-6 bg-gray-50">
  <AppText size="lg" weight="bold">标题</AppText>
  <AppText className="mt-2 text-gray-600">描述文字</AppText>
</Card>
```

**默认样式：**

- 白色背景 (`bg-white`)
- 圆角 (`rounded-lg`)
- 轻微阴影 (`shadow-sm`)
- 边框 (`border border-gray-200`)

**属性：**

| 属性        | 类型     | 说明       |
| ----------- | -------- | ---------- |
| `className` | `string` | 自定义类名 |

继承 `View` 的所有其他属性。

---

#### Progress

进度条组件。

```tsx
import { Progress } from '@gaozh/rn-ui';

// 基础用法
<Progress value={50} />

// 自定义最大值
<Progress value={3} max={5} />

// 尺寸
<Progress value={50} size="xs" />  // 4px
<Progress value={50} size="sm" />  // 6px
<Progress value={50} size="md" />  // 8px
<Progress value={50} size="lg" />  // 12px
<Progress value={50} size="xl" />  // 16px

// 颜色
<Progress value={50} color="primary" />
<Progress value={50} color="secondary" />
<Progress value={50} color="success" />
<Progress value={50} color="warning" />
<Progress value={50} color="error" />
```

**属性：**

| 属性    | 类型                                                            | 默认值      | 说明   |
| ------- | --------------------------------------------------------------- | ----------- | ------ |
| `value` | `number`                                                        | 必填        | 当前值 |
| `max`   | `number`                                                        | `100`       | 最大值 |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                          | `'md'`      | 尺寸   |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error'` | `'primary'` | 颜色   |

---

## 🎨 主题集成

组件与 `@gaozh/rn-theme` 无缝集成：

```tsx
import { ThemeProvider, createTheme } from '@gaozh/rn-theme';
import { AppView, AppText, AppButton } from '@gaozh/rn-ui';

const theme = createTheme({
  colors: {
    primary: '#f38b32',
    secondary: '#6366f1',
  },
});

function App() {
  return (
    <ThemeProvider light={theme}>
      <AppView flex p={4} className="bg-primary-50">
        <AppText size="xl" weight="bold" className="text-primary-500">
          主题集成示例
        </AppText>
        <AppButton color="primary">主题按钮</AppButton>
      </AppView>
    </ThemeProvider>
  );
}
```

---

## 💡 完整示例

### 登录表单

```tsx
import { useState } from 'react';
import {
  AppView,
  AppText,
  AppInput,
  AppButton,
  Card,
  Col,
  Center,
  ToastUI,
  LoadingUI,
} from '@gaozh/rn-ui';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      await api.login({ email, password });
      setToast({ show: true, message: '登录成功' });
    } catch (err) {
      setToast({ show: true, message: '登录失败' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center flex p={6}>
      <Card className="w-full max-w-md p-6">
        <Col gap={4}>
          <AppText size="2xl" weight="bold" className="text-center">
            欢迎登录
          </AppText>

          <AppInput
            label="邮箱"
            placeholder="请输入邮箱"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            label="密码"
            placeholder="请输入密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton size="lg" loading={loading} onPress={handleLogin}>
            登录
          </AppButton>
        </Col>
      </Card>

      <LoadingUI visible={loading} overlay />

      <Toast visible={toast.show} type="success" message={toast.message} />
    </Center>
  );
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
