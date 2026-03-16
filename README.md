# 🐆 Panther Expo Framework

> 快速开发 React Native 应用的前端框架

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ 特性

- 🎨 **主题系统** - 自动生成色阶，支持明暗主题切换
- 🔌 **API 工厂** - 声明式 API 配置，Zod 类型安全
- 🧩 **原子组件** - 灵活的 UI 组件系统
- 🛡️ **错误处理** - 统一的错误分类和处理
- 📝 **TypeScript** - 完整的类型支持
- 🧪 **测试覆盖** - 全面的单元测试

## 📦 包结构

| 包名                                    | 描述       | 版本  |
| --------------------------------------- | ---------- | ----- |
| [@gaozh1024/rn-utils](./packages/utils) | 工具函数库 | 0.1.0 |
| [@gaozh1024/rn-theme](./packages/theme) | 主题系统   | 0.1.0 |
| [@gaozh1024/rn-core](./packages/core)   | 核心业务   | 0.1.0 |
| [@gaozh1024/rn-ui](./packages/ui)       | UI 组件库  | 0.1.0 |

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd panther-expo

# 一键初始化
./init.sh
```

### 使用

```tsx
import { ThemeProvider, createTheme } from '@gaozh1024/rn-theme';
import { createAPI } from '@gaozh1024/rn-core';
import { AppView, AppText, AppButton } from '@gaozh1024/rn-ui';

// 创建主题
const theme = createTheme({
  colors: {
    primary: '#f38b32',
  },
});

// 创建 API
const api = createAPI({
  baseURL: 'https://api.example.com',
  endpoints: {
    getUser: {
      method: 'GET',
      path: '/users/:id',
    },
  },
});

// 使用组件
function App() {
  return (
    <ThemeProvider light={theme}>
      <AppView flex p={4}>
        <AppText size="lg">Hello Panther!</AppText>
        <AppButton onPress={() => api.getUser({ id: '1' })}>获取用户</AppButton>
      </AppView>
    </ThemeProvider>
  );
}
```

## 📚 文档

- [架构设计文档](./docs/架构设计-v2-实战版.md)
- [初始化指南](./SETUP.md)
- [Ignore 配置指南](./IGNORE_GUIDE.md)

### 包文档

- [@gaozh1024/rn-utils](./packages/utils/README.md) - 工具函数
- [@gaozh1024/rn-theme](./packages/theme/README.md) - 主题系统
- [@gaozh1024/rn-core](./packages/core/README.md) - 核心业务
- [@gaozh1024/rn-ui](./packages/ui/README.md) - UI 组件

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm -r build

# 运行测试
pnpm -r test

# 开发模式
pnpm --filter @gaozh1024/rn-ui dev
```

## 🧪 测试

```bash
# 运行所有测试
pnpm -r test

# 运行特定包测试
pnpm --filter @gaozh1024/rn-utils test

# 查看覆盖率
pnpm -r test:coverage
```

## 📁 项目结构

```
panther-expo/
├── packages/
│   ├── utils/          # 工具函数
│   ├── theme/          # 主题系统
│   ├── core/           # 核心业务
│   └── ui/             # UI 组件
├── docs/               # 文档
├── templates/          # 项目模板
├── examples/           # 示例项目
├── init.sh             # 初始化脚本
└── README.md           # 本文件
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
