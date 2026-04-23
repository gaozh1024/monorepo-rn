# @gaozh1024/expo-starter 0.2.15 Release Notes

**发布日期**: 2026-04-22

## 本次更新

### 标题骨架能力跟进

- `PageScreen` 新增 `titleNode`，现在可以直接透传自定义标题组件到内部 `AppHeader`
- 适合品牌标题、带图标标题、搜索框标题等需要替换中间标题区的页面
- 模板依赖同步提升到 `@gaozh1024/rn-kit@^0.4.18`

### 模板文档与版本同步

- `PageScreen` README 新增 `titleNode` 示例
- 依赖兼容性说明同步到 `@gaozh1024/rn-kit ^0.4.18`
- 版本号同步至 `0.2.15`
- `app.json` 中 `expo.version` 同步至 `0.2.15`
- LaunchScreen 版本显示同步至 `v0.2.15`
- 模板蓝图文档中的初始化版本示例同步至 `0.2.15`

## 适用场景

`0.2.15` 适合作为新的模板基线，尤其适用于：

1. 需要在标准二级页中使用品牌化标题组件的 Expo 项目
2. 希望复用 `PageScreen`，但中间标题区不是纯文本的页面
3. 需要和 `@gaozh1024/rn-kit@^0.4.18` 保持一致依赖基线的团队

## 验证命令

```bash
pnpm --dir templates/expo-starter lint
npm_config_cache=/tmp/npm-cache-expo-starter npm pack --dry-run --prefix templates/expo-starter
```

## 相关包

- `@gaozh1024/expo-starter`：`0.2.15`
- `@gaozh1024/rn-kit`：`^0.4.18`
