import { createAPI, ErrorCode } from '@gaozh1024/rn-kit';
import { appConfig } from '../bootstrap/app-config';
import type { ApiEndpointConfig } from '@gaozh1024/rn-kit';

/**
 * 创建应用 API 实例
 */
export function createAppAPI<T extends Record<string, ApiEndpointConfig<any, any>>>(endpoints: T) {
  return createAPI({
    baseURL: appConfig.apiBaseURL,
    endpoints,
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
