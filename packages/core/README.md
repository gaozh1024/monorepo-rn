# @panther-expo/core

React Native 核心基础设施包，提供应用开发的基础能力：HTTP 客户端和加密存储封装。

## 📦 安装

```bash
npm install @panther-expo/core
```

**依赖要求**：

- `react` >= 18.0.0
- `react-native` >= 0.70.0
- `expo-secure-store` ~15.0.8
- `zod` ^4.0.0

## 🚀 快速开始

### 1. 配置 API 客户端

```typescript
import { BaseAPI } from '@panther-expo/core';

// 创建 API 实例
const api = new BaseAPI({
  baseURL: 'https://api.example.com',
  defaultHeaders: {
    Accept: 'application/json',
  },
});

// 设置认证令牌
api.setToken('your-jwt-token');

// 清除令牌
api.clearToken();
```

### 2. 使用 API 请求

```typescript
// 创建业务 API 类
class UserAPI extends BaseAPI {
  async getProfile() {
    return this.get('/user/profile');
  }

  async updateProfile(data: UserProfile) {
    return this.put('/user/profile', data);
  }

  async login(credentials: LoginCredentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.success) {
      this.setToken(response.data.token);
    }
    return response;
  }
}

const userAPI = new UserAPI({ baseURL: 'https://api.example.com' });

// 使用
const { data, success, message } = await userAPI.getProfile();
```

### 3. 配置安全存储

```typescript
import { createSecureStorage } from '@panther-expo/core';

// 创建存储实例
const storage = createSecureStorage({
  TOKEN: 'user_auth_token',
  USER_INFO: 'user_info_data',
  SETTINGS: 'app_settings',
});

// 存储数据
await storage.setString('TOKEN', 'jwt-token-string');
await storage.setObject('USER_INFO', { id: 1, name: '张三' });
await storage.setNumber('USER_ID', 12345);
await storage.setBoolean('IS_PREMIUM', true);

// 读取数据
const token = await storage.getString('TOKEN');
const userInfo = await storage.getObject<UserInfo>('USER_INFO');
const userId = await storage.getNumber('USER_ID');
const isPremium = await storage.getBoolean('IS_PREMIUM');

// 删除数据
await storage.delete('TOKEN');

// 清空所有数据
await storage.clearAll();

// 检查键是否存在
const hasToken = await storage.contains('TOKEN');
```

---

## 📚 API 文档

### BaseAPI

HTTP 请求基类，封装了通用的请求方法、错误处理和认证管理。

#### 构造函数

```typescript
new BaseAPI(config?: Partial<BaseAPIConfig>)
```

**BaseAPIConfig 配置项**：

| 属性             | 类型                     | 必填 | 说明                       |
| ---------------- | ------------------------ | ---- | -------------------------- |
| `baseURL`        | `string`                 | 否   | API 基础 URL               |
| `defaultHeaders` | `Record<string, string>` | 否   | 默认请求头                 |
| `requireAuth`    | `boolean`                | 否   | 是否需要认证（默认 false） |
| `token`          | `string`                 | 否   | 默认认证令牌               |

#### 方法

##### setToken(token: string): void

设置认证令牌。

```typescript
api.setToken('eyJhbGciOiJIUzI1NiIs...');
```

##### getToken(): string | undefined

获取当前认证令牌。

```typescript
const token = api.getToken();
```

##### clearToken(): void

清除认证令牌。

```typescript
api.clearToken();
```

##### 请求方法

所有请求方法都返回 `Promise<ApiResponse<T>>`。

```typescript
// GET 请求
protected async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>

// POST 请求
protected async post<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>

// PUT 请求
protected async put<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>

// DELETE 请求
protected async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>>

// PATCH 请求
protected async patch<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>>
```

**ApiRequestOptions**：

| 属性          | 类型                     | 说明                       |
| ------------- | ------------------------ | -------------------------- |
| `headers`     | `Record<string, string>` | 自定义请求头               |
| `requireAuth` | `boolean`                | 是否需要认证（覆盖默认值） |
| `token`       | `string`                 | 本次请求使用的令牌         |
| `timeout`     | `number`                 | 请求超时时间（毫秒）       |

**ApiResponse<T>**：

