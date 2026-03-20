# Expo Starter

基于 `@gaozh1024/rn-kit` 的 React Native 项目模板。

## 通过 create-expo-app 创建项目

推荐使用带 scope 的包名发布模板，避免 `expo-starter` 这类通用包名和 npm 上已有包冲突：

```bash
npx create-expo-app@latest my-app --template @gaozh1024/expo-starter
```

> 如果你发布后仍使用 `--template expo-starter`，create-expo-app 解析到的可能不是你的模板包。

## 特性

- ✅ Provider 初始化顺序固定，开箱可跑
- ✅ 目录层级稳定，职责清晰
- ✅ 首版页面覆盖基础产品能力
- ✅ 结构不过度设计，后续可自然扩展
- ✅ 内置 11 个基础页面
- ✅ Mock 数据支持，无需后端即可开发
- ✅ 内置 Logo 图片资源与应用图标配置
- ✅ 已内置 `expo-linear-gradient`，可直接使用 `GradientView`
- ✅ 已内置 `@expo/vector-icons`，可稳定使用框架 `Icon`

## 页面列表

| 页面           | 路径                                             | 说明                       |
| -------------- | ------------------------------------------------ | -------------------------- |
| Launch         | `features/launch/screens/LaunchScreen.tsx`       | 启动页，自动跳转登录或首页 |
| Login          | `features/auth/screens/LoginScreen.tsx`          | 登录页                     |
| Register       | `features/auth/screens/RegisterScreen.tsx`       | 注册页                     |
| ForgotPassword | `features/auth/screens/ForgotPasswordScreen.tsx` | 找回密码                   |
| Home           | `features/home/screens/HomeScreen.tsx`           | 首页                       |
| My             | `features/profile/screens/MyScreen.tsx`          | 我的页面                   |
| UserInfo       | `features/profile/screens/UserInfoScreen.tsx`    | 用户信息                   |
| Settings       | `features/profile/screens/SettingsScreen.tsx`    | 设置中心                   |
| Theme          | `features/profile/screens/ThemeScreen.tsx`       | 主题切换                   |
| Language       | `features/profile/screens/LanguageScreen.tsx`    | 语言切换                   |
| About          | `features/profile/screens/AboutScreen.tsx`       | 关于我们                   |

## 目录结构

```
expo-starter/
├── App.tsx                       # Expo 入口
├── src/
│   ├── app/                      # 应用级装配代码
│   │   ├── RootApp.tsx           # 根应用，启动流程控制
│   │   └── providers.tsx         # 统一 Provider 配置
│   ├── bootstrap/                # 启动配置层
│   │   ├── app-config.ts         # 应用配置
│   │   ├── theme.ts              # 主题配置
│   │   └── constants.ts          # 常量定义
│   ├── navigation/               # 导航定义
│   │   ├── RootNavigator.tsx     # 根导航器
│   │   ├── AuthStack.tsx         # 认证导航栈
│   │   ├── MainTabs.tsx          # 主 Tab 导航
│   │   ├── MyStack.tsx           # 我的页面栈
│   │   ├── routes.ts             # 路由常量
│   │   └── types.ts              # 导航类型
│   ├── features/                 # 业务域
│   │   ├── launch/               # 启动
│   │   ├── auth/                 # 认证
│   │   ├── home/                 # 首页
│   │   └── profile/              # 个人中心
│   ├── components/               # 公共组件
│   │   └── common/               # 通用组件
│   ├── data/                     # 数据层
│   │   ├── api.ts                # API 工厂
│   │   ├── schemas.ts            # 数据 Schema
│   │   ├── session.ts            # Session 管理
│   │   └── mocks/                # Mock 数据
│   ├── store/                    # 全局状态
│   │   ├── session.store.ts      # 登录态
│   │   └── ui.store.ts           # UI 状态
│   ├── utils/                    # 工具函数
│   └── types/                    # 类型定义
├── global.css                    # 全局样式
├── tailwind.config.js            # Tailwind 配置
├── babel.config.js               # Babel 配置
├── metro.config.js               # Metro 配置
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npx expo start
```

## 本地测试模板

推荐在模板发布前，先走一遍本地安装链路验证。

### 1. 用本地模板创建项目

```bash
npx create-expo-app template-app --template file:/absolute/path/to/templates/expo-starter
```

例如：

```bash
npx create-expo-app template-app --template file:/Users/gzh/Projects/framework/rn-monorepo/templates/expo-starter
```

### 2. 注入本地 rn-kit

如果你正在联调本地框架，可以在新项目中执行：

```bash
yalc add @gaozh1024/rn-kit
npm install
```

然后启动：

```bash
yarn start
# 或
npx expo start
```

这个流程适合验证：

