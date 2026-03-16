# Beta 版本发布指南

## 快速发布

```bash
# 1. 登录 npm
npm login

# 2. 运行发布脚本
./scripts/publish-beta.sh
```

## 手动逐步发布

如果脚本执行失败，可以手动发布：

### 1. 发布 @gaozh1024/rn-utils

```bash
cd packages/utils
npm version 0.2.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

### 2. 发布 @gaozh1024/rn-theme

```bash
cd packages/theme
npm version 0.2.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

### 3. 发布 @gaozh1024/rn-core

```bash
cd packages/core
npm version 0.2.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

### 4. 发布 @gaozh1024/rn-ui

```bash
cd packages/ui
npm version 0.2.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

### 5. 发布 @gaozh1024/rn-navigation

```bash
cd packages/navigation
npm version 0.1.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

## 验证发布

```bash
# 查看已发布的版本
npm view @gaozh1024/rn-ui versions --json | grep beta

# 安装测试
pnpm add @gaozh1024/rn-ui@beta @gaozh1024/rn-navigation@beta
```

## 发布后升级正式版

```bash
# 删除 beta 标签
npm dist-tag rm @gaozh1024/rn-ui beta

# 或者发布正式版
npm version 0.2.0
npm publish --access public
```

## 常见问题

1. **401 Unauthorized**: 需要登录 npm
2. **403 Forbidden**: 包名可能已被占用，或没有发布权限
3. **EPUBLISHCONFLICT**: 版本号已存在，需要更新版本号
