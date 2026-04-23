import {
  createAPI,
  ErrorCode,
  type ApiEndpointConfig,
  type ApiErrorContext,
} from '@gaozh1024/rn-kit';
import { appConfig } from '../bootstrap/app-config';
import { session } from '../data/session';

function sanitizeRecipePayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(item => sanitizeRecipePayload(item));
  }

  if (value == null || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, currentValue]) => {
      if (['password', 'token', 'authorization', 'secret'].includes(key.toLowerCase())) {
        return [key, '***'];
      }

      return [key, sanitizeRecipePayload(currentValue)];
    })
  );
}

/**
 * Auth-aware API factory recipe.
 * Mirrors the starter template pattern: bearer token headers, dev observability, and business error parsing.
 */
export function createRecipeAPI<T extends Record<string, ApiEndpointConfig<any, any>>>(
  endpoints: T
) {
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
      sanitize: value => sanitizeRecipePayload(value),
    },
    onError: (error: unknown, context: ApiErrorContext) => {
      console.error('[Recipe API Error]', error, context);
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
