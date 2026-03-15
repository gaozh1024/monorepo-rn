# RN Starter Template

基于 @panther-expo 框架的 React Native 启动模板。

## 特性

- 🚀 **Expo SDK 52** - 最新 Expo 特性
- 📱 **Expo Router v4** - 文件系统路由
- 🎨 **Panther UI** - 基于 Gluestack + NativeWind 的组件库
- 🔄 **React Query** - 服务端状态管理
- 🔒 **安全存储** - 基于 expo-secure-store
- 📝 **TypeScript** - 类型安全
- 🧩 **Feature-based** - 按功能模块组织代码

## 快速开始

```bash
# 使用模板创建项目
npx create-expo-app my-app --template @panther-expo/template-starter

# 或
npx create-expo-app@latest my-app --template @panther-expo/template-starter
```

## 项目结构

```
my-app/
├── app/                    # Expo Router 页面
├── src/
│   ├── features/          # 业务功能模块
│   ├── components/        # 共享组件
│   ├── hooks/             # 共享 Hooks
│   ├── storage/           # 存储封装
│   ├── configs/           # 全局配置
│   └── types/             # 类型定义
├── assets/                # 静态资源
├── package.json
└── README.md
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# iOS
npm run ios

# Android
npm run android
```

## 路由结构

| 路由              | 页面   | 说明          |
| ----------------- | ------ | ------------- |
| `/`               | 入口   | 重定向到 init |
| `/init`           | 初始化 | 检查登录状态  |
| `/login`          | 登录   | 登录页面      |
| `/register`       | 注册   | 注册页面      |
| `/(tabs)`         | 首页   | Tab 导航首页  |
| `/(tabs)/profile` | 我的   | 个人中心      |

## 相关链接

- [Panther Expo 文档](https://github.com/your-org/panther-expo)
- [Expo 文档](https://docs.expo.dev)
- [Gluestack UI](https://gluestack.io)
- [NativeWind](https://www.nativewind.dev)

## License

MIT
