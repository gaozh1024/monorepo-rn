# @gaozh/rn-core

> Panther Expo 框架的核心业务层，提供类型安全的 API 工厂、统一的错误处理、安全存储等功能。

## 📦 安装

```bash
npm install @gaozh/rn-core
# 或
pnpm add @gaozh/rn-core
```

### ⚠️ 前置要求

本库依赖以下 peer dependencies，请确保已安装：

```bash
npm install react react-native zod @tanstack/react-query
# 或
pnpm add react react-native zod @tanstack/react-query
```

- **react** / **react-native**: React 核心库
- **zod**: 运行时类型验证（已包含在依赖中，自动安装）
- **@tanstack/react-query**: 数据获取和缓存（已包含在依赖中，自动安装）

---

## 🚀 快速开始

```tsx
import { createAPI, z, ErrorCode, useAsyncState, storage } from '@gaozh/rn-core';

// 1. 定义 API
const api = createAPI({
  baseURL: 'https://api.example.com',
  endpoints: {
    getUser: {
      method: 'GET',
      path: '/users/:id',
      output: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    },
    createUser: {
      method: 'POST',
      path: '/users',
      input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
      output: z.object({ id: z.string() }),
    },
  },
});

// 2. 使用 API
const user = await api.getUser({ id: '123' });
const newUser = await api.createUser({
  name: 'Tom',
  email: 'tom@example.com',
});

// 3. 错误处理
const { execute, loading, error, data } = useAsyncState();

async function handleSubmit() {
  try {
    await execute(api.createUser(formData));
  } catch (err: any) {
    if (err.isValidation) {
      // 处理验证错误
    }
    if (err.isNetwork) {
      // 处理网络错误
    }
  }
}
```

## 📚 API 文档

### API 工厂

#### `createAPI(config)`

创建类型安全的 API 客户端。

```ts
import { createAPI, z } from '@gaozh/rn-core';

const api = createAPI({
  baseURL: 'https://api.example.com',
  endpoints: {
    // GET 请求
    getUser: {
      method: 'GET',
      path: '/users/:id',
      output: z.object({ id: z.string(), name: z.string() }),
    },

    // POST 请求带输入验证
    createUser: {
      method: 'POST',
      path: '/users',
      input: z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
      output: z.object({ id: z.string() }),
    },

    // 无需验证
    listUsers: {
      method: 'GET',
      path: '/users',
    },
  },
});

// 使用 API
const user = await api.getUser({ id: '123' });
const newUser = await api.createUser({ name: 'Tom', email: 'tom@test.com' });
const users = await api.listUsers();
```

**配置类型：**

```ts
interface ApiConfig<TEndpoints> {
  baseURL: string;
  endpoints: TEndpoints;
}

interface ApiEndpointConfig<TInput, TOutput> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string; // 支持路径参数 :id
  input?: ZodSchema<TInput>; // 请求参数验证（可选）
  output?: ZodSchema<TOutput>; // 响应数据验证（可选）
}
```

**特性：**

- ✅ 完整的 TypeScript 类型推断
- ✅ 请求/响应数据 Zod 验证
- ✅ 路径参数自动提取
- ✅ 统一的错误处理

---

### 错误处理

#### ErrorCode

预定义的错误代码枚举。

```ts
import { ErrorCode } from '@gaozh/rn-core';

ErrorCode.VALIDATION; // 验证错误
ErrorCode.NETWORK; // 网络错误
ErrorCode.UNAUTHORIZED; // 未认证 (401)
ErrorCode.FORBIDDEN; // 无权限 (403)
ErrorCode.SERVER; // 服务器错误
ErrorCode.BUSINESS; // 业务逻辑错误
ErrorCode.UNKNOWN; // 未知错误
```

#### AppError

统一的错误类型。

```ts
interface AppError {
  code: ErrorCode; // 错误代码
  message: string; // 错误消息
  statusCode?: number; // HTTP 状态码
  field?: string; // 相关字段（验证错误）
  retryable?: boolean; // 是否可重试
  original?: any; // 原始错误
}
```

#### `mapHttpStatus(status)`

将 HTTP 状态码映射为错误代码。

```ts
import { mapHttpStatus, ErrorCode } from '@gaozh/rn-core';

mapHttpStatus(401); // ErrorCode.UNAUTHORIZED
mapHttpStatus(403); // ErrorCode.FORBIDDEN
mapHttpStatus(500); // ErrorCode.SERVER
mapHttpStatus(422); // ErrorCode.VALIDATION
```

#### `enhanceError(error)`

增强错误对象，添加便捷属性。

```ts
import { enhanceError } from '@gaozh/rn-core';

const error = { code: ErrorCode.NETWORK, message: 'Timeout' };
const enhanced = enhanceError(error);

enhanced.isValidation; // false
enhanced.isNetwork; // true
enhanced.isAuth; // false
enhanced.isRetryable; // true (网络错误默认可重试)
```

---

### React Hooks

#### `useAsyncState()`

管理异步操作的 Hook。

```tsx
import { useAsyncState } from '@gaozh/rn-core';

function UserProfile({ userId }: { userId: string }) {
  const { data, error, loading, execute, reset } = useAsyncState();

  const loadUser = async () => {
    try {
      const user = await execute(api.getUser({ id: userId }));
      console.log('加载成功:', user);
    } catch (err) {
      // 错误已在 error 中
    }
  };

  if (loading) return <Loading />;
  if (error) {
    return <ErrorView message={error.message} retryable={error.isRetryable} onRetry={loadUser} />;
  }

  return <UserView user={data} />;
}
```

