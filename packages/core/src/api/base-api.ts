import { createLogger } from '../logger';
import { createBaseAPIStreamRequest, StreamCallbacks, StreamController } from './stream-request';

/** API Logger */
const apiLogger = createLogger('API');

/** API 请求配置选项 */
export interface ApiRequestOptions {
  /** 请求头 */
  headers?: Record<string, string>;
  /** 是否需要认证（添加 Authorization header） */
  requireAuth?: boolean;
  /** 认证令牌 */
  token?: string;
  /** 请求超时时间（毫秒） */
  timeout?: number;
}

/** API 通用响应格式 */
export interface ApiResponse<T> {
  /** 响应数据内容 */
  data: T;
  /** 响应消息 */
  message: string;
  /** 请求是否成功 */
  success: boolean;
}

/** API 错误信息 */
export interface ApiError {
  /** 错误消息描述 */
  message: string;
  /** 错误代码 */
  code: string;
  /** HTTP 状态码（可选） */
  statusCode?: number;
  /** 错误详细信息（可选） */
  details?: Record<string, any>;
}

/** API 错误代码枚举 */
export enum ApiErrorCode {
  /** 网络连接错误 */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** 数据验证错误 */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** 未授权访问 */
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** 禁止访问 */
  FORBIDDEN = 'FORBIDDEN',
  /** 资源未找到 */
  NOT_FOUND = 'NOT_FOUND',
  /** 服务器内部错误 */
  SERVER_ERROR = 'SERVER_ERROR',
  /** 未知错误 */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/** 自定义 API 错误类 */
export class APIError extends Error {
  /** 错误代码 */
  public readonly code: ApiErrorCode;
  /** HTTP 状态码 */
  public readonly statusCode?: number;
  /** 错误详细信息 */
  public readonly details?: Record<string, any>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'APIError';
    this.code = error.code as ApiErrorCode;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}

/** API 基础配置 */
export interface BaseAPIConfig {
  /** API 基础 URL */
  baseURL: string;
  /** 默认请求头 */
  defaultHeaders?: Record<string, string>;
  /** 是否需要认证 */
  requireAuth?: boolean;
  /** 默认认证令牌 */
  token?: string;
}

/**
 * API 基础类
 * 提供 HTTP 请求的通用方法和错误处理
 */
export class BaseAPI {
  /** API 基础 URL */
  protected baseURL: string;
  /** 默认请求头 */
  protected defaultHeaders: Record<string, string>;
  /** 是否需要认证 */
  protected requireAuth: boolean;
  /** 认证令牌 */
  protected token?: string;

  /**
   * 构造函数
   * @param config API 配置选项
   */
  constructor(config?: Partial<BaseAPIConfig>) {
    this.baseURL = config?.baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config?.defaultHeaders,
    };
    this.requireAuth = config?.requireAuth ?? false;
    this.token = config?.token;
  }

  /**
   * 设置认证令牌
   * @param token 认证令牌
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * 获取认证令牌
   * @returns 当前认证令牌
   */
  public getToken(): string | undefined {
    return this.token;
  }

  /**
   * 清除认证令牌
   */
  public clearToken(): void {
    this.token = undefined;
  }

  /**
   * 获取完整的请求头
   * @param options 请求选项
   * @returns 完整的请求头对象
   */
  protected getHeaders(options?: ApiRequestOptions): Record<string, string> {
    const headers = {
      ...this.defaultHeaders,
      ...options?.headers,
    };

    const requireAuth = options?.requireAuth ?? this.requireAuth;
    const token = options?.token ?? this.token;

    if (requireAuth && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 通用 HTTP 请求方法
   * @param endpoint API 端点路径
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async request<T>(
    endpoint: string,
    options: RequestInit & ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options);
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : undefined;
    const logContext = { method, url, endpoint };

    try {
      apiLogger.debug('请求', { ...logContext, headers, body });

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const errorData: ApiError = await this.parseErrorResponse(response);
        apiLogger.error('请求错误', { ...logContext, body, ...errorData });
        throw new APIError(errorData);
      }

      apiLogger.debug('响应', { ...logContext, status: response.status });
      const data = await response.json();

      return {
        data,
        message: data.message || 'Success',
        success: true,
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new APIError({
          message: error.message,
          code: ApiErrorCode.NETWORK_ERROR,
          statusCode: 0,
        });
      }

      throw new APIError({
        message: 'An unexpected error occurred',
        code: ApiErrorCode.UNKNOWN_ERROR,
        statusCode: 0,
      });
    }
  }

