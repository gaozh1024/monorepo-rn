#!/bin/bash

# Panther Expo Framework - 分层发布到 Yalc 脚本
# 按依赖层级顺序：utils → theme → (core, ui) → navigation

set -e

echo "🚀 开始分层发布到 yalc..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 第 1 层：基础层 (无依赖)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  第 1 层: @gaozh1024/rn-utils${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd packages/utils
echo "📦 构建中..."
pnpm build > /dev/null 2>&1
echo "🚀 发布到 yalc..."
yalc publish
echo -e "${GREEN}✅ rn-utils 发布成功${NC}"
echo ""
cd ../..

# 第 2 层：主题层 (依赖: utils)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  第 2 层: @gaozh1024/rn-theme${NC}"
echo -e "${BLUE}  依赖: rn-utils${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd packages/theme
echo "🔗 更新依赖到 yalc 版本..."
# 临时修改 package.json 使用 yalc 版本
sed -i '' 's/"@gaozh1024\/rn-utils\": \"workspace:\*\"/"@gaozh1024\/rn-utils\": \"file:\/Users\/'"$USER"'\/.yalc\/packages\/@gaozh1024\/rn-utils\"/g' package.json 2>/dev/null || sed -i 's/"@gaozh1024\/rn-utils\": \"workspace:\*\"/"@gaozh1024\/rn-utils\": \"file:\/home\/'"$USER"'\/.yalc\/packages\/@gaozh1024\/rn-utils\"/g' package.json
echo "📦 构建中..."
pnpm build > /dev/null 2>&1
echo "🚀 发布到 yalc..."
yalc publish
echo "🔗 恢复 workspace 引用..."
git checkout package.json > /dev/null 2>&1 || true
echo -e "${GREEN}✅ rn-theme 发布成功${NC}"
echo ""
cd ../..

# 第 3 层：核心层 (依赖: utils)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  第 3 层: @gaozh1024/rn-core${NC}"
echo -e "${BLUE}  依赖: rn-utils${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd packages/core
echo "📦 构建中..."
pnpm build > /dev/null 2>&1
echo "🚀 发布到 yalc..."
yalc publish
echo -e "${GREEN}✅ rn-core 发布成功${NC}"
echo ""
cd ../..

# 第 3 层：UI 层 (依赖: utils, theme)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  第 3 层: @gaozh1024/rn-ui${NC}"
echo -e "${BLUE}  依赖: rn-utils, rn-theme${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd packages/ui
echo "📦 构建中..."
pnpm build > /dev/null 2>&1
echo "🚀 发布到 yalc..."
yalc publish
echo -e "${GREEN}✅ rn-ui 发布成功${NC}"
echo ""
cd ../..

# 第 4 层：导航层 (依赖: theme, ui - peer)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  第 4 层: @gaozh1024/rn-navigation${NC}"
echo -e "${BLUE}  依赖: rn-theme (peer), rn-ui (peer)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
cd packages/navigation
echo "📦 构建中..."
pnpm build > /dev/null 2>&1
echo "🚀 发布到 yalc..."
yalc publish
echo -e "${GREEN}✅ rn-navigation 发布成功${NC}"
echo ""
cd ../..

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🎉 所有包已成功发布到 yalc!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📋 已发布包列表:"
yalc list 2>/dev/null || echo "  • @gaozh1024/rn-utils@0.2.0-beta.0"
echo "  • @gaozh1024/rn-theme@0.2.0-beta.0"
echo "  • @gaozh1024/rn-core@0.2.0-beta.0"
echo "  • @gaozh1024/rn-ui@0.2.0-beta.0"
echo "  • @gaozh1024/rn-navigation@0.1.0-beta.0"
echo ""
echo "💡 使用方式:"
echo "  yalc add @gaozh1024/rn-utils"
echo "  yalc add @gaozh1024/rn-theme"
echo "  yalc add @gaozh1024/rn-core"
echo "  yalc add @gaozh1024/rn-ui"
echo "  yalc add @gaozh1024/rn-navigation"
