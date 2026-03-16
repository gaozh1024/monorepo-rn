#!/bin/bash

# 修改包名脚本
# 用法: ./scripts/rename-packages.sh <新前缀>
# 示例: ./scripts/rename-packages.sh @myname

NEW_PREFIX=$1

if [ -z "$NEW_PREFIX" ]; then
    echo "❌ 请提供新的包名前缀"
    echo "用法: ./scripts/rename-packages.sh @myname"
    echo "   或: ./scripts/rename-packages.sh myname"
    exit 1
fi

echo "📝 修改包名为: $NEW_PREFIX/*"

# 确保前缀有 @
if [[ ! $NEW_PREFIX == @* ]]; then
    NEW_PREFIX="@$NEW_PREFIX"
fi

# 移除 @ 用于文件夹名
FOLDER_PREFIX=$(echo $NEW_PREFIX | sed 's/@//')

# 修改所有 package.json
for pkg in packages/*/package.json; do
    OLD_NAME=$(grep '"name"' "$pkg" | head -1 | cut -d'"' -f4)
    PKG_SHORT=$(echo $OLD_NAME | sed 's/@[^/]*\///')
    NEW_NAME="$NEW_PREFIX/$PKG_SHORT"
    
    echo "  $OLD_NAME → $NEW_NAME"
    
    # macOS 和 Linux 兼容的 sed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|\"$OLD_NAME\"|\"$NEW_NAME\"|g" "$pkg"
    else
        sed -i "s|\"$OLD_NAME\"|\"$NEW_NAME\"|g" "$pkg"
    fi
done

# 修改内部依赖引用
for file in packages/*/package.json packages/*/tsup.config.ts packages/*/src/**/*.ts packages/*/src/**/*.tsx 2>/dev/null; do
    if [ -f "$file" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' 's|@gaozh1024/|'$NEW_PREFIX'/|g' "$file" 2>/dev/null || true
        else
            sed -i 's|@gaozh1024/|'$NEW_PREFIX'/|g' "$file" 2>/dev/null || true
        fi
    fi
done

echo "✅ 包名修改完成"
echo ""
echo "请重新构建并发布:"
echo "  pnpm -r build"
echo "  ./scripts/publish-beta.sh"