  /**
   * 解析 API 错误响应
   * @param response HTTP 响应对象
   * @returns Promise<ApiError> 标准化的错误对象
   */
  protected async parseErrorResponse(response: Response): Promise<ApiError> {
    try {
      const errorData = await response.json();
      return {
        message: errorData.message || 'Request failed',
        code: (errorData.code as ApiErrorCode) || this.getErrorCodeFromStatus(response.status),
        statusCode: response.status,
        details: errorData.details,
      };
    } catch {
      return {
        message: 'Request failed',
        code: this.getErrorCodeFromStatus(response.status),
        statusCode: response.status,
      };
    }
  }

  /**
   * 根据 HTTP 状态码获取对应的错误代码
   * @param status HTTP 状态码
   * @returns ApiErrorCode 标准化的错误代码
   */
  protected getErrorCodeFromStatus(status: number): ApiErrorCode {
    switch (status) {
      case 400:
        return ApiErrorCode.VALIDATION_ERROR;
      case 401:
        return ApiErrorCode.UNAUTHORIZED;
      case 403:
        return ApiErrorCode.FORBIDDEN;
      case 404:
        return ApiErrorCode.NOT_FOUND;
      case 500:
      case 502:
      case 503:
      case 504:
        return ApiErrorCode.SERVER_ERROR;
      default:
        return ApiErrorCode.UNKNOWN_ERROR;
    }
  }

  /**
   * GET 请求方法
   * @param endpoint API 端点路径
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST 请求方法
   * @param endpoint API 端点路径
   * @param data 请求数据
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT 请求方法
   * @param endpoint API 端点路径
   * @param data 请求数据
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE 请求方法
   * @param endpoint API 端点路径
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async delete<T>(
    endpoint: string,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * PATCH 请求方法
   * @param endpoint API 端点路径
   * @param data 请求数据
   * @param options 请求配置选项
   * @returns Promise<ApiResponse<T>> API 响应数据
   */
  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * 流式请求方法（SSE）
   * 适用于 AI 聊天等需要实时接收数据的场景
   *
   * @param endpoint API 端点路径
   * @param data 请求数据
   * @param callbacks 流式响应回调
   * @param options 请求配置选项（支持 timeout、retryCount、retryDelay）
   * @returns StreamController 控制器，可中断请求
   *
   * @example
   * ```typescript
   * const controller = api.stream(
   *   '/chat',
   *   { message: '你好', model: 'gpt-4' },
   *   {
   *     onStart: () => console.log('开始'),
   *     onMessage: (chunk) => appendToUI(chunk.content),
   *     onError: (err) => showError(err.message),
   *     onComplete: () => console.log('完成'),
   *   },
   *   { retryCount: 2 }
   * );
   *
   * // 中断生成
   * controller.abort();
   * ```
   */
  protected stream<T = unknown>(
    endpoint: string,
    data: unknown,
    callbacks: StreamCallbacks<T>,
    options?: ApiRequestOptions & { timeout?: number; retryCount?: number; retryDelay?: number }
  ): StreamController {
    return createBaseAPIStreamRequest(
      this.baseURL,
      opts => this.getHeaders(opts),
      endpoint,
      data,
      callbacks,
      options
    );
  }
}
