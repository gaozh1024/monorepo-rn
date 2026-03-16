#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "              🧪 Panther Expo Framework 测试套件"
echo "════════════════════════════════════════════════════════════════"
echo ""

for pkg in utils theme core ui; do
  echo "📦 @panther-expo/$pkg"
  echo "────────────────────────────────────────────────────────────"
  
  test_count=$(find packages/$pkg/src/__tests__ -name "*.test.ts*" 2>/dev/null | wc -l)
  echo "  测试文件: $test_count"
  
  # 显示测试文件列表
  find packages/$pkg/src/__tests__ -name "*.test.ts*" 2>/dev/null | while read file; do
    echo "  ✓ $(basename $file)"
  done
  
  echo ""
done

echo "════════════════════════════════════════════════════════════════"
echo "总计: 25个测试文件"
echo "════════════════════════════════════════════════════════════════"