| 属性      | 类型      | 说明         |
| --------- | --------- | ------------ |
| `data`    | `T`       | 响应数据     |
| `message` | `string`  | 响应消息     |
| `success` | `boolean` | 请求是否成功 |

#### 错误处理

API 错误会被封装为 `APIError` 抛出：

```typescript
import { APIError, ApiErrorCode } from '@panther-expo/core';

try {
  await api.get('/user/profile');
} catch (error) {
  if (error instanceof APIError) {
    console.log(error.code); // ApiErrorCode.UNAUTHORIZED
    console.log(error.message); // "Unauthorized"
    console.log(error.statusCode); // 401
    console.log(error.details); // 额外错误信息
  }
}
```

**ApiErrorCode 枚举值**：

- `NETWORK_ERROR` - 网络连接错误
- `VALIDATION_ERROR` - 数据验证错误
- `UNAUTHORIZED` - 未授权访问
- `FORBIDDEN` - 禁止访问
- `NOT_FOUND` - 资源未找到
- `SERVER_ERROR` - 服务器内部错误
- `UNKNOWN_ERROR` - 未知错误

---

### Stream Request（流式请求）

支持 SSE (Server-Sent Events) 协议的流式数据接收，适用于 AI 聊天、实时推送等场景。

#### streamRequest(config, callbacks): StreamController

发起流式请求。

```typescript
import { streamRequest, StreamController } from '@panther-expo/core';

let fullMessage = '';

const controller = streamRequest(
  {
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
    body: {
      model: 'gpt-4',
      messages: [{ role: 'user', content: '你好' }],
      stream: true,
    },
    timeout: 60000, // 超时时间（毫秒）
    retryCount: 2, // 失败重试次数
    retryDelay: 1000, // 重试间隔（毫秒）
  },
  {
    onStart: () => {
      console.log('🤖 AI 开始回复...');
    },
    onMessage: chunk => {
      // 逐字/逐句接收数据
      const content = chunk.choices?.[0]?.delta?.content || '';
      fullMessage += content;
      console.log('收到:', content);
    },
    onError: error => {
      console.error('❌ 请求失败:', error.message);
    },
    onComplete: () => {
      console.log('✅ 回复完成');
    },
  }
);

// 中断生成
controller.abort();

// 检查是否活跃
const isActive = controller.isActive();
```

**StreamRequestConfig 配置项**：

| 属性         | 类型                     | 必填 | 说明                   |
| ------------ | ------------------------ | ---- | ---------------------- |
| `url`        | `string`                 | 是   | 请求 URL               |
| `method`     | `'POST' \| 'GET'`        | 否   | 请求方法（默认 POST）  |
| `headers`    | `Record<string, string>` | 否   | 自定义请求头           |
| `body`       | `unknown`                | 否   | 请求体（POST 使用）    |
| `timeout`    | `number`                 | 否   | 超时时间，默认 60000ms |
| `retryCount` | `number`                 | 否   | 重试次数，默认 0       |
| `retryDelay` | `number`                 | 否   | 重试间隔，默认 1000ms  |

**StreamCallbacks 回调**：

| 回调         | 参数                | 说明               |
| ------------ | ------------------- | ------------------ |
| `onStart`    | `()`                | 开始接收数据时触发 |
| `onMessage`  | `(chunk: T)`        | 收到数据片段时触发 |
| `onError`    | `(error: APIError)` | 发生错误时触发     |
| `onComplete` | `()`                | 完成接收时触发     |

#### BaseAPI.stream() 方法

在 `BaseAPI` 子类中使用流式请求：

```typescript
class ChatAPI extends BaseAPI {
  constructor() {
    super({ baseURL: 'https://api.example.com' });
  }

  sendMessageStream(
    messages: ChatMessage[],
    callbacks: StreamCallbacks<AIChunk>
  ): StreamController {
    return this.stream('/chat/completions', { model: 'gpt-4', messages, stream: true }, callbacks, {
      timeout: 120000,
      retryCount: 1,
    });
  }
}
```

**React Native AI 聊天示例**：

