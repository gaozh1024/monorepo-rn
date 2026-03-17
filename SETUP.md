# 🚀 Panther Expo Framework - 初始化指南

## 快速开始

### 1. 环境要求

```bash
# 检查Node版本（需要18+）
node --version  # v18.0.0+

# 检查pnpm（需要8+）
pnpm --version  # 8.0.0+

# 如果没有pnpm，安装它
npm install -g pnpm
```

### 2. 克隆/创建项目

```bash
# 克隆仓库
git clone <repository-url> monorepo-rn
cd monorepo-rn

# 安装依赖
pnpm install
```

### 3. 构建框架

```bash
# 构建统一框架包
pnpm --filter @gaozh1024/rn-kit build

# 或者构建所有
pnpm -r build
```

### 4. 本地开发（使用yalc）

```bash
# 安装yalc
npm install -g yalc

# 发布到本地yalc
pnpm yalc:publish

# 在测试项目中使用
cd your-test-project
yalc add @gaozh1024/rn-kit
```

## 在项目中使用

### 安装

```bash
npm install @gaozh1024/rn-kit
# 或
pnpm add @gaozh1024/rn-kit
```

### 前置依赖

```bash
npm install react react-native
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-svg
```

### 基础用法

```tsx
import { ThemeProvider, createTheme, AppView, AppText, AppButton } from '@gaozh1024/rn-kit';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

function App() {
  return (
    <ThemeProvider light={theme}>
      <AppView flex p={4}>
        <AppText size="xl">Hello Panther!</AppText>
        <AppButton>点击我</AppButton>
      </AppView>
    </ThemeProvider>
  );
}
```

## 开发命令速查

```bash
# 构建
pnpm -r build

# 开发模式（热更新）
pnpm --filter @gaozh1024/rn-kit dev

# 运行测试
pnpm -r test

# 发布到yalc
pnpm yalc:publish

# 推送更新到yalc
pnpm yalc:push
```

## 项目结构

```
monorepo-rn/
├── packages/
│   └── framework/          # 统一框架包
│       ├── src/
│       │   ├── utils/      # 工具函数
│       │   ├── theme/      # 主题系统
│       │   ├── core/       # 核心业务
│       │   ├── ui/         # UI组件
│       │   └── navigation/ # 导航组件
│       └── package.json
├── docs/                   # 文档
└── package.json
```

## 故障排除

### Q: 依赖安装失败？

```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Q: 构建报错？

```bash
# 确保先安装依赖
pnpm install

# 重新构建
pnpm -r build
```

### Q: yalc链接不生效？

```bash
# 重新链接
yalc remove @gaozh1024/rn-kit
yalc add @gaozh1024/rn-kit
```
