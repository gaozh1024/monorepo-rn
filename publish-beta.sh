#!/bin/bash
set -e

echo "🚀 发布 @gaozh/* Beta 版本"
echo "=========================="

# 检查登录
npm whoami || (echo "❌ 请先执行 npm login" && exit 1)

cd packages/utils
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != *"beta"* ]]; then
  echo "📦 更新 @gaozh/rn-utils 版本..."
  npm version 0.2.0-beta.0 --no-git-tag-version
fi
echo "📦 发布 @gaozh/rn-utils..."
npm publish --tag beta --access public || echo "⚠️  可能已经发布过"

cd ../theme
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != *"beta"* ]]; then
  echo "📦 更新 @gaozh/rn-theme 版本..."
  npm version 0.2.0-beta.0 --no-git-tag-version
fi
echo "📦 发布 @gaozh/rn-theme..."
npm publish --tag beta --access public || echo "⚠️  可能已经发布过"

cd ../core
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != *"beta"* ]]; then
  echo "📦 更新 @gaozh/rn-core 版本..."
  npm version 0.2.0-beta.0 --no-git-tag-version
fi
echo "📦 发布 @gaozh/rn-core..."
npm publish --tag beta --access public || echo "⚠️  可能已经发布过"

cd ../ui
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != *"beta"* ]]; then
  echo "📦 更新 @gaozh/rn-ui 版本..."
  npm version 0.2.0-beta.0 --no-git-tag-version
fi
echo "📦 发布 @gaozh/rn-ui..."
npm publish --tag beta --access public || echo "⚠️  可能已经发布过"

cd ../navigation
CURRENT_VERSION=$(node -p "require('./package.json').version")
if [[ "$CURRENT_VERSION" != *"beta"* ]]; then
  echo "📦 更新 @gaozh/rn-navigation 版本..."
  npm version 0.1.0-beta.0 --no-git-tag-version
fi
echo "📦 发布 @gaozh/rn-navigation..."
npm publish --tag beta --access public || echo "⚠️  可能已经发布过"

echo ""
echo "✅ 全部发布完成！"
echo ""
echo "安装测试:"
echo "  pnpm add @gaozh/rn-ui@beta @gaozh/rn-navigation@beta"
