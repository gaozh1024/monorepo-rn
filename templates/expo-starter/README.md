# Expo Starter

基于 `@gaozh1024/rn-kit` 的 React Native 项目模板。

## 特性

- ✅ Provider 初始化顺序固定，开箱可跑
- ✅ 目录层级稳定，职责清晰
- ✅ 首版页面覆盖基础产品能力
- ✅ 结构不过度设计，后续可自然扩展
- ✅ 内置 11 个基础页面
- ✅ Mock 数据支持，无需后端即可开发
- ✅ 内置 Logo 组件，无需外部图片资源

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
├── app/                          # Expo 入口
│   └── _layout.tsx               # 根布局，导入 reanimated 和 global.css
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

### 运行到设备

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 开发指南

### 添加新页面

1. 在 `src/features/{domain}/screens/` 创建页面组件
2. 在 `src/navigation/types.ts` 添加路由参数类型
3. 在对应导航组件中注册页面

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
