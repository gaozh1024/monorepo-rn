import { ErrorCode, type AppError } from './types';

export function mapHttpStatus(status: number): ErrorCode {
  if (status === 401) return ErrorCode.UNAUTHORIZED;
  if (status === 403) return ErrorCode.FORBIDDEN;
  if (status >= 400 && status < 500) return ErrorCode.VALIDATION;
  if (status >= 500) return ErrorCode.SERVER;
  return ErrorCode.UNKNOWN;
}

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
