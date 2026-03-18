# 单包边界说明

> 本文档是下一阶段架构任务 A4 的交付物
>
> 创建日期: 2026-03-18
>
> 用途: 在不拆包的前提下，定义单包内部模块边界

## 概述

尽管当前采用单包模式（`@gaozh1024/rn-kit`），但内部模块边界需要清晰定义，以便：

1. 约束跨目录引用方向
2. 减少未来重构返工
3. 为可能的拆包预留决策依据
4. 标记不允许继续膨胀的目录和文件

---

## 模块依赖图

```
┌─────────────────────────────────────────────────────────────┐
│                     @gaozh1024/rn-kit                        │
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  utils  │    │  theme  │    │   core  │    │   ui    │  │
│  │ (基础)  │    │ (基础)  │    │ (逻辑)  │    │ (视图)  │  │
│  └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘  │
│       │              │              │              │        │
│       └──────────────┴──────────────┴──────────────┘        │
│                      ↓ 可依赖                              │
│              ┌───────────────┐                             │
│              │  navigation   │                             │
│              │   (导航)      │                             │
│              └───────┬───────┘                             │
│                      ↓ 可依赖                              │
│              ┌───────────────┐                             │
│              │    overlay    │                             │
│              │ (全局UI+整合) │                             │
│              └───────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

**依赖规则**:

- 下层可依赖上层（如 `ui` 可依赖 `utils`）
- 上层不可依赖下层（如 `utils` 不可依赖 `ui`）
- 同层之间尽量减少依赖

---

## 模块职责边界

### 1. Utils 模块

**职责**: 纯工具函数，无副作用，不依赖 React/RN

**允许**:

- 纯函数工具（字符串、数字、日期、颜色处理）
- 类型定义

**禁止**:

- React hooks
- React Native API
- 依赖其他内部模块

**约束**:

- 保持零依赖（除标准库外）
- 每个函数独立可测试

---

### 2. Theme 模块

**职责**: 主题配置、主题上下文、主题切换

**允许**:

- 主题类型定义
- 主题创建函数
- ThemeProvider 组件
- useTheme hook

**禁止**:

- 具体 UI 组件
- 导航相关逻辑
- 依赖 `ui`、`navigation`、`overlay`

**依赖**:

- `utils` (颜色工具)

---

### 3. Core 模块

**职责**: 应用核心逻辑（错误处理、API、存储、通用 Hooks）

#### 3.1 Error 子模块

**职责**: 错误类型、错误处理、错误增强

**允许**:

- 错误类型定义
- 错误处理工具函数
- 轻量级错误相关 hooks

**禁止**:

- UI 组件（如 ErrorBoundary）
- 通用异步状态 hooks 的主实现

**当前状态**:

- `useAsyncState` 主实现已迁移到 `core/hooks`
- `core/error/hooks.ts` 仅保留兼容层

#### 3.2 API 子模块

**职责**: API 创建、API 配置

**允许**:

- API 创建函数
- API 配置类型
- 拦截器逻辑

**禁止**:

- 具体业务 API
- UI 相关逻辑

#### 3.3 Storage 子模块

**职责**: 存储抽象、存储实现

**允许**:

- 存储接口
- 内存存储实现
- useStorage hook

**禁止**:

- 特定存储方案（如 AsyncStorage 具体实现）

#### 3.4 Hooks 子模块

**职责**: 通用 React Hooks

**允许**:

- 数据获取 hooks (useRequest, usePagination, useInfinite)
- 状态管理 hooks (useSetState, useToggle)
- 副作用 hooks (useUpdateEffect, useDebounce)
- 引用 hooks (usePrevious, useMemoizedFn)

**禁止**:

- 依赖 `ui`、`navigation`、`overlay`

**依赖**:

- `utils`
- `storage`

---

### 4. UI 模块

**职责**: 视觉组件、布局组件、交互组件

**子模块边界**:

| 子模块       | 职责          | 代表组件                                              |
| ------------ | ------------- | ----------------------------------------------------- |
| `primitives` | 基础原子组件  | AppView, AppText, AppPressable                        |
| `layout`     | 布局容器      | Row, Col, Center, SafeScreen                          |
| `actions`    | 操作组件      | AppButton                                             |
| `feedback`   | 反馈组件      | Toast, Alert, Loading                                 |
| `display`    | 展示组件      | Icon, Card, Progress, AppList, AppImage               |
| `form`       | 表单组件      | AppInput, Checkbox, Radio, Switch, Select, DatePicker |
| `hooks`      | UI 相关 hooks | useToggle, useDebounce, useKeyboard, useDimensions    |

**依赖**:

- `utils` (cn, color)
- `theme` (useTheme)

**禁止**:

- 依赖 `navigation`、`overlay`
- 跨子模块直接引用具体组件（通过 index.ts 导出）

---

### 5. Navigation 模块

**职责**: 导航封装、导航组件、导航 hooks

**子模块边界**:

| 子模块       | 职责                                             |
| ------------ | ------------------------------------------------ |
| `navigators` | 导航器组件 (Stack, Tab, Drawer)                  |
| `components` | 导航相关 UI 组件 (Header, TabBar, DrawerContent) |
| `hooks`      | 导航 hooks                                       |
| `types`      | 导航类型定义                                     |
| `utils`      | 导航工具函数                                     |

**依赖**:

- `utils`
- `theme`
- `ui` (组件)

**禁止**:

- 依赖 `overlay`

**当前状态**:

- 类型定义已拆分到 `types/base.ts`、`types/screens.ts`、`types/routes.ts`、`types/navigation.ts`、`types/linking.ts`
- 导航 Hooks 已拆分为 `useNavigation.ts`、`useNavigationState.ts`、`useRoute.ts`

---

### 6. Overlay 模块

**职责**: 全局 UI 状态管理（Loading、Toast、Alert）、Provider 整合

**当前状态**:

- 原 `OverlayHost.tsx` 已拆分
- `loading`、`toast`、`alert` 已成为独立子系统
- `provider.tsx` 负责统一组合

**子域边界**:

```
overlay/
├── loading/          # Loading 子系统
│   ├── provider.tsx
│   ├── context.ts
│   ├── types.ts
│   └── hooks.ts
├── toast/            # Toast 子系统
│   ├── provider.tsx
│   ├── context.ts
│   ├── types.ts
│   ├── hooks.ts
│   └── component.tsx
├── alert/            # Alert 子系统
│   ├── provider.tsx
│   ├── context.ts
│   ├── types.ts
│   ├── hooks.ts
│   └── component.tsx
├── provider.tsx      # 统一 OverlayProvider
├── AppProvider.tsx   # 整合所有 Provider
└── index.ts          # 对外导出
```

**依赖**:

- `utils`
- `theme`
- `ui` (组件)
- `navigation` (可选，用于导航相关逻辑)

**禁止**:

- 被其他模块依赖（除根入口外）

---

## 跨目录引用约束

### 允许引用（下层 → 上层）

```typescript
// ✅ 允许: ui 引用 utils
import { cn } from '@/utils';

