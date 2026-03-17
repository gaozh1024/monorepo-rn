export enum ErrorCode {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER = 'SERVER',
  BUSINESS = 'BUSINESS',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  field?: string;
  retryable?: boolean;
  original?: any;
}
