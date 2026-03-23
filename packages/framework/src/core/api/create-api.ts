/**
 * @fileoverview API 创建模块
 * @module core/api/create-api
 * @description 提供类型安全的 API 客户端创建功能，支持请求/响应数据的 Zod 校验
 */

import type { ApiConfig, ApiEndpointConfig, ApiErrorContext } from './types';
import { ZodError } from 'zod';
import { ErrorCode, enhanceError, mapHttpStatus, type AppError } from '../error';
import { resolveApiObservability } from './observability';

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

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

function parseNetworkError(error: unknown): AppError {
  return {
    code: ErrorCode.NETWORK,
    message: error instanceof Error ? error.message : 'Network request failed',
    retryable: true,
    original: error,
  };
}

function parseHttpError(response: Response, data?: unknown): AppError {
  const fallbackMessage = response.statusText || `Request failed with status ${response.status}`;
  const message =
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
      ? data.message
      : fallbackMessage;

  return {
    code: mapHttpStatus(response.status),
    message,
    statusCode: response.status,
    retryable: response.status >= 500,
    original: data,
  };
}

function parseUnknownError(error: unknown): AppError {
  if (error instanceof ZodError) {
    return parseZodError(error);
  }

  if (isAppError(error)) {
    return error;
  }

  return {
    code: ErrorCode.UNKNOWN,
    message: error instanceof Error ? error.message : 'Unknown error',
    original: error,
  };
}

async function notifyError(
  error: AppError,
  context: ApiErrorContext,
  endpoint: ApiEndpointConfig<any, any>,
  config: ApiConfig<Record<string, ApiEndpointConfig<any, any>>>
) {
  const enhanced = enhanceError(error);

  await endpoint.onError?.(enhanced, context);
  await config.onError?.(enhanced, context);

  return enhanced;
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
  const fetcher = config.fetcher ?? fetch;
  const observability = resolveApiObservability(config.observability);

  for (const [name, ep] of Object.entries(config.endpoints)) {
    endpoints[name] = async (input?: any) => {
      const context: ApiErrorContext = {
        endpointName: name,
        path: ep.path,
        method: ep.method,
        input,
      };

      if (ep.input) {
        const result = ep.input.safeParse(input);
        if (!result.success) {
          throw await notifyError(parseZodError(result.error), context, ep, config as any);
        }
      }

      const url = config.baseURL + ep.path;
      const startAt = Date.now();

      if (observability.enabled) {
        await Promise.all(
          observability.transports.map(transport =>
            transport({
              stage: 'request',
              endpointName: name,
              path: ep.path,
              method: ep.method,
              url,
              input,
            })
          )
        );
      }

      let response: Response;
      try {
        response = await fetcher(url, { method: ep.method });
      } catch (error) {
        const enhanced = await notifyError(parseNetworkError(error), context, ep, config as any);

        if (observability.enabled) {
          await Promise.all(
            observability.transports.map(transport =>
              transport({
                stage: 'error',
                endpointName: name,
                path: ep.path,
                method: ep.method,
                url,
                input,
                durationMs: Date.now() - startAt,
                error: enhanced,
              })
            )
          );
        }

        throw enhanced;
      }

      context.response = response;

      let data: unknown = undefined;
      const contentType = response.headers.get('content-type') || '';
      const canParseJson = contentType.includes('application/json');

      if (canParseJson) {
        try {
          data = await response.json();
        } catch {
          data = undefined;
        }
      }

      context.responseData = data;

      if (!response.ok) {
        const enhanced = await notifyError(
          parseHttpError(response, data),
          context,
          ep,
          config as any
        );

        if (observability.enabled) {
          await Promise.all(
            observability.transports.map(transport =>
              transport({
                stage: 'error',
                endpointName: name,
                path: ep.path,
                method: ep.method,
                url,
                input,
                response,
                responseData: data,
                statusCode: response.status,
                durationMs: Date.now() - startAt,
                error: enhanced,
              })
            )
          );
        }

        throw enhanced;
      }

      const businessError =
        ep.parseBusinessError?.(data, response) ?? config.parseBusinessError?.(data, response);

      if (businessError) {
        const enhanced = await notifyError(businessError, context, ep, config as any);

        if (observability.enabled) {
          await Promise.all(
            observability.transports.map(transport =>
              transport({
                stage: 'error',
                endpointName: name,
                path: ep.path,
                method: ep.method,
                url,
                input,
                response,
                responseData: data,
                statusCode: response.status,
                durationMs: Date.now() - startAt,
                error: enhanced,
              })
            )
          );
        }

        throw enhanced;
      }

      try {
        if (ep.output) {
          const parsed = ep.output.parse(data);

          if (observability.enabled) {
            await Promise.all(
              observability.transports.map(transport =>
                transport({
                  stage: 'response',
                  endpointName: name,
                  path: ep.path,
                  method: ep.method,
                  url,
                  input,
                  response,
                  responseData: parsed,
                  statusCode: response.status,
                  durationMs: Date.now() - startAt,
                })
              )
            );
          }

          return parsed;
        }
      } catch (error) {
        const enhanced = await notifyError(parseUnknownError(error), context, ep, config as any);

        if (observability.enabled) {
          await Promise.all(
            observability.transports.map(transport =>
              transport({
                stage: 'error',
                endpointName: name,
                path: ep.path,
                method: ep.method,
                url,
                input,
                response,
                responseData: data,
                statusCode: response.status,
                durationMs: Date.now() - startAt,
                error: enhanced,
              })
            )
          );
        }

        throw enhanced;
      }

      if (observability.enabled) {
        await Promise.all(
          observability.transports.map(transport =>
            transport({
              stage: 'response',
              endpointName: name,
              path: ep.path,
              method: ep.method,
              url,
              input,
              response,
              responseData: data,
              statusCode: response.status,
              durationMs: Date.now() - startAt,
            })
          )
        );
      }

      return data;
    };
  }

  return endpoints;
}
