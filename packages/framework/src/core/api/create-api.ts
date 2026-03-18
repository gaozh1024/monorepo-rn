/**
 * @fileoverview API 创建模块
 * @module core/api/create-api
 * @description 提供类型安全的 API 客户端创建功能，支持请求/响应数据的 Zod 校验
 */

import type { ApiConfig, ApiEndpointConfig } from './types';
import { ZodError } from 'zod';
import { ErrorCode, type AppError } from '../error';

/**
 * 将 Zod 校验错误转换为应用错误对象
 * @param error - Zod 校验错误实例
 * @returns 标准化的应用错误对象，包含错误码、消息和相关字段信息
 * @internal
 */
function parseZodError(error: ZodError): AppError {
  const first = error.errors[0];
  return {
    code: ErrorCode.VALIDATION,
    message: first?.message || 'Validation failed',
    field: first?.path.join('.'),
  };
}

/**
 * 创建类型安全的 API 客户端
 * @template TEndpoints - 端点配置映射类型
 * @param config - API 配置对象，包含基础 URL 和端点定义
 * @returns 代理对象，其方法对应配置的各个 API 端点
 * @example
 * ```typescript
 * const api = createAPI({
 *   baseURL: 'https://api.example.com',
 *   endpoints: {
 *     getUser: {
 *       method: 'GET',
 *       path: '/users/:id',
 *       output: z.object({ id: z.number(), name: z.string() })
 *     },
 *     createUser: {
 *       method: 'POST',
 *       path: '/users',
 *       input: z.object({ name: z.string(), email: z.string().email() }),
 *       output: z.object({ id: z.number(), name: z.string(), email: z.string() })
 *     }
 *   }
 * });
 *
 * // 调用会自动进行类型检查和数据校验
 * const user = await api.getUser({ id: 1 });
 * const newUser = await api.createUser({ name: 'John', email: 'john@example.com' });
 * ```
 */
export function createAPI<TEndpoints extends Record<string, ApiEndpointConfig<any, any>>>(
  config: ApiConfig<TEndpoints>
): { [K in keyof TEndpoints]: (input?: any) => Promise<any> } {
  const endpoints = {} as any;

  for (const [name, ep] of Object.entries(config.endpoints)) {
    endpoints[name] = async (input?: any) => {
      if (ep.input) {
        const result = ep.input.safeParse(input);
        if (!result.success) throw parseZodError(result.error);
      }

      const url = config.baseURL + ep.path;
      const response = await fetch(url, { method: ep.method });
      const data = await response.json();

      if (ep.output) {
        return ep.output.parse(data);
      }
      return data;
    };
  }

  return endpoints;
}
