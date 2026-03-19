# API 错误处理指南

## 目标

这份文档只解决一个问题：

如何在项目里基于 `@gaozh1024/rn-kit` 的 `createAPI`，实现统一的 API 错误监听，同时保持业务域接口各自独立定义。

## 最终分层

推荐固定成这三层：

```text
src/bootstrap/app-config.ts   -> 提供 apiBaseURL
src/data/api.ts               -> 提供 createAppAPI + 全局错误监听
src/features/*/api.ts         -> 定义业务域接口
```

规则很简单：

- `bootstrap` 放配置
- `data/api.ts` 放统一能力
- `features/*/api.ts` 放具体 endpoint

不要把具体业务接口写到 `src/data/api.ts`。

## 框架现在提供了什么

当前 `createAPI` 已支持这些能力：

- 输入参数校验错误统一转成 `AppError`
- 网络错误统一转成 `AppError`
- HTTP 错误统一转成 `AppError`
- 业务错误统一转成 `AppError`
- endpoint 级 `onError`
- 全局 `onError`
- endpoint 级 `parseBusinessError`
- 全局 `parseBusinessError`

## 第一步：在 `app-config.ts` 放配置

```ts
// src/bootstrap/app-config.ts
export const appConfig = {
  appName: 'Panther Starter',
  env: 'mock',
  apiBaseURL: 'https://api.example.com',
};
```

这里不要做业务逻辑，只放配置值。

## 第二步：在 `data/api.ts` 提供统一工厂

```ts
// src/data/api.ts
import { createAPI, ErrorCode, type ApiEndpointConfig, type AppError } from '@gaozh1024/rn-kit';
import { appConfig } from '../bootstrap/app-config';

function handleGlobalError(error: AppError) {
  if (error.code === ErrorCode.UNAUTHORIZED) {
    // 清理登录态 / 跳转登录页
    return;
  }

  if (error.code === ErrorCode.NETWORK) {
    // 提示网络异常
    return;
  }

  if (error.code === ErrorCode.BUSINESS) {
    // 提示业务错误
    return;
  }
}

export function createAppAPI<T extends Record<string, ApiEndpointConfig<any, any>>>(endpoints: T) {
  return createAPI({
    baseURL: appConfig.apiBaseURL,
    endpoints,
    parseBusinessError: data => {
      const result = data as
        | {
            success?: boolean;
            code?: string;
            message?: string;
          }
        | undefined;

      if (result?.success === false) {
        return {
          code: ErrorCode.BUSINESS,
          message: result.message || 'Business error',
          original: data,
        };
      }

      return null;
    },
    onError: (error, context) => {
      handleGlobalError(error);

      console.error('[API_ERROR]', {
        endpoint: context.endpointName,
        path: context.path,
        method: context.method,
        code: error.code,
        message: error.message,
      });
    },
  });
}
```

这里的职责只有两个：

- 统一创建 API
- 统一监听错误

这里不要定义 `getProfile`、`login`、`getNotifications` 这些具体接口。

## 第三步：在业务域里定义自己的 API

### Auth

```ts
// src/features/auth/api.ts
import { z } from 'zod';
import { createAppAPI } from '../../data/api';

export const authApi = createAppAPI({
  login: {
    method: 'POST',
    path: '/auth/login',
    input: z.object({
      mobile: z.string(),
      password: z.string(),
    }),
    output: z.object({
      token: z.string(),
      refreshToken: z.string(),
    }),
  },
});
```

### Profile

```ts
// src/features/profile/api.ts
import { z } from 'zod';
import { createAppAPI } from '../../data/api';

export const profileApi = createAppAPI({
  getProfile: {
    method: 'GET',
    path: '/profile',
    output: z.object({
      id: z.string(),
      name: z.string(),
      mobile: z.string().optional(),
    }),
  },
});
```

## 全局监听和 endpoint 监听的边界

推荐这样划分：

### 全局 `onError`

放在 `src/data/api.ts`，处理所有接口都关心的事情：

- `401` 清 session
- 统一 toast
- 统一日志
- 统一埋点

### endpoint 级 `onError`

放在 `features/*/api.ts` 某个具体接口里，只处理这个接口自己的特殊逻辑。

例如：

```ts
export const authApi = createAppAPI({
  login: {
    method: 'POST',
    path: '/auth/login',
    onError: error => {
      if (error.code === 'BUSINESS') {
        // 登录页自己的特殊提示
      }
    },
  },
});
```

建议原则：

- 通用副作用放全局
- 特例放 endpoint

不要反过来。

## 业务错误解析放哪里

这取决于后端返回是否统一。

### 情况 1：全站返回结构统一

例如所有接口都返回：

```json
{
  "success": false,
  "code": "BIZ_001",
  "message": "库存不足"
}
```

这种情况就放在全局 `parseBusinessError`。

### 情况 2：某个业务域返回结构特殊

例如只有 `payment` 接口返回：

```json
{
  "ok": false,
  "errorMessage": "支付失败"
}
```

这种情况就在对应 endpoint 或业务域里单独处理：

```ts
export const paymentApi = createAppAPI({
  pay: {
    method: 'POST',
    path: '/payment/pay',
    parseBusinessError: data => {
      const result = data as { ok?: boolean; errorMessage?: string };
      if (result.ok === false) {
        return {
          code: ErrorCode.BUSINESS,
          message: result.errorMessage || 'Payment failed',
          original: data,
        };
      }
      return null;
    },
  },
});
```

## 推荐错误处理策略

建议按错误类型统一处理：

### `UNAUTHORIZED`

- 清空 token
- 清空用户态
- 跳转登录页

### `NETWORK`

- 提示“网络异常，请稍后重试”
- 保留当前页状态

### `SERVER`

- 提示“服务异常”
- 记录日志

### `BUSINESS`

- 直接展示后端返回的业务提示

### `VALIDATION`

- 如果是输入参数问题，优先在表单层修正

## 不建议的写法

- 不要把所有业务接口都写进一个 `src/data/api.ts`
- 不要在框架层硬编码 toast / 跳转 / 登出
- 不要在每个接口里重复写一遍相同的 `401` 处理
- 不要把 `apiBaseURL` 写死在业务域 `api.ts`

## 推荐模板写法总结

最终项目里按这个模式写：

1. `bootstrap/app-config.ts`
   放 `apiBaseURL`
2. `data/api.ts`
   放 `createAppAPI`
3. `features/auth/api.ts`
   放 auth 接口
4. `features/home/api.ts`
   放 home 接口
5. `features/profile/api.ts`
   放 profile 接口

这样后面接口再多，也不会把结构搞乱。
