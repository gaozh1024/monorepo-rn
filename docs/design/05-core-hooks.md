# 核心 Hooks 设计文档

> 位置: `packages/framework/src/core/src/hooks/` 和 `packages/framework/src/ui/src/hooks/`
> 分类: 数据获取 / UI交互 / 状态管理 / 设备能力

---

## 1. 设计目标

- **减少样板代码**: 封装常用逻辑，一行代码解决常见问题
- **类型安全**: 完整的 TypeScript 类型推导
- **组合灵活**: 多个 hooks 可以组合使用
- **测试友好**: 纯函数设计，易于单元测试

---

## 2. Hooks 分类清单

### 2.1 数据获取 Hooks（`@gaozh1024/rn-core`）

| Hook            | 用途             | 状态 |
| --------------- | ---------------- | ---- |
| `useAsyncState` | 管理异步操作状态 | ✅   |
| `useRequest`    | 自动化的请求管理 | ✅   |
| `usePagination` | 分页列表数据     | ✅   |
| `useRefresh`    | 下拉刷新逻辑     | ✅   |
| `useInfinite`   | 无限滚动逻辑     | ✅   |

### 2.2 UI 交互 Hooks（`@gaozh1024/rn-ui`）

| Hook             | 用途         | 状态 |
| ---------------- | ------------ | ---- |
| `useToggle`      | 布尔值切换   | ✅   |
| `useDebounce`    | 防抖         | ✅   |
| `useThrottle`    | 节流         | ✅   |
| `useKeyboard`    | 键盘状态监听 | ✅   |
| `useDimensions`  | 屏幕尺寸变化 | ✅   |
| `useOrientation` | 横竖屏切换   | ✅   |
| `useBackHandler` | 安卓返回键   | ✅   |

### 2.3 状态管理 Hooks（`@gaozh1024/rn-core`）

| Hook              | 用途                     | 状态 |
| ----------------- | ------------------------ | ---- |
| `usePrevious`     | 上一次的值               | ✅   |
| `useSetState`     | 合并 setState            | ✅   |
| `useStorage`      | 本地存储同步             | ✅   |
| `useMemoizedFn`   | 持久化函数引用           | ✅   |
| `useUpdateEffect` | 跳过首次执行的 useEffect | ✅   |

---

## 3. 详细 API 设计

### 3.1 数据获取 Hooks

#### useRequest

自动化的请求管理，集成 loading、error、retry。

```tsx
import { useRequest } from '@gaozh1024/rn-core';

// 基础用法
const { data, loading, error, refresh } = useRequest(getUserInfo);

// 带参数
const { data: user } = useRequest(() => getUserById(userId), {
  deps: [userId], // userId 变化时重新请求
});

// 手动触发
const { run, loading } = useRequest(updateUser, {
  manual: true, // 不自动执行
  onSuccess: data => {
    Toast.show('更新成功');
  },
  onError: error => {
    Toast.show(error.message);
  },
});

// 使用
<AppButton loading={loading} onPress={() => run({ name: 'New Name' })}>
  更新
</AppButton>;
```

**Options:**

| 选项            | 类型              | 默认值  | 说明                   |
| --------------- | ----------------- | ------- | ---------------------- |
| `manual`        | `boolean`         | `false` | 是否手动触发           |
| `deps`          | `any[]`           | `[]`    | 依赖项，变化时重新请求 |
| `defaultParams` | `any[]`           | -       | 默认参数               |
| `onSuccess`     | `(data) => void`  | -       | 成功回调               |
| `onError`       | `(error) => void` | -       | 失败回调               |
| `onFinally`     | `() => void`      | -       | 完成回调               |
| `retryCount`    | `number`          | `0`     | 失败重试次数           |
| `retryDelay`    | `number`          | `1000`  | 重试间隔(ms)           |

**返回值:**

```typescript
{
  data: T | undefined;           // 响应数据
  loading: boolean;              // 加载状态
  error: Error | undefined;      // 错误对象
  run: (...params) => Promise;   // 手动执行（manual=true 时使用）
  refresh: () => Promise;        // 重新执行（使用上次的参数）
  cancel: () => void;            // 取消请求
  mutate: (data) => void;        // 直接修改数据（乐观更新）
}
```

---

#### usePagination

分页列表数据管理。

```tsx
import { usePagination } from '@gaozh1024/rn-core';

function ProductList() {
  const { data, loading, refreshing, loadingMore, hasMore, refresh, loadMore, error } =
    usePagination(fetchProducts, {
      defaultPageSize: 20,
    });

  return (
    <AppList
      data={data}
      renderItem={({ item }) => <ProductCard product={item} />}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      onEndReached={loadMore}
      hasMore={hasMore}
      error={error}
    />
  );
}

// fetchProducts 需要返回特定格式
async function fetchProducts({ current, pageSize }) {
  const res = await api.getProducts({ page: current, size: pageSize });
  return {
    list: res.items, // 当前页数据
    total: res.total, // 总数量（用于计算 hasMore）
  };
}
```

