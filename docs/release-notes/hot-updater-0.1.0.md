# @gaozh1024/hot-updater 0.1.0 Release Notes

`0.1.0` 将业务项目里已经验证过的 OTA 热更新能力正式迁入框架 monorepo，作为独立可发布包维护。

## Included

- 新增独立包 `@gaozh1024/hot-updater`
- 提供 OTA manifest 判定与版本比较工具
- 提供 `createHotUpdater` / `createOssHotUpdater` 运行时封装
- 提供 `createHotUpdaterContext` 的 Provider / hook 接入方式
- 提供默认启动态与更新态 fallback UI
- 提供本地 OTA 发布辅助脚本：
  - `scripts/prepare-release.mjs`
  - `scripts/build-manifest.mjs`
  - `scripts/print-file-meta.mjs`

## Verification

- `pnpm --dir packages/hot-updater typecheck`
- `pnpm --dir packages/hot-updater build`

## Published Artifacts

- `@gaozh1024/hot-updater`：`0.1.0`
