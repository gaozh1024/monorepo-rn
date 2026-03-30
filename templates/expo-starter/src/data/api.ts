import {
  createAPI,
  ErrorCode,
  type ApiEndpointConfig,
  type ApiErrorContext,
  type ApiLogStage,
} from '@gaozh1024/rn-kit';
import { appConfig } from '../bootstrap/app-config';
import { session } from './session';

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

  if (value == null || typeof value !== 'object') {
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

export function createAppAPI<T extends Record<string, ApiEndpointConfig<any, any>>>(endpoints: T) {
  return createAPI({
    baseURL: appConfig.apiBaseURL,
    endpoints,
    getHeaders: async () => {
      const token = await session.getToken();
      return token ? { Authorization: 'Bearer ' + token } : undefined;
    },
    observability: {
      enabled: appConfig.env !== 'production',
      namespace: 'api',
      includeInput: true,
      sanitize: (
        value: unknown,
        _meta: { stage: ApiLogStage; field: 'input' | 'responseData' | 'error' }
      ) => sanitizeObservabilityPayload(value),
    },
    onError: (error: unknown, context: ApiErrorContext) => {
      console.error('[API Error]', error, context);
    },
    parseBusinessError: (data: unknown) => {
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
