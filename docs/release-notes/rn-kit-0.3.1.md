# @gaozh1024/rn-kit 0.3.1 Release Notes

`0.3.1` 是一次兼容性修复版本，重点解决模板中 `ListItem + Icon` 渲染链路在部分环境下的崩溃问题。

## 修复项

### 1. Icon 组件兼容性修复

- `Icon` 底层改为使用 `@expo/vector-icons` 的 `MaterialIcons`
- 处理图标组件异常为 `undefined` 时的兜底渲染，避免 `displayName` 读取导致页面崩溃
- 目标场景：`ListItem`/`AppPressable`/`Card` 组合中图标渲染稳定性

### 2. 包导出稳定性

- 维持 `exports` 中 `react-native` 条件入口，优先走 CJS 产物，减少运行时互操作差异

### 3. 回归测试补充

- 新增 `Icon` fallback 测试，覆盖图标组件不可用时不崩溃路径

## 配套版本

- `@gaozh1024/rn-kit`：`0.3.1`
- `@gaozh1024/expo-starter`：`0.2.1`（同步依赖 `@gaozh1024/rn-kit@^0.3.1`）
