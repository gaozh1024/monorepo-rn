#!/bin/bash

# 发布到 yalc 进行本地验证
# 用法: ./publish-yalc.sh

set -e

echo "🚀 发布到 Yalc 本地验证"
echo "========================"

# 检查 yalc
if ! command -v yalc &> /dev/null; then
    echo "❌ 请先安装 yalc: npm i -g yalc"
    exit 1
fi

# 发布函数
yalc_publish() {
    local pkg_path=$1
    local pkg_name=$2
    
    echo ""
    echo "📦 发布 $pkg_name 到 yalc..."
    cd "$pkg_path"
    
    # 构建
    pnpm build
    
    # 发布到 yalc
    yalc publish
    
    echo "   ✅ $pkg_name 已发布到 yalc"
}

# 按依赖顺序发布
yalc_publish "packages/utils" "@gaozh/rn-utils"
yalc_publish "packages/theme" "@gaozh/rn-theme"
yalc_publish "packages/core" "@gaozh/rn-core"
yalc_publish "packages/ui" "@gaozh/rn-ui"
yalc_publish "packages/navigation" "@gaozh/rn-navigation"

echo ""
echo "================================"
echo "✅ 全部发布到 yalc 完成！"
echo ""
echo "在测试项目中安装:"
echo "  cd your-test-project"
echo "  yalc add @gaoh/rn-ui"
echo "  yalc add @gaoh/rn-navigation"
echo ""
echo "更新修改后重新推送:"
echo "  ./push-yalc.sh"
