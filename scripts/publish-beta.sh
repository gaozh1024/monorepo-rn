#!/bin/bash

# Panther Expo Framework Beta 发布脚本
# 使用: ./scripts/publish-beta.sh

set -e

echo "🚀 Panther Expo Framework Beta 发布"
echo "====================================="

# 检查 npm 登录状态
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 未登录 npm，请先执行: npm login"
    exit 1
fi

echo "✅ 已登录 npm: $(npm whoami)"

# 确保构建成功
echo ""
echo "📦 步骤 1/6: 构建所有包..."
pnpm -r build

# 发布函数
publish_package() {
    local pkg_path=$1
    local pkg_name=$2
    
    echo ""
    echo "📦 发布 $pkg_name..."
    cd "$pkg_path"
    
    # 检查当前版本
    local current_version=$(node -p "require('./package.json').version")
    echo "   当前版本: $current_version"
    
    # 更新为 beta 版本
    npm version prerelease --preid=beta --no-git-tag-version
    
    local new_version=$(node -p "require('./package.json').version")
    echo "   新版本: $new_version"
    
    # 发布
    npm publish --tag beta --access public
    
    echo "   ✅ $pkg_name@$new_version 已发布"
}

# 按依赖顺序发布
publish_package "packages/utils" "@gaozh1024/rn-utils"
publish_package "packages/theme" "@gaozh1024/rn-theme"
publish_package "packages/core" "@gaozh1024/rn-core"
publish_package "packages/ui" "@gaozh1024/rn-ui"
publish_package "packages/navigation" "@gaozh1024/rn-navigation"

echo ""
echo "====================================="
echo "🎉 所有 Beta 版本发布完成！"
echo ""
echo "安装方式:"
echo "  pnpm add @gaozh1024/rn-ui@beta"
echo "  pnpm add @gaozh1024/rn-navigation@beta"