```typescript
class ChatScreen {
  private controller: StreamController | null = null;
  private messages: Message[] = [];

  async sendMessage(text: string) {
    // 添加用户消息
    this.messages.push({ role: 'user', content: text });

    // 创建 AI 回复占位
    const aiIndex = this.messages.length;
    this.messages.push({ role: 'assistant', content: '' });

    // 发起流式请求
    this.controller = chatAPI.sendMessageStream(this.messages, {
      onMessage: chunk => {
        const content = chunk.choices?.[0]?.delta?.content || '';
        // 实时更新 UI
        this.messages[aiIndex].content += content;
        this.render();
      },
      onError: error => {
        console.error('生成失败:', error);
      },
    });
  }

  stopGeneration() {
    this.controller?.abort();
  }
}
```

---

### SecureStorage

基于 `expo-secure-store` 的加密存储封装。

#### createSecureStorage(config: StorageKeyConfig): SecureStorage

创建安全存储实例。

```typescript
const storage = createSecureStorage({
  TOKEN: 'auth_token_key',
  USER_INFO: 'user_info_key',
});
```

#### 方法

##### setString(key: string, value: string): Promise<void>

存储字符串。

```typescript
await storage.setString('TOKEN', 'jwt-token');
```

##### getString(key: string): Promise<string | null>

读取字符串。

```typescript
const token = await storage.getString('TOKEN');
```

##### setNumber(key: string, value: number): Promise<void>

存储数字。

```typescript
await storage.setNumber('USER_ID', 12345);
```

##### getNumber(key: string): Promise<number | null>

读取数字。

```typescript
const userId = await storage.getNumber('USER_ID');
```

##### setBoolean(key: string, value: boolean): Promise<void>

存储布尔值。

```typescript
await storage.setBoolean('IS_LOGGED_IN', true);
```

##### getBoolean(key: string): Promise<boolean | null>

读取布尔值。

```typescript
const isLoggedIn = await storage.getBoolean('IS_LOGGED_IN');
```

##### setObject<T>(key: string, value: T): Promise<void>

存储对象（自动序列化为 JSON）。

```typescript
await storage.setObject('USER_INFO', { id: 1, name: '张三' });
```

##### getObject<T>(key: string): Promise<T | null>

读取对象（自动反序列化 JSON）。

```typescript
interface UserInfo {
  id: number;
  name: string;
}

const userInfo = await storage.getObject<UserInfo>('USER_INFO');
```

##### delete(key: string): Promise<void>

删除指定键。

```typescript
await storage.delete('TOKEN');
```

##### contains(key: string): Promise<boolean>

检查键是否存在。

```typescript
const hasToken = await storage.contains('TOKEN');
```

##### clearAll(): Promise<void>

清空所有配置的数据。

```typescript
await storage.clearAll();
```

---

## 📝 完整示例

### 用户认证模块

```typescript
import { BaseAPI, createSecureStorage } from '@panther-expo/core';

// 存储配置
const authStorage = createSecureStorage({
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
});

// API 客户端
class AuthAPI extends BaseAPI {
  constructor() {
    super({
      baseURL: 'https://api.example.com',
      requireAuth: false,
    });
  }

  async login(email: string, password: string) {
    const response = await this.post('/auth/login', { email, password });

    if (response.success) {
      // 保存令牌
      this.setToken(response.data.accessToken);
      await authStorage.setString('TOKEN', response.data.accessToken);
      await authStorage.setString('REFRESH_TOKEN', response.data.refreshToken);
      await authStorage.setObject('USER_INFO', response.data.user);
    }

    return response;
  }

  async logout() {
    await this.post('/auth/logout');

    // 清除本地存储
    this.clearToken();
    await authStorage.clearAll();
  }

  async getProfile() {
    return this.get('/user/profile');
  }
}

// 使用
const authAPI = new AuthAPI();

// 自动恢复登录状态
async function initializeAuth() {
  const token = await authStorage.getString('TOKEN');
  if (token) {
    authAPI.setToken(token);
  }
}

export { authAPI, authStorage, initializeAuth };
```

---

## 🔒 安全说明

1. **加密存储**: 使用 `expo-secure-store`，数据会被加密存储在设备的安全区域
2. **令牌管理**: BaseAPI 自动在请求头中添加 `Authorization: Bearer <token>`
3. **错误处理**: 所有网络错误都会被封装为标准化的 APIError
4. **类型安全**: 完整的 TypeScript 类型支持

---

## 📄 License

MIT
