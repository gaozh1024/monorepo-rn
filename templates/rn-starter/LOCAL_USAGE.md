# 本地使用模版指南

## 使用方法

模版已包含所有必要的第三方依赖，开箱即用。只需要链接本地的 `@panther-expo/*` 包即可。

### 1. 在 monorepo 根目录发布包到 yalc

```bash
cd /Users/gzh/Projects/framework/panther-expo

# 发布所有核心包到 yalc
pnpm run yalc:publish
```

### 2. 使用模版创建新项目

```bash
# 创建项目目录
cd ~/Projects
npx create-expo-app my-new-app --template file:/Users/gzh/Projects/framework/panther-expo/templates/rn-starter

cd my-new-app

# 使用 yalc 链接本地包
yalc add @panther-expo/core @panther-expo/theme @panther-expo/ui

# 安装依赖（yalc 不会自动安装 peer dependencies）
npm install

# 启动项目
npm start
```

### 3. 更新本地包

当核心包有更新时：

```bash
# 在 monorepo 根目录
pnpm run yalc:push
```

新项目的依赖会自动同步。

---

## 方法二：直接复制模版（最简单）

适合快速测试，不保持同步。

```bash
# 1. 复制模版目录
cp -r /Users/gzh/Projects/framework/panther-expo/templates/rn-starter ~/Projects/my-new-app
cd ~/Projects/my-new-app

# 2. 删除模版自带的 node_modules
rm -rf node_modules package-lock.json

# 3. 修改 package.json 使用 file: 协议
cat > /tmp/deps_patch.json << 'EOF'
{
  "@panther-expo/core": "file:/Users/gzh/Projects/framework/panther-expo/packages/core",
  "@panther-expo/theme": "file:/Users/gzh/Projects/framework/panther-expo/packages/theme",
  "@panther-expo/ui": "file:/Users/gzh/Projects/framework/panther-expo/packages/ui"
}
EOF

# 4. 安装依赖
pnpm install

# 5. 启动
pnpm start
```

---

## 方法三：打包成 tarball 使用

适合分享给不使用 monorepo 的团队成员。

```bash
# 1. 在 monorepo 中构建并打包
cd /Users/gzh/Projects/framework/panther-expo/packages/core
pnpm pack

cd /Users/gzh/Projects/framework/panther-expo/packages/theme
pnpm pack

cd /Users/gzh/Projects/framework/panther-expo/packages/ui
pnpm pack

# 2. 复制 tarballs 到一个目录
mkdir -p ~/panther-packages
cp /Users/gzh/Projects/framework/panther-expo/packages/*/*.tgz ~/panther-packages/

# 3. 创建项目时使用 tarball
cd ~/Projects/my-new-app
pnpm add ~/panther-packages/panther-expo-core-*.tgz
pnpm add ~/panther-packages/panther-expo-theme-*.tgz
pnpm add ~/panther-packages/panther-expo-ui-*.tgz

pnpm install
pnpm start
```

---

## 依赖说明

模版依赖以下 `@panther-expo` 包：

| 包名                  | 用途                                |
| --------------------- | ----------------------------------- |
| `@panther-expo/ui`    | UI 组件库（Button, Input, Card 等） |
| `@panther-expo/core`  | 核心功能（API, Storage, Query）     |
| `@panther-expo/theme` | 主题系统（颜色、字体）              |

---

## 常见问题

### 1. Metro 找不到包

如果看到错误：`Unable to resolve module @panther-expo/ui`

解决：

```bash
# 清除缓存
pnpm start --reset-cache
# 或
npx expo start --clear
```

### 2. TypeScript 类型错误

```bash
# 在项目根目录创建 types 声明
mkdir -p types
echo "declare module '@panther-expo/ui';" > types/panther.d.ts
echo "declare module '@panther-expo/core/*';" >> types/panther.d.ts
echo "declare module '@panther-expo/theme';" >> types/panther.d.ts
```

### 3. NativeWind 样式不生效

```bash
# 确保安装了 nativewind 依赖
pnpm add nativewind tailwindcss --save-dev

# 清除所有缓存
rm -rf node_modules/.cache
pnpm start --reset-cache
```
