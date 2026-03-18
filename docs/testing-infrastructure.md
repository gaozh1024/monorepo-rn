# 测试基础设施说明

> 本文档是下一阶段架构任务 C2 的交付物
>
> 创建日期: 2026-03-18
>
> 用途: 说明测试基础设施结构，降低维护成本

## 测试架构

```
test/
├── setup.ts                    # 主测试配置入口
├── react-native-alias.ts       # React Native 组件 mock
├── material-icons-alias.ts     # 图标库 mock
└── safe-area-context-alias.ts  # 安全区域上下文 mock
```

## Mock 分层

### 第 1 层：React Native 基础 Mock (`test/react-native-alias.ts`)

**职责**: 提供 React Native 基础组件和 API 的 mock

**包含**:

- 基础组件: View, Text, Pressable, ScrollView, etc.
- API: StyleSheet, Platform, Dimensions, Animated
- Hooks: useColorScheme

**何时修改**:

- 新增使用了未 mock 的 RN 组件
- RN 版本升级导致 API 变化

### 第 2 层：第三方库 Mock (`test/*-alias.ts`)

**包含**:

- `material-icons-alias.ts`: 图标组件 mock
- `safe-area-context-alias.ts`: 安全区域上下文 mock

**何时修改**:

- 新增第三方库依赖
- 库版本升级

### 第 3 层：测试工具 Mock (`test/setup.ts`)

**职责**: 提供测试工具和渲染器

**包含**:

- `@testing-library/react-native` mock
- `renderHook` 实现
- `fireEvent` 事件模拟

## 测试分类

### 单元测试

位置: `src/**/__tests__/*.test.ts`

范围:

- 纯函数工具
- Hooks（逻辑）
- 类型定义

### 组件测试

位置: `src/**/__tests__/*.test.tsx`

范围:

- UI 组件渲染
- 交互行为
- Props 验证

### 集成测试

位置: `src/**/__tests__/integration/*.test.tsx`

范围:

- Provider 集成
- 多模块协作
- 端到端流程

## 编写测试的原则

### DO

- 测试公共 API 的行为，而非实现细节
- 使用 `testID` 来查找元素
- 优先使用 `@testing-library/react-native` 的查询方法
- 保持测试独立，不依赖执行顺序

### DON'T

- 不要测试内部实现细节
- 不要过度使用 `act()`（已在 render 中封装）
- 不要直接访问组件 state
- 不要复制实现逻辑到测试中

## 常见问题

### act() 警告

```
Warning: An update to Component inside a test was not wrapped in act(...)
```

**原因**: 组件异步更新 state 未被捕获
**解决**: 使用 `waitFor` 包裹断言，或确保 mock 的定时器被清理

### React Test Renderer 警告

```
react-test-renderer is deprecated
```

**原因**: 当前使用 react-test-renderer 作为底层渲染器
**状态**: 这是已知问题，不影响测试执行
**未来**: 考虑迁移到 @testing-library/react-native 的官方渲染器

## 更新记录

| 日期       | 变更     | 说明                         |
| ---------- | -------- | ---------------------------- |
| 2026-03-18 | 初始文档 | 拆分 mock 层级，明确维护责任 |
