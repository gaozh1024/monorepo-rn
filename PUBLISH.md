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

## Expo 模板发布

如果要让用户通过 `create-expo-app` 直接创建项目，推荐发布模板包而不是让用户手动复制目录。

### 发布顺序

```bash
# 1. 先发布框架包（模板依赖它）
cd packages/framework
npm publish --tag beta --access public

# 2. 再发布模板包
cd ../../templates/expo-starter
npm publish --access public
```

### 推荐使用方式

```bash
npx create-expo-app@latest my-app --template @gaozh1024/expo-starter
```

### 注意事项

1. 不要使用过于通用的无 scope 包名（例如 `expo-starter`），否则 `--template` 可能命中别人的包
2. 模板包必须是可发布状态，不能保留 `private: true`
3. 模板依赖的 `@gaozh1024/rn-kit` 必须已经发布，否则创建出的项目无法安装依赖
4. 每次升级 Expo SDK 后，都要同步更新模板里的 `expo` 版本并重新发布

## 常见问题

1. **401 Unauthorized**: 需要登录 npm
2. **403 Forbidden**: 包名可能已被占用，或没有发布权限
3. **EPUBLISHCONFLICT**: 版本号已存在，需要更新版本号
