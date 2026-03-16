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
# 克隆仓库（如果是已有项目）
git clone <repository-url> monorepo-rn
cd monorepo-rn

# 或者创建新项目
mkdir monorepo-rn
cd monorepo-rn
```

### 3. 初始化pnpm workspace

```bash
# 初始化package.json
pnpm init

# 创建pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'WORKSPACE'
packages:
  - 'packages/*'
  - 'templates/*'
  - 'examples/*'
WORKSPACE

# 创建.npmrc配置
cat > .npmrc << 'NPMRC'
auto-install-peers=true
shamefully-hoist=true
strict-peer-dependencies=false
NPMRC
```

### 4. 安装根目录依赖

```bash
# 安装开发依赖
pnpm add -D typescript @types/node vitest @vitest/ui

# 安装共享工具
pnpm add -D tsup prettier eslint

# 安装所有包依赖
pnpm install
```

### 5. 初始化各包

```bash
# 为每个包创建package.json并安装依赖

# utils包
pnpm --filter @gaozh1024/rn-utils add clsx tailwind-merge

# theme包
pnpm --filter @gaozh1024/rn-theme add @gaozh1024/rn-utils

# core包
pnpm --filter @gaozh1024/rn-core add zod @tanstack/react-query @gaozh1024/rn-utils

# ui包
pnpm --filter @gaozh1024/rn-ui add nativewind react-native-svg @gaozh1024/rn-utils @gaozh1024/rn-theme
```

### 6. 构建所有包

```bash
# 按依赖顺序构建

# 1. 先构建utils（无依赖）
pnpm --filter @gaozh1024/rn-utils build

# 2. 构建theme（依赖utils）
pnpm --filter @gaozh1024/rn-theme build

# 3. 构建core（依赖utils）
pnpm --filter @gaozh1024/rn-core build

# 4. 构建ui（依赖utils和theme）
pnpm --filter @gaozh1024/rn-ui build

# 或者一键构建所有
pnpm -r build
```

### 7. 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定包测试
pnpm --filter @gaozh1024/rn-utils test

# 运行测试并显示覆盖率
pnpm test:coverage
```

### 8. 本地开发（使用yalc）

```bash
# 1. 安装yalc
npm install -g yalc

# 2. 构建并发布到本地
pnpm --filter @monorepo-rn/utils build
yalc publish packages/utils

pnpm --filter @monorepo-rn/theme build
yalc publish packages/theme

pnpm --filter @monorepo-rn/core build
yalc publish packages/core

pnpm --filter @monorepo-rn/ui build
yalc publish packages/ui

# 3. 在目标项目中使用
yalc add @gaozh1024/rn-utils
yalc add @gaozh1024/rn-theme
yalc add @gaozh1024/rn-core
yalc add @gaozh1024/rn-ui
```

## 常用命令速查

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📦 包管理
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 安装所有依赖
pnpm install

# 添加依赖到特定包
pnpm --filter @gaozh1024/rn-utils add lodash

# 添加开发依赖到根目录
pnpm add -D typescript

# 添加peer依赖
pnpm --filter @gaozh1024/rn-ui add react --save-peer

# 更新所有依赖
pnpm update -r

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🏗️ 构建
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 构建所有包
pnpm -r build

# 构建特定包及其依赖
pnpm --filter @gaozh1024/rn-ui... build

# 监听模式构建
pnpm --filter @gaozh1024/rn-utils dev

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🧪 测试
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 运行所有测试
pnpm -r test

# 运行特定包测试
pnpm --filter @monorepo-rn/utils test

# 监听模式测试
pnpm --filter @gaozh1024/rn-utils test:watch

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔗 本地链接
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 使用yalc本地发布
yalc publish packages/utils

# 在目标项目链接
yalc add @monorepo-rn/utils

# 更新本地包
yalc push packages/utils

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🧹 清理
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 清理所有node_modules
pnpm -r exec rm -rf node_modules
rm -rf node_modules

# 清理所有dist
pnpm -r exec rm -rf dist

# 重新安装
pnpm install

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📊 检查
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# 检查包依赖关系
pnpm list -r

# 检查过时依赖
pnpm outdated -r

# 运行lint
pnpm -r lint

# 运行typecheck
pnpm -r typecheck
```

## 项目结构说明

```
monorepo-rn/
├── package.json              ← 根package.json
├── pnpm-workspace.yaml       ← pnpm工作区配置
├── .npmrc                    ← pnpm配置
├── vitest.config.ts          ← 测试配置
├── tsconfig.base.json        ← 共享tsconfig
├── .gitignore                ← Git忽略
├── SETUP.md                  ← 📖 本文件
├── packages/
│   ├── utils/                ← 工具函数
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   └── src/
│   ├── theme/                ← 主题系统
│   ├── core/                 ← 核心业务
│   │   └── src/
│   │       ├── api/          ← API工厂
│   │       ├── error/        ← 错误处理
│   │       └── storage/      ← 存储封装
│   └── ui/                   ← UI组件
│       └── src/
│           ├── primitives/   ← 原子组件
│           ├── layout/       ← 布局组件
│           ├── feedback/     ← 反馈组件
│           └── components/   ← 其他组件
├── templates/                ← 项目模板
└── examples/                 ← 示例项目
```

## 开发工作流

### 添加新功能

```bash
# 1. 在对应包中开发
vim packages/utils/src/new-feature.ts

# 2. 添加测试
vim packages/utils/src/__tests__/new-feature.test.ts

# 3. 运行测试
pnpm --filter @monorepo-rn/utils test

# 4. 构建
pnpm --filter @monorepo-rn/utils build

# 5. 发布到本地（如果使用yalc）
yalc push packages/utils
```

### 包依赖关系

```
utils ← theme
  ↓
core (依赖utils)
  ↓
ui (依赖utils + theme)
```

构建顺序：utils → theme → core → ui

## 故障排除

### Q: 依赖安装失败？

```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Q: 构建报错找不到依赖？

```bash
# 确保按正确顺序构建
pnpm --filter @monorepo-rn/utils build
pnpm --filter @monorepo-rn/theme build
# ...依此类推
```

### Q: 测试失败？

```bash
# 确保所有依赖已安装
pnpm install

# 重新构建
pnpm -r build

# 运行测试
pnpm test
```

### Q: yalc链接不生效？

```bash
# 重新链接
yalc remove @gaozh1024/rn-utils
yalc add @monorepo-rn/utils

# 或者使用yalc push强制更新
yalc push packages/utils --force
```

## 下一步

1. ✅ 初始化完成
2. 🧪 运行测试确保一切正常
3. 📝 查看架构设计文档了解如何使用
4. 🚀 开始开发或集成到你的项目