**Options:**

| 选项              | 类型     | 默认值 | 说明         |
| ----------------- | -------- | ------ | ------------ |
| `defaultCurrent`  | `number` | `1`    | 默认页码     |
| `defaultPageSize` | `number` | `10`   | 默认每页条数 |
| `deps`            | `any[]`  | `[]`   | 依赖项       |

**返回值:**

```typescript
{
  data: T[];                 // 累积的数据列表
  current: number;           // 当前页码
  pageSize: number;          // 每页条数
  total: number;             // 总数量
  hasMore: boolean;          // 是否还有更多
  loading: boolean;          // 初始加载中
  refreshing: boolean;       // 刷新中
  loadingMore: boolean;      // 加载更多中
  error: Error | undefined;  // 错误
  refresh: () => Promise;    // 刷新（重置到第一页）
  loadMore: () => Promise;   // 加载下一页
  changePage: (page) => Promise;  // 跳转到指定页
}
```

---

### 3.2 UI 交互 Hooks

#### useToggle

布尔值切换，常用于控制显示/隐藏。

```tsx
import { useToggle } from '@gaozh1024/rn-ui';

function Demo() {
  const [visible, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <>
      <AppButton onPress={toggle}>{visible ? '隐藏' : '显示'}</AppButton>

      {visible && <Modal onClose={setFalse} />}
    </>
  );
}

// 也可以这样用
const [isEditing, toggleEdit] = useToggle(false);
```

**API:**

```typescript
function useToggle(defaultValue?: boolean): [
  boolean,
  {
    toggle: () => void; // 切换
    set: (value: boolean) => void; // 设置值
    setTrue: () => void; // 设为 true
    setFalse: () => void; // 设为 false
  },
];
```

---

#### useDebounce

防抖，常用于搜索输入。

```tsx
import { useDebounce } from '@gaozh1024/rn-ui';

function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 500);

  // 使用 debouncedKeyword 进行搜索
  const { data } = useRequest(() => search(debouncedKeyword), {
    deps: [debouncedKeyword],
  });

  return <AppInput placeholder="搜索..." value={keyword} onChangeText={setKeyword} />;
}
```

**API:**

```typescript
function useDebounce<T>(value: T, delay?: number): T;
```

---

#### useThrottle

节流，常用于滚动事件。

```tsx
import { useThrottle } from '@gaozh1024/rn-ui';

function ScrollPage() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 200);

  // 使用 throttledScrollY 更新 UI（如头部透明度）
  const headerOpacity = Math.min(throttledScrollY / 200, 1);

  return (
    <ScrollView onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}>
      {/* content */}
    </ScrollView>
  );
}
```

---

#### useKeyboard

键盘状态监听。

```tsx
import { useKeyboard } from '@gaozh1024/rn-ui';

function CommentInput() {
  const { visible, height, dismiss } = useKeyboard();

  return (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: visible ? height : 0 }}>
        {/* 评论列表 */}
      </ScrollView>

      <InputBar>
        <AppInput
          placeholder="写评论..."
          // 点击外部关闭键盘
          onBlur={dismiss}
        />
      </InputBar>
    </>
  );
}
```

**返回值:**

```typescript
{
  visible: boolean;      // 键盘是否显示
  height: number;        // 键盘高度
  dismiss: () => void;   // 关闭键盘
}
```

---

#### useDimensions

屏幕尺寸变化监听（含横竖屏切换）。

```tsx
import { useDimensions } from '@gaozh1024/rn-ui';

function ResponsiveLayout() {
  const { width, height, scale, fontScale } = useDimensions();

  // 根据宽度决定列数
  const numColumns = width > 600 ? 3 : 2;

  return (
    <AppList
      data={items}
      numColumns={numColumns}
      renderItem={...}
    />
  );
}
```

**返回值:**

```typescript
{
  width: number; // 屏幕宽度
  height: number; // 屏幕高度
  scale: number; // 屏幕像素密度
  fontScale: number; // 字体缩放比例
}
```

---

### 3.3 状态管理 Hooks

#### usePrevious

获取上一次的值，常用于比较。

```tsx
import { usePrevious } from '@gaozh1024/rn-core';

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  useEffect(() => {
    if (prevCount !== undefined && count > prevCount) {
      console.log('增加了:', count - prevCount);
    }
  }, [count, prevCount]);

  return <AppButton onPress={() => setCount(c => c + 1)}>+1</AppButton>;
}
```

---

#### useSetState

合并 setState，类似 class 组件的 this.setState。

```tsx
import { useSetState } from '@gaozh1024/rn-core';

function Form() {
  const [state, setState] = useSetState({
    name: '',
    email: '',
    age: 0,
  });

  // 只需要更新部分字段
  const updateName = (name: string) => {
    setState({ name }); // 自动合并，不覆盖 email 和 age
  };

  return (
    <>
      <AppInput value={state.name} onChangeText={updateName} />
      <AppInput value={state.email} onChangeText={email => setState({ email })} />
    </>
  );
}
```

