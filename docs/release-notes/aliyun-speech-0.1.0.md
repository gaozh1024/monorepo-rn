# @gaozh1024/aliyun-speech 0.1.0 Release Notes

`0.1.0` 是首个独立发布版本，用于在当前 monorepo 中承载阿里云实时语音转文字能力。

## 本次包含

- 新增独立包：`packages/aliyun-speech`
- npm 包名改为：`@gaozh1024/aliyun-speech`
- 接入 `tsup`，统一输出 `cjs / esm / dts` 产物
- 补齐 `README`、`CHANGELOG`、`LICENSE`、发布说明
- 保留 headless hook、协议层与默认 UI 三层能力

## 安装

```bash
pnpm add @gaozh1024/aliyun-speech
pnpm add @siteed/audio-studio expo-audio
```

## 验证建议

```bash
pnpm --dir packages/aliyun-speech typecheck
pnpm --dir packages/aliyun-speech build
```

## 相关包

- `@gaozh1024/aliyun-speech`：`0.1.0`
