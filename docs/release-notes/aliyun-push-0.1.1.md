# @gaozh1024/aliyun-push 0.1.1 Release Notes

发布日期：2026-04-24

## 修复

- 修复 Expo Config Plugin 对 `@expo/config-plugins` 的发布声明，避免 `pnpm` 消费者在加载插件时出现模块解析失败
- 为包增加 `publishConfig.access=public`，降低手工发布时遗漏 `--access public` 的风险

## 文档与发布流程

- 更新包 README，明确 Expo 插件依赖安装说明
- 更新仓库发布工作流，改为基于 `changeset publish` 发布当前 monorepo 包
- 补充发布指南中的 `changeset` 版本升级步骤与 `aliyun-push` 单包发布检查命令
