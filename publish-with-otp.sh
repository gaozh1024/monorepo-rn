#!/bin/bash

# 使用说明：
# ./publish-with-otp.sh <你的OTP码>
# 例如：./publish-with-otp.sh 123456

OTP=$1

if [ -z "$OTP" ]; then
  echo "❌ 请提供 OTP 验证码"
  echo "用法: ./publish-with-otp.sh 123456"
  echo ""
  echo "从你的认证器应用（Google Authenticator/Authy）获取 OTP"
  exit 1
fi

echo "🚀 使用 OTP: $OTP 发布 Beta 版本"
echo "================================"

cd packages/utils
echo "📦 发布 @gaozh/rn-utils..."
npm publish --tag beta --access public --otp=$OTP

cd ../theme
echo "📦 发布 @gaozh/rn-theme..."
npm publish --tag beta --access public --otp=$OTP

cd ../core
echo "📦 发布 @gaozh/rn-core..."
npm publish --tag beta --access public --otp=$OTP

cd ../ui
echo "📦 发布 @gaozh/rn-ui..."
npm publish --tag beta --access public --otp=$OTP

cd ../navigation
echo "📦 发布 @gaozh/rn-navigation..."
npm publish --tag beta --access public --otp=$OTP

echo ""
echo "✅ 发布完成！"
