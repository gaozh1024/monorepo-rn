# @gaozh1024/hot-updater 0.1.1 Release Notes

`0.1.1` 是一次 OTA 热更新包的发布前加固版本，重点修复 manifest 下线语义、启动检查重试和文档可执行性。

## Included

- `release.disabled: true` 现在会被客户端识别为“不下发更新”，可用于临时暂停异常 OTA。
- `release.force` 缺省时按 `false` 处理，避免畸形 manifest 被误判为强更。
- `startLaunchUpdateCheck()` 在启动检查返回 error 或抛错后允许再次重试。
- 新增 manifest 判定与 Provider 启动重试回归测试。
- `build-manifest.mjs` 支持写入 `--disabled true`。
- 文档明确 `hotUpdater.wrapApp(App)` 是底层 resolver 注册的必需步骤。
- 发布脚本文档补充业务项目 `ota:*` scripts 配置与直接 `node node_modules/...` 执行方式。
- AI 使用文档、AI manifest 与 Android/iOS 原生接入边界同步更新。

## Verification

- `pnpm --dir packages/hot-updater test`
- `pnpm --dir packages/hot-updater typecheck`
- `pnpm --dir packages/hot-updater build`
- `node packages/hot-updater/scripts/build-manifest.mjs --platform android --channel staging --bundle-id test-bundle --app-version 0.1.0 --url https://example.com/bundles/test.zip --output /tmp/hot-updater-test.json --force true --disabled true`
- `node packages/hot-updater/scripts/print-file-meta.mjs /tmp/hot-updater-test.json`

## Published Artifacts

- `@gaozh1024/hot-updater`: `0.1.1`

## Known Gaps

- 本地验证未覆盖真实 Android/iOS Release 包 OTA 下载、重启、bundleId 变化；正式发布前建议在业务 App 或 example App release 环境补充验证。