// ✅ 允许: navigation 引用 ui
import { AppHeader } from '@/ui';

// ✅ 允许: overlay 引用 navigation
import { useStackNavigation } from '@/navigation';
```

### 禁止引用（上层 → 下层）

```typescript
// ❌ 禁止: utils 引用 ui
import { AppView } from '@/ui'; // 禁止

// ❌ 禁止: theme 引用 overlay
import { useLoading } from '@/overlay'; // 禁止
```

### 同层引用

```typescript
// ✅ 允许: 同层子模块间引用（通过 index.ts）
// ui/form/index.ts
import { AppText } from '@/ui/primitives'; // 通过父层 index

// ✅ 允许: core 子模块间引用
// core/hooks/useStorage.ts
import { storage } from '@/core/storage'; // 允许
```

---

## 膨胀控制清单

以下目录/文件已达到或接近容量上限，**禁止继续膨胀**：

| 路径                                  | 当前状态 | 限制     | 处理方案             |
| ------------------------------------- | -------- | -------- | -------------------- |
| `overlay/AppProvider.tsx`             | 216 行   | < 200 行 | 后续继续收敛         |
| `navigation/hooks/useNavigation.ts`   | 152 行   | < 200 行 | 维持当前规模         |
| `navigation/types/screens.ts`         | 114 行   | < 200 行 | 维持当前规模         |
| `overlay/__tests__/provider.test.tsx` | 135 行   | < 160 行 | 避免继续堆叠测试职责 |

---

## 新增模块评估

如需新增顶层模块，需评估：

| 问题                   | 说明                             |
| ---------------------- | -------------------------------- |
| 职责是否清晰？         | 能否用一句话描述其职责？         |
| 是否有独立价值？       | 是否可以独立于其他模块使用？     |
| 是否符合依赖方向？     | 是否只依赖上层模块？             |
| 是否增加循环依赖风险？ | 是否会导致现有模块间的循环依赖？ |

---

## 后续关联任务

| 任务   | 内容                                              |
| ------ | ------------------------------------------------- |
| 已完成 | `useAsyncState` 已迁移到 `core/hooks`             |
| 已完成 | `overlay` 已拆分为 loading / toast / alert 子系统 |
| 已完成 | `navigation` 类型和 Hook 已拆分                   |

---

## 变更记录

| 日期       | 变更     | 说明                 |
| ---------- | -------- | -------------------- |
| 2026-03-18 | 初始定义 | 定义各模块边界和约束 |
