# 📋 .gitignore vs .npmignore 使用指南

## 核心区别

| 特性       | .gitignore       | .npmignore                    |
| ---------- | ---------------- | ----------------------------- |
| **用途**   | 控制Git版本控制  | 控制npm发布内容               |
| **位置**   | 根目录统一管理   | 每个发布包单独配置            |
| **继承**   | 自动应用到子目录 | 仅对当前包生效                |
| **优先级** | -                | 优先于package.json的files字段 |

## 项目结构

```
monorepo-rn/
├── .gitignore                    ← Git忽略（根目录统一）
├── IGNORE_GUIDE.md               ← 📖 本指南
├── packages/
│   └── framework/                ← 统一框架包 @gaozh1024/rn-kit
│       ├── src/                  ← 源代码
│       ├── dist/                 ← 编译输出 ✅发布
│       ├── package.json          ← 包含 files 字段控制发布内容
│       └── README.md
```

## .gitignore（根目录统一）

**作用**：告诉Git哪些文件不应该被版本控制

**包含内容**：

```gitignore
# 依赖
node_modules/

# 构建输出
packages/*/dist/
packages/*/build/

# 测试
coverage/

# 环境变量
.env

# 编辑器
.vscode/
.idea/

# 系统文件
.DS_Store
```

## .npmignore（每个包单独配置）

**作用**：告诉npm publish时哪些文件不应该发布到registry

### @gaozh1024/rn-kit 发布边界

通过 `package.json` 的 `files` 字段控制发布内容：

```json
{
  "name": "@gaozh1024/rn-kit",
  "files": ["dist/", "README.md", "LICENSE"]
}
```

或使用 `.npmignore`：

```gitignore
# 源代码（只发布编译后的dist/）
src/
*.ts
!*.d.ts           # 保留类型定义

# 测试
__tests__/
test/
*.test.ts
*.test.tsx
coverage/

# 配置
vitest.config.ts
tsconfig.json
tsup.config.ts

# 其他
.git/
.gitignore
CHANGELOG.md
```

## 为什么.npmignore需要每个包单独配置？

### 1. 发布粒度不同

```
Git仓库: 整个monorepo一起管理
NPM发布: 每个包独立发布
```

### 2. 需求不同

| 文件         | Git     | NPM                  |
| ------------ | ------- | -------------------- |
| src/         | ✅ 需要 | ❌ 不需要（有dist/） |
| **tests**/   | ✅ 需要 | ❌ 不需要            |
| dist/        | ❌ 忽略 | ✅ 需要              |
| package.json | ✅ 需要 | ✅ 需要              |

### 3. 安全性

```bash
# .npmignore确保不会意外发布敏感文件
.env                    # 密钥
config/private.key      # 私钥
internal-docs/          # 内部文档
```

## package.json 的 files 字段

作为.npmignore的替代方案，可以使用files字段白名单：

```json
{
  "name": "@gaozh1024/rn-kit",
  "files": ["dist/", "README.md", "LICENSE"]
}
```

**优先级**：`files` > `.npmignore` > `.gitignore`

**推荐**：使用 `files` 字段，因为它更简单明确（白名单模式），且与 `.npmignore` 不冲突

## 发布前检查

```bash
# 1. 查看哪些文件会被发布
cd packages/utils
npm publish --dry-run

# 2. 检查包内容
npm pack --dry-run

# 3. 查看实际打包的文件列表
npm pack
tar -tzf *.tgz
```

## 常见错误

### ❌ 错误1：没有.npmignore

```
发布的包包含：
- src/ (源代码)
- __tests__/ (测试)
- coverage/ (覆盖率)
- .env (环境变量！危险！)
```

### ❌ 错误2：根目录配置未生效

```
根目录的.npmignore不会被读取！
需要在每个发布包中通过 files 字段或 .npmignore 控制发布内容
```

### ✅ 正确做法

```
每个包的.npmignore：
- 排除 src/
- 排除 __tests__/
- 排除配置文件
- 保留 dist/ 和 README.md
```

## 快速检查清单

发布前确认：

- [ ] package.json 配置了 files 字段或有 .npmignore
- [ ] 排除了 src/ 和测试文件
- [ ] 排除了敏感文件(.env等)
- [ ] 保留了 dist/ 和必要的类型定义
- [ ] 运行 `npm pack --dry-run` 检查

## 参考

- [npm官方文档 - package.json#files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files)
- [npm官方文档 - npmignore](https://docs.npmjs.com/cli/v8/using-npm/developers#keeping-files-out-of-your-package)
