import { createAPI, ErrorCode } from '@gaozh1024/rn-kit';
import { appConfig } from '../bootstrap/app-config';
import type { ApiEndpointConfig } from '@gaozh1024/rn-kit';

const SENSITIVE_FIELDS = new Set([
  'password',
  'confirmpassword',
  'oldpassword',
  'newpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'code',
]);

function sanitizeObservabilityPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(item => sanitizeObservabilityPayload(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, currentValue]) => {
      if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
        return [key, '***'];
      }

      return [key, sanitizeObservabilityPayload(currentValue)];
    })
  );
}

/**
 * 创建应用 API 实例
 */
export function createAppAPI<T extends Record<string, ApiEndpointConfig<any, any>>>(endpoints: T) {
  return createAPI({
    baseURL: appConfig.apiBaseURL,
    endpoints,
    observability: {
      enabled: appConfig.env !== 'production',
      namespace: 'api',
      includeInput: true,
      sanitize: value => sanitizeObservabilityPayload(value),
    },
    onError: (error, context) => {
      // 统一监听：401、toast、埋点、日志
      console.error('[API Error]', error, context);
    },
    parseBusinessError: data => {
      const result = data as { success?: boolean; message?: string };
      if (result?.success === false) {
        return {
          code: ErrorCode.BUSINESS,
          message: result.message || 'Business error',
        };
      }
      return null;
    },
  });
}
