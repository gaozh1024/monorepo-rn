# Beta 版本发布指南

## 快速发布

```bash
# 1. 登录 npm
npm login

# 2. 构建并发布
pnpm -r build
cd packages/framework
npm publish --tag beta --access public
```

## 手动发布

### 1. 构建

```bash
# 构建框架包
pnpm --filter @gaozh1024/rn-kit build
```

### 2. 发布

```bash
cd packages/framework
npm version 0.2.0-beta.0 --no-git-tag-version
npm publish --tag beta --access public
```

## 验证发布

```bash
# 查看已发布的版本
npm view @gaozh1024/rn-kit versions --json | grep beta

# 安装测试
pnpm add @gaozh1024/rn-kit@beta
```

## 发布后升级正式版

```bash
# 删除 beta 标签
npm dist-tag rm @gaozh1024/rn-kit beta

# 或者发布正式版
npm version 0.2.0
npm publish --access public
```

## Yalc 本地发布

```bash
# 发布到本地 yalc
pnpm yalc:publish

# 推送到已链接的项目
pnpm yalc:push
```

## 常见问题

1. **401 Unauthorized**: 需要登录 npm
2. **403 Forbidden**: 包名可能已被占用，或没有发布权限
3. **EPUBLISHCONFLICT**: 版本号已存在，需要更新版本号