- 模板能否被 `create-expo-app` 正常消费
- 本地 `rn-kit` 改动能否正确注入模板项目
- 页面、导航、状态栏、底部 Tab 是否都正常工作
- 渐变背景页面是否正常显示

## 发布前检查

1. 先发布 `@gaozh1024/rn-kit`
2. 再发布当前模板包
3. 确认 `app.json` 中的 `icon / splash / adaptiveIcon / favicon` 对应资源都已打包
4. 确认模板里的 `expo` 版本和你希望支持的 Expo Go SDK 一致
5. 确认 README 中的模板包名、scope 包名、安装命令与实际发布信息一致
6. 确认 `app.json` 里的 `name / slug / scheme / ios.bundleIdentifier / android.package` 是否为你希望交付给模板使用者的默认值

### 运行到设备

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android
```

## 开发指南

### 页面实现约定

模板页面默认优先使用 `rn-kit` 提供的组件与能力：

- 布局：`AppView` / `Center` / `SafeScreen` / `AppScrollView`
- 展示：`AppText` / `Card` / `Icon`
- 交互：`AppButton` / `AppPressable`
- 反馈：`Loading` / `useAlert`
- 状态栏：`AppStatusBar` / `AppFocusedStatusBar`
- 导航：`StackNavigator` / `TabNavigator` / `useNavigation`

页面层尽量不要直接从 `react-native` 或 `@react-navigation/*` 引入基础 UI / 导航能力，优先使用 `rn-kit` 暴露的统一 API。

带 `AppHeader` 的页面通常不需要单独处理状态栏：

- `AppHeader` 会自动注入聚焦态透明状态栏
- 顶部状态栏区域会直接显示 Header 的背景色

例如登录页、启动页这类全屏彩色背景页面，推荐在页面内局部覆盖状态栏：

```tsx
<>
  <AppFocusedStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
  <GradientView colors={['#f38b32', '#fb923c']} style={{ flex: 1 }}>
    <SafeScreen flex top={false}>
      {/* 页面内容 */}
    </SafeScreen>
  </GradientView>
</>
```

模板已经预装 `expo-linear-gradient`，因此可以直接使用框架导出的 `GradientView`。

### 主题切换说明

模板已改为通过 `AppProvider isDark` 受控切换主题，切换浅色 / 深色 / 跟随系统时不再依赖重新挂载根组件。

页面实现上优先使用这些主题语义能力：

- 容器背景：`surface="background"` / `surface="card"`
- 文本颜色：`tone="default"` / `tone="muted"` / `color="primary-500"`
- 页面容器：`SafeScreen` / `AppView` / `AppScrollView`

如果页面里直接写死 `bg-white`、`text-gray-700` 这类类名，暗色模式下通常就不会自动跟随主题。

### 底部导航栏

模板中的 `MainTabs` 默认使用 `rn-kit` 内置的 `BottomTabBar`，通过 `tabBarOptions` 统一配置高度、颜色和样式：

```tsx
<TabNavigator
  tabBarOptions={{
    activeTintColor: '#f38b32',
    inactiveTintColor: '#9ca3af',
    activeBackgroundColor: '#fff7ed',
    height: 72,
    style: { borderTopWidth: 0, backgroundColor: '#ffffff' },
  }}
>
  {/* screens */}
</TabNavigator>
```

### 导航类型约定

模板导航相关代码集中在：

- `src/navigation/types.ts`：参数列表与导航类型别名
- `src/navigation/routes.ts`：路由名称常量
- `src/navigation/*.tsx`：基于 `rn-kit` 的导航器装配

推荐页面内这样写：

```tsx
import { useNavigation } from '@gaozh1024/rn-kit';
import type { AuthNavigationProp } from '@/navigation/types';

export function LoginScreen() {
  const navigation = useNavigation<AuthNavigationProp>();

  return null;
}
```

这样页面只依赖：

- `rn-kit` 提供的导航 hook
- 模板自己的导航类型文件

不会直接耦合 `@react-navigation/native` 或 `@react-navigation/stack`。

### 添加新页面

1. 在 `src/features/{domain}/screens/` 创建页面组件
2. 在 `src/navigation/types.ts` 添加路由参数类型
3. 如有需要，在 `src/navigation/types.ts` 增加页面对应的导航类型别名
4. 在对应导航组件中注册页面

### 添加新 API

1. 在对应 feature 的 `api.ts` 中定义端点
2. 在 `src/data/schemas.ts` 中定义输入输出 Schema
3. 在 `src/data/mocks/` 中添加 Mock 数据（如需要）

### 组件放置规则

- **页面私有组件**：放在页面文件附近
- **业务域内复用组件**：放在 `features/{domain}/components/`
- **跨业务域复用组件**：放在 `components/common/`

## 技术栈

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev/)
- [@gaozh1024/rn-kit](https://github.com/gaozh1024/rn-kit)

## 许可证

MIT