**返回值：**

```ts
{
  data: T | null;           // 响应数据
  error: EnhancedError | null;  // 增强错误对象
  loading: boolean;         // 加载状态
  execute: (promise: Promise<T>) => Promise<T>;  // 执行异步操作
  reset: () => void;        // 重置状态
}
```

**EnhancedError 属性：**

```ts
{
  code: ErrorCode;
  message: string;
  isValidation: boolean; // 是否为验证错误
  isNetwork: boolean; // 是否为网络错误
  isAuth: boolean; // 是否为认证/授权错误
  isRetryable: boolean; // 是否可重试
}
```

---

### 存储

#### `storage`

安全存储实例（基于内存实现，生产环境可替换为加密存储）。

```ts
import { storage } from '@gaozh/rn-core';

// 存储数据
await storage.setItem('token', 'abc123');

// 读取数据
const token = await storage.getItem('token');

// 删除数据
await storage.removeItem('token');
```

#### `MemoryStorage`

存储类，可创建独立实例或自定义存储后端。

```ts
import { MemoryStorage } from '@gaozh/rn-core';

// 创建新实例
const customStorage = new MemoryStorage();

// 自定义存储后端（示例：AsyncStorage）
class AsyncStorageBackend extends MemoryStorage {
  async setItem(key: string, value: string) {
    await AsyncStorage.setItem(key, value);
  }

  async getItem(key: string) {
    return AsyncStorage.getItem(key);
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  }
}
```

---

### Zod 导出

库重新导出 `zod` 以方便使用：

```ts
import { z } from '@gaozh/rn-core';

const schema = z.object({
  name: z.string().min(2),
  age: z.number().min(0).max(150),
  email: z.string().email(),
});
```

### React Query 导出

库重新导出 `@tanstack/react-query` 的核心 API：

```ts
import { useQuery, useMutation } from '@gaozh/rn-core';

// 配合 API 使用
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: () => api.getUser({ id }),
});

const mutation = useMutation({
  mutationFn: api.createUser,
});
```

---

## 💡 使用示例

### 完整的 API 客户端

```ts
// api.ts
import { createAPI, z } from '@gaozh/rn-core';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
});

export const api = createAPI({
  baseURL: 'https://api.example.com/v1',
  endpoints: {
    // 用户相关
    getUser: {
      method: 'GET',
      path: '/users/:id',
      output: UserSchema,
    },
    updateUser: {
      method: 'PUT',
      path: '/users/:id',
      input: z.object({
        name: z.string().min(2).optional(),
        avatar: z.string().optional(),
      }),
      output: UserSchema,
    },

    // 认证相关
    login: {
      method: 'POST',
      path: '/auth/login',
      input: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
      output: z.object({ token: z.string(), user: UserSchema }),
    },
  },
});

export type User = z.infer<typeof UserSchema>;
```

### 错误边界处理

```tsx
// ErrorBoundary.tsx
import { ErrorCode, type AppError } from '@gaozh/rn-core';

function ErrorFallback({ error }: { error: AppError }) {
  switch (error.code) {
    case ErrorCode.AUTH:
      return <AuthExpiredView />;
    case ErrorCode.NETWORK:
      return <NetworkErrorView message={error.message} />;
    case ErrorCode.VALIDATION:
      return <ValidationErrorView field={error.field} />;
    default:
      return <UnknownErrorView message={error.message} />;
  }
}
```

### 表单提交

```tsx
// LoginForm.tsx
import { useAsync, z } from '@gaozh/rn-core';

const LoginSchema = z.object({
  email: z.string().email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少6位'),
});

function LoginForm() {
  const { execute, loading, error } = useAsyncState();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async () => {
    const result = LoginSchema.safeParse(form);
    if (!result.success) {
      // 处理验证错误
      return;
    }

    try {
      const { token } = await execute(api.login(result.data));
      await storage.setItem('token', token);
      router.push('/home');
    } catch (err) {
      if (err.isAuth) {
        Alert.alert('登录失败', '邮箱或密码错误');
      }
    }
  };

  return (
    <View>
      <Input
        value={form.email}
        onChangeText={v => setForm(p => ({ ...p, email: v }))}
        placeholder="邮箱"
      />
      <Input
        secureTextEntry
        value={form.password}
        onChangeText={v => setForm(p => ({ ...p, password: v }))}
        placeholder="密码"
      />
      <Button title={loading ? '登录中...' : '登录'} onPress={handleSubmit} disabled={loading} />
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
    </View>
  );
}
```

### Token 管理

```ts
// auth.ts
import { storage } from '@gaozh/rn-core';

const TOKEN_KEY = 'auth_token';

export const auth = {
  async setToken(token: string) {
    await storage.setItem(TOKEN_KEY, token);
  },

  async getToken() {
    return storage.getItem(TOKEN_KEY);
  },

  async clearToken() {
    await storage.removeItem(TOKEN_KEY);
  },

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  },
};
```

---

## 🧪 测试

```bash
# 运行测试
pnpm test

# 查看覆盖率
pnpm test:coverage
```

## 📄 许可证

MIT
