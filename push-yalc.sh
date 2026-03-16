#!/bin/bash

# 修改代码后快速推送到 yalc
# 用法: ./push-yalc.sh [包名]
# 示例: ./push-yalc.sh ui

set -e

push_package() {
    local pkg_path=$1
    local pkg_name=$2
    
    echo "📦 推送 $pkg_name..."
    cd "$pkg_path"
    pnpm build
    yalc push
    echo "   ✅ $pkg_name 已更新"
}

if [ -z "$1" ]; then
    # 推送所有包
    echo "🚀 推送所有包到 yalc..."
    push_package "packages/utils" "utils"
    push_package "packages/theme" "theme"
    push_package "packages/core" "core"
    push_package "packages/ui" "ui"
    push_package "packages/navigation" "navigation"
else
    # 推送指定包
    echo "🚀 推送 $1 到 yalc..."
    push_package "packages/$1" "$1"
fi

echo ""
echo "✅ 推送完成！"
echo "测试项目会自动获取更新"
