#!/bin/bash

# Panther Expo Framework - 分层发布到 Yalc
# 按依赖层级顺序构建和发布

set -e

echo "🚀 Panther Expo Framework - 分层发布到 Yalc"
echo ""

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 发布函数
publish_package() {
    local pkg=$1
    local name=$2
    local deps=$3
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  📦 $name${NC}"
    if [ -n "$deps" ]; then
        echo -e "${BLUE}  依赖: $deps${NC}"
    fi
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    cd "packages/$pkg"
    
    echo "🔨 构建中..."
    pnpm build > /dev/null 2>&1
    
    echo "🚀 发布到 yalc..."
    yalc publish
    
    cd ../..
    
    echo -e "${GREEN}✅ $name 发布成功${NC}"
    echo ""
}

# 清理旧的 yalc 发布
echo -e "${YELLOW}🧹 清理旧的 yalc 发布...${NC}"
rm -rf ~/.yalc/packages/@gaozh1024/* 2>/dev/null || true
echo ""

# 第 1 层：基础层
publish_package "utils" "@gaozh1024/rn-utils" ""

# 第 2 层：主题层
publish_package "theme" "@gaozh1024/rn-theme" "rn-utils"

# 第 3 层：核心层（并行）
(
    publish_package "core" "@gaozh1024/rn-core" "rn-utils"
) &
CORE_PID=$!

(
    publish_package "ui" "@gaozh1024/rn-ui" "rn-utils, rn-theme"
) &
UI_PID=$!

# 等待第 3 层完成
wait $CORE_PID
wait $UI_PID

# 第 4 层：导航层
publish_package "navigation" "@gaozh1024/rn-navigation" "rn-theme (peer), rn-ui (peer)"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🎉 所有包已成功发布到 yalc!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 已发布包列表:"
echo "  • @gaozh1024/rn-utils@0.2.0-beta.0"
echo "  • @gaozh1024/rn-theme@0.2.0-beta.0"
echo "  • @gaozh1024/rn-core@0.2.0-beta.0"
echo "  • @gaozh1024/rn-ui@0.2.0-beta.0"
echo "  • @gaozh1024/rn-navigation@0.1.0-beta.0"
echo ""
echo "💡 在其他项目中使用:"
echo "  cd your-project"
echo "  yalc add @gaozh1024/rn-utils @gaozh1024/rn-theme @gaozh1024/rn-core @gaozh1024/rn-ui @gaozh1024/rn-navigation"
