/**
 * @fileoverview 错误类型定义模块
 * @module core/error/types
 * @description 定义应用错误码枚举和错误对象接口
 */

/**
 * 应用错误码枚举
 * @enum {string}
 * @example
 * ```typescript
 * if (error.code === ErrorCode.UNAUTHORIZED) {
 *   redirectToLogin();
 * }
 * ```
 */
export enum ErrorCode {
  /** 数据校验错误 */
  VALIDATION = 'VALIDATION',
  /** 网络连接错误 */
  NETWORK = 'NETWORK',
  /** 未授权访问 */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** 禁止访问 */
  FORBIDDEN = 'FORBIDDEN',
  /** 服务器内部错误 */
  SERVER = 'SERVER',
  /** 业务逻辑错误 */
  BUSINESS = 'BUSINESS',
  /** 未知错误 */
  UNKNOWN = 'UNKNOWN',
}

/**
 * 应用错误对象接口
 * @example
 * ```typescript
 * const error: AppError = {
 *   code: ErrorCode.VALIDATION,
 *   message: 'Email format is invalid',
 *   field: 'email',
 *   retryable: false
 * };
 * ```
 */
export interface AppError {
  /** 错误码 */
  code: ErrorCode;
  /** 错误消息 */
  message: string;
  /** HTTP 状态码（如适用） */
  statusCode?: number;
  /** 相关字段（如校验错误） */
  field?: string;
  /** 是否可重试 */
  retryable?: boolean;
  /** 原始错误对象 */
  original?: any;
}
