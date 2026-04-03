# 发布脚本

框架内置三个发布辅助脚本：

- `ota:prepare`
- `ota:filemeta`
- `ota:manifest`

它们不负责上传 OSS，但现在已经可以本地产出待上传目录。

`ota:prepare` 会直接调用 `@hot-updater/expo` 的本地构建逻辑，只生成当前项目的 OTA zip 和 manifest，不依赖官方 `deploy` 的 storage/database 配置。

## 1. 一次性生成待发布目录

```bash
npm run ota:prepare -- \
  --platform android \
  --channel production \
  --app-version 0.2.1 \
  --manifest-base-url https://ota-cdn.xxx.com/manifest \
  --notes "修复聊天页崩溃"
```

输出目录默认在项目根目录：

```text
ota-releases/
```

目录结构：

```text
ota-releases/
  bundles/
    android/
      production/
        <actualBundleId>.zip
  manifest/
    android/
      production.json
```

脚本内部会做这些事：

1. 调用 `@hot-updater/expo` 的本地构建逻辑
2. 生成当前项目的 OTA zip
3. 计算 `sha256` 和 `size`
4. 按框架 manifest 规范生成 `manifest.json`

可选参数：

- `--bundle-id custom-id`
  - 仅作为请求值记录，不再强制写入最终 manifest
  - 最终以构建产物返回的 `actualBundleId` 为准
- `--min-native-version 0.2.1`
- `--force true`
- `--disabled true`
- `--output /custom/output/dir`

## 2. 计算 zip 文件元信息

```bash
npm run ota:filemeta -- /absolute/path/to/update.zip
```

输出示例：

```json
{
  "file": "/absolute/path/to/update.zip",
  "sha256": "xxxx",
  "size": 18273645
}
```

## 3. 生成 manifest 文件

```bash
npm run ota:manifest -- \
  --platform android \
  --channel production \
  --bundle-id 019d5268-fa4e-7601-9a4f-fd5e93283072 \
  --app-version 0.2.1 \
  --min-native-version 0.2.1 \
  --url https://ota-cdn.xxx.com/bundles/android/production/019d5268-fa4e-7601-9a4f-fd5e93283072.zip \
  --file /absolute/path/to/update.zip \
  --output /tmp/android-production.json \
  --notes "修复聊天页崩溃"
```

说明：

- `--file` 可选；提供后会自动计算 `sha256` 和 `size`
- `--sha256` 和 `--size` 也可以手动传
- `--force true` 可生成强更 manifest
- `--output` 是 manifest 输出路径

## 推荐发布顺序

1. `npm run ota:prepare -- ...`
2. 直接把 `ota-releases/bundles/` 同步到 OSS `bundles/`
3. 直接把 `ota-releases/manifest/` 同步到 OSS `manifest/`

如果你不想用一体化脚本，也可以继续拆开执行：

1. 先自己生成 zip
2. `npm run ota:filemeta -- <zip>`
3. 上传 zip 到 OSS
4. `npm run ota:manifest -- ...`
5. 上传 manifest 到 OSS

## 本地路径到 OSS 路径映射

以 Android staging 为例：

本地产物：

```text
ota-releases/bundles/android/staging/<actualBundleId>.zip
ota-releases/manifest/android/staging.json
```

上传后的 OSS 目标路径：

```text
bundles/android/staging/<actualBundleId>.zip
manifest/android/staging.json
```

完整 URL：

```text
https://ota-cdn.xxx.com/bundles/android/staging/<actualBundleId>.zip
https://ota-cdn.xxx.com/manifest/android/staging.json
```
