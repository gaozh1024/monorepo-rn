# 仓库瘦身清单

## 目标

为当前仓库建立一份可执行的瘦身清单，优先解决以下问题：

- 仓库形态与实际规模不匹配
- 发布包边界过宽
- 模板遗留文件和过期文档持续增加维护成本
- 模块边界和测试投入不均衡

当前判断：仓库现状更接近“单包库 + monorepo 壳”，核心工作包是 `packages/framework`。

## 执行原则

- 先收口仓库边界，再做内部重构
- 先处理高风险发布问题，再处理整洁度问题
- 先删除确认无用的模板遗留，再调整仍在使用的结构
- 所有删除动作都应先经过 `rg` / `git ls-files` / `npm pack --dry-run` 验证

## P0：立即处理

### 1. 收紧 npm 发布边界

目标：避免发布 `src/`、测试文件、测试别名文件、构建配置。

动作：

- 在 `packages/framework/package.json` 添加 `files`
- 在 `packages/framework/package.json` 添加 `exports`
- 视兼容策略决定是否添加 `react-native` 入口字段
- 在变更后执行 `npm pack --dry-run` 验证产物

验收标准：

- 发布内容只包含 `dist/`、`README.md`、`package.json` 和必要许可证文件
- 不再包含 `src/`
- 不再包含 `__tests__/`
- 不再包含 `test/`
- 不再包含 `tsconfig.json`、`vitest.config.ts`、`tsup.config.ts`

备注：这是当前最高优先级问题。

### 2. 确认并清理根级废配置

候选文件：

- `tsup.config.ts`
- `vitest.config.ts`
- `run-tests.sh`

处理建议：

- 删除未被脚本、CI、开发流程消费的文件
- 若仍需保留，必须补充明确使用入口并修正文档

重点说明：

- `tsup.config.ts` 当前指向根目录不存在的 `src/index.ts`
- `run-tests.sh` 仍按旧的多包结构统计测试，已不符合当前仓库

### 3. 修正文档中的失效路径和旧结构描述

需要修正的内容：

- 根 README 中不存在的 `init.sh`
- `packages/framework/README.md` 中不存在的 `docs/design`
- `IGNORE_GUIDE.md` 中旧的 `packages/utils/theme/core/ui` 结构
- `.gitignore.strategy.md` 中旧的多包结构说明

验收标准：

- 文档中的目录树与当前仓库一致
- 文档中的链接全部可打开
- 不再描述当前不存在的工作包

## P1：本轮瘦身建议处理

### 4. 收口 monorepo 壳

当前现状：

- 工作区声明了 `packages/*`
- 同时还声明了 `templates/*`、`examples/*`
- 但仓库中当前没有 `templates` 和 `examples`

二选一策略：

1. 单包收口

- 保留 `packages/*`
- 删除 `templates/*`、`examples/*` 的 workspace 声明
- 调整 README 中对 monorepo 的叙述，承认当前是单核心包阶段

2. 做实 monorepo

- 新增真实的 `examples/` 和 `templates/`
- 为其补充脚本、文档、CI 规则

建议：如果未来 1 到 2 个迭代内不会落地示例或模板，优先选择单包收口。

### 5. 清理根依赖中的模板遗留

建议复核的根级依赖：

- `@expo/cli`
- `@testing-library/jest-native`
- `@vitest/coverage-v8`
- `metro`
- `metro-babel-transformer`
- `metro-cache`
- `metro-config`
- `metro-resolver`
- `metro-runtime`
- `metro-source-map`
- `metro-symbolicate`
- `metro-transform-worker`
- `msw`

处理方法：

- 先确认是否被 CI、脚本、本地开发流程真实消费
- 没有使用的依赖移除
- 若只是未来预留，转为 issue 或 roadmap，不留在当前依赖面

收益：

- 缩短安装时间
- 降低 lockfile 噪音
- 降低 CI 维护成本

### 6. 规范测试辅助文件归属

当前现状：

- 根目录存在大型测试基建文件 `test-setup.ts`
- `packages/framework/vitest.config.ts` 依赖 `packages/framework/test/*` 别名文件

建议：

- 若测试只服务 `packages/framework`，将测试 setup 下沉到包内
- 明确 `packages/framework/test/` 属于正式测试基建，而非临时文件
- 确保这些文件被 Git 正常跟踪

验收标准：

- 干净 checkout 后可直接执行测试
- 包级测试资源尽量包内闭环

## P2：结构优化

### 7. 缩小公共 API 暴露面

当前问题：

- 根入口直接 `export *` 整个 `utils/theme/core/ui/navigation/overlay`
- `core/index.ts` 还二次导出 `zod` 与 `@tanstack/react-query`

建议：

- 设计明确的公共 API 清单
- 减少星号导出
- 为 `ui`、`theme`、`core`、`navigation` 设计子入口
- 谨慎评估是否继续二次导出三方库

目标：

- 减少 breaking change 面积
- 降低内部目录结构对外泄漏
- 为未来拆包预留空间

### 8. 重整 `core` 目录职责

当前问题：

- `useAsyncState` 位于 `core/error/hooks.ts`
- 但其职责更接近通用异步状态 Hook

建议：

- 将通用 Hook 移回 `core/hooks`
- 保持“目录名 = 职责”的一致性
- 将错误增强逻辑留在 `error`

### 9. 拆分大文件

优先候选：

- `packages/framework/src/overlay/OverlayHost.tsx`
- `packages/framework/src/navigation/types.ts`
- `packages/framework/src/navigation/hooks/useNavigation.ts`

建议方向：

- `OverlayHost.tsx` 按 loading / toast / alert / provider / hooks 拆分
- `navigation/types.ts` 按 screen options / navigator props / route types 拆分
- 让目录结构体现子域边界

### 10. 调整测试投入分布

当前观察：

- `utils` 测试覆盖相对充分
- `navigation` 测试明显偏少
- `overlay` 暂无测试

建议优先补测：

- `OverlayProvider`
- `useLoading` / `useToast` / `useAlert`
- `StackNavigator` / `TabNavigator` / `DrawerNavigator` 的关键装配行为
- `AppProvider` 的集成行为

## 可删除候选清单

以下文件为高优先级复核对象：

- `tsup.config.ts`
- `vitest.config.ts`
- `run-tests.sh`
- `packages/framework/src/navigation/global.d.ts`

以下文件不是“无用文件”，但需要内容重写或降级：

- `README.md`
- `packages/framework/README.md`
- `IGNORE_GUIDE.md`
- `.gitignore.strategy.md`

以下文件目前不建议直接删除：

- `packages/framework/src/ui/types/nativewind.d.ts`
- `packages/framework/src/ui/types/vector-icons.d.ts`

原因：这两个更像 ambient type 声明文件，虽然不在源码 import 图中，但可能被 TypeScript 编译上下文消费。

## 建议执行顺序

1. 修正发布边界
2. 清理根级废配置和旧脚本
3. 修正文档失效内容
4. 收口 monorepo workspace 声明
5. 清理根依赖遗留
6. 下沉并整理测试基建
7. 收缩公共 API
8. 重整 `core` 分层
9. 拆分大文件并补测试

## 验证清单

每完成一批瘦身动作，至少执行以下验证：

- `pnpm -r typecheck`
- `pnpm -r test`
- `pnpm --filter @gaozh1024/rn-kit build`
- `npm pack --dry-run`

## 备注

建议把本清单当作阶段性治理文档，而不是一次性任务。适合拆成 2 到 3 个 PR：

- PR 1：发布边界 + 文档修复
- PR 2：仓库壳收口 + 依赖清理
- PR 3：模块重构 + 测试补强
