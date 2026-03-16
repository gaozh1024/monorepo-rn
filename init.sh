#!/bin/bash

set -e  # 遇到错误立即退出

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 Panther Expo Framework - 快速初始化脚本               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 检查命令是否存在
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# 检查环境
echo "📋 检查环境..."
if ! command_exists pnpm; then
  echo "❌ 未找到pnpm，正在安装..."
  npm install -g pnpm
fi

if ! command_exists node; then
  echo "❌ 未找到Node.js，请先安装"
  exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js版本过低，需要18+"
  exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 安装根目录依赖
echo "📦 安装根目录依赖..."
if [ ! -f "package.json" ]; then
  pnpm init
fi

# 安装开发依赖
pnpm add -D typescript @types/node vitest tsup 2>/dev/null || true

echo "✅ 根目录依赖安装完成"
echo ""

# 确保pnpm-workspace.yaml存在
if [ ! -f "pnpm-workspace.yaml" ]; then
  echo "📝 创建pnpm-workspace.yaml..."
  cat > pnpm-workspace.yaml << 'WORKSPACE'
packages:
  - 'packages/*'
  - 'templates/*'
  - 'examples/*'
WORKSPACE
fi

# 确保.npmrc存在
if [ ! -f ".npmrc" ]; then
  echo "📝 创建.npmrc..."
  cat > .npmrc << 'NPMRC'
auto-install-peers=true
shamefully-hoist=true
strict-peer-dependencies=false
NPMRC
fi

# 为每个包安装依赖
echo "📦 为各包安装依赖..."

# utils
if [ -d "packages/utils" ]; then
  echo "  - @gaozh1024/rn-utils"
  cd packages/utils
  if ! grep -q "clsx" package.json 2>/dev/null; then
    pnpm add clsx tailwind-merge
  fi
  cd ../..
fi

# theme
if [ -d "packages/theme" ]; then
  echo "  - @gaozh1024/rn-theme"
  cd packages/theme
  if ! grep -q "@gaozh1024/rn-utils" package.json 2>/dev/null; then
    pnpm add @gaozh1024/rn-utils
  fi
  cd ../..
fi

# core
if [ -d "packages/core" ]; then
  echo "  - @gaozh1024/rn-core"
  cd packages/core
  if ! grep -q "zod" package.json 2>/dev/null; then
    pnpm add zod @tanstack/react-query @gaozh1024/rn-utils
  fi
  cd ../..
fi

# ui
if [ -d "packages/ui" ]; then
  echo "  - @gaozh1024/rn-ui"
  cd packages/ui
  if ! grep -q "nativewind" package.json 2>/dev/null; then
    pnpm add nativewind react-native-svg @gaozh1024/rn-utils @gaozh1024/rn-theme
  fi
  cd ../..
fi

echo "✅ 各包依赖安装完成"
echo ""

# 构建所有包
echo "🏗️ 构建所有包..."

declare -a BUILD_ORDER=("utils" "theme" "core" "ui")

for pkg in "${BUILD_ORDER[@]}"; do
  if [ -d "packages/$pkg" ]; then
    echo "  构建 @gaozh1024/rn-$pkg..."
    cd "packages/$pkg"
    
    # 确保package.json中有build脚本
    if ! grep -q '"build"' package.json; then
      echo "    添加build脚本..."
      # 使用sed或node修改package.json
      node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.build = 'tsup src/index.ts --format cjs,esm --dts';
        pkg.scripts.dev = 'tsup src/index.ts --format cjs,esm --dts --watch';
        pkg.scripts.test = 'vitest';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
      "
    fi
    
    # 构建
    pnpm build 2>/dev/null || echo "    ⚠️ 构建跳过（可能需要手动检查）"
    cd ../..
  fi
done

echo "✅ 构建完成"
echo ""

# 运行测试
echo "🧪 运行测试..."
pnpm -r test 2>/dev/null || echo "⚠️ 部分测试失败（可能需要手动检查）"
echo ""

# 完成
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                  ✅ 初始化完成！                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 可用命令："
echo "  pnpm install          - 安装所有依赖"
echo "  pnpm -r build         - 构建所有包"
echo "  pnpm -r test          - 运行所有测试"
echo "  pnpm --filter @gaozh1024/rn-utils build"
echo "                        - 构建特定包"
echo ""
echo "📖 查看详细文档：SETUP.md"
echo ""