---

#### useStorage

本地存储同步，自动处理 JSON 序列化。

```tsx
import { useStorage } from '@gaozh1024/rn-core';

function Settings() {
  // 类似 useState，但数据持久化到存储
  const [darkMode, setDarkMode] = useStorage('settings.darkMode', false);

  return <Switch value={darkMode} onValueChange={setDarkMode} />;
}

// 复杂对象
const [user, setUser] = useStorage<User>('user.info', null);
```

**API:**

```typescript
function useStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void];
// 返回值: [值, 设置值, 删除值]
```

---

#### useMemoizedFn

持久化函数引用，避免 useCallback deps 地狱。

```tsx
import { useMemoizedFn } from '@gaozh1024/rn-core';

function Parent() {
  const [count, setCount] = useState(0);

  // 普通函数，每次渲染都是新的引用
  const handleClick1 = () => {
    console.log(count);
  };

  // useMemoizedFn，引用永远不变，但总能访问最新 state
  const handleClick2 = useMemoizedFn(() => {
    console.log(count);
  });

  // 子组件 memo 后，只有 handleClick2 不会导致重渲染
  return <Child onClick={handleClick2} />;
}
```

---

#### useUpdateEffect

跳过首次执行的 useEffect，只在 deps 更新时执行。

```tsx
import { useUpdateEffect } from '@gaozh1024/rn-core';

function Search() {
  const [keyword, setKeyword] = useState('');

  // 首次渲染不执行，只在 keyword 变化时执行
  useUpdateEffect(() => {
    doSearch(keyword);
  }, [keyword]);

  // 首次需要手动执行
  useEffect(() => {
    doSearch('');
  }, []);
}
```

---

## 4. 目录结构

```
packages/
├── core/src/hooks/
│   ├── index.ts
│   ├── useRequest.ts
│   ├── usePagination.ts
│   └── utils/
│       └── useLatest.ts  # 内部工具
├── ui/src/hooks/
│   ├── index.ts
│   ├── useToggle.ts
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   ├── useKeyboard.ts
│   ├── useDimensions.ts
│   └── utils/
│       └── useUnmount.ts  # 内部工具
```

---

## 5. 实现示例

### useRequest 实现

```typescript
// packages/framework/src/core/src/hooks/useRequest.ts

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRequestOptions<T, P extends any[]> {
  manual?: boolean;
  deps?: any[];
  defaultParams?: P;
  onSuccess?: (data: T, params: P) => void;
  onError?: (error: Error, params: P) => void;
  onFinally?: (params: P) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useRequest<T, P extends any[] = any[]>(
  service: (...params: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {}
) {
  const {
    manual = false,
    deps = [],
    defaultParams,
    onSuccess,
    onError,
    onFinally,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState<Error | undefined>(undefined);

  const serviceRef = useRef(service);
  const paramsRef = useRef<P | undefined>(defaultParams as P);
  const retryCountRef = useRef(0);
  const canceledRef = useRef(false);

  serviceRef.current = service;

  const run = useCallback(
    async (...params: P) => {
      paramsRef.current = params;

      setLoading(true);
      setError(undefined);

      try {
        const result = await serviceRef.current(...params);

        if (!canceledRef.current) {
          setData(result);
          retryCountRef.current = 0;
          onSuccess?.(result, params);
        }

        return result;
      } catch (err) {
        if (!canceledRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error, params);

          // 重试逻辑
          if (retryCountRef.current < retryCount) {
            retryCountRef.current++;
            setTimeout(() => {
              if (!canceledRef.current) {
                run(...params);
              }
            }, retryDelay * retryCountRef.current);
          }
        }

        throw err;
      } finally {
        if (!canceledRef.current) {
          setLoading(false);
          onFinally?.(params);
        }
      }
    },
    [onSuccess, onError, onFinally, retryCount, retryDelay]
  );

  const refresh = useCallback(() => {
    if (paramsRef.current) {
      return run(...paramsRef.current);
    }
    throw new Error('No params to refresh');
  }, [run]);

  const cancel = useCallback(() => {
    canceledRef.current = true;
  }, []);

  const mutate = useCallback((newData: T | ((prev: T | undefined) => T)) => {
    setData(prev => {
      if (typeof newData === 'function') {
        return (newData as Function)(prev);
      }
      return newData;
    });
  }, []);

  // 自动执行
  useEffect(() => {
    if (!manual) {
      run(...(defaultParams || ([] as unknown as P)));
    }

    return () => {
      canceledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    run,
    refresh,
    cancel,
    mutate,
  };
}
```

---

## 6. 验收标准

- [x] 所有 hooks 有完整 TypeScript 类型
- [x] 每个 hook 有单元测试
- [x] 文档包含使用示例
- [x] 不依赖外部 UI 库（纯逻辑）

---

**状态**: ✅ 已完成

---

**状态**: ✅ 已完成
