/**
 * @fileoverview 错误处理辅助函数模块
 * @module core/error/helpers
 * @description 提供 HTTP 状态码映射和错误对象增强功能
 */

import { ErrorCode, type AppError } from './types';

/**
 * 将 HTTP 状态码映射为应用错误码
 * @param status - HTTP 状态码
 * @returns 对应的 ErrorCode 枚举值
 * @example
 * ```typescript
 * const errorCode = mapHttpStatus(404); // ErrorCode.VALIDATION
 * const errorCode = mapHttpStatus(500); // ErrorCode.SERVER
 * const errorCode = mapHttpStatus(401); // ErrorCode.UNAUTHORIZED
 * ```
 */
export function mapHttpStatus(status: number): ErrorCode {
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status >= 400 && status < 500) return ErrorCode.VALIDATION;
  if (status >= 500) return ErrorCode.SERVER;
  return ErrorCode.UNKNOWN;
}

/**
 * 增强错误对象，添加便捷的判断属性
 * @param error - 基础应用错误对象
 * @returns 增强后的错误对象，包含 isValidation、isNetwork、isAuth、isRetryable 等属性
 * @example
 * ```typescript
 * const enhanced = enhanceError({
 *   code: ErrorCode.NETWORK,
 *   message: 'Connection timeout'
 * });
 *
 * if (enhanced.isNetwork) {
 *   showRetryButton();
 * }
 *
 * if (enhanced.isRetryable) {
 *   await retryRequest();
 * }
 * ```
 */
export function enhanceError(error: AppError): AppError & {
  isValidation: boolean;
  isNetwork: boolean;
  isAuth: boolean;
  isRetryable: boolean;
} {
  return {
    ...error,
    get isValidation() {
      return error.code === ErrorCode.VALIDATION;
    },
    get isNetwork() {
      return error.code === ErrorCode.NETWORK;
    },
    get isAuth() {
      return error.code === ErrorCode.UNAUTHORIZED || error.code === ErrorCode.FORBIDDEN;
    },
    get isRetryable() {
      return error.retryable ?? error.code === ErrorCode.NETWORK;
    },
  } as any;
}
