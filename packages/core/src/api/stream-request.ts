import { createLogger } from '../logger';
import { ApiErrorCode, APIError, ApiRequestOptions } from './base-api';

/** 流式请求日志 */
const streamLogger = createLogger('Stream');

/** SSE 数据行前缀 */
const SSE_DATA_PREFIX = 'data: ';

/** SSE 结束标记 */
const SSE_DONE_MARKER = '[DONE]';

/** 流式响应回调 */
export interface StreamCallbacks<T> {
  /** 开始接收数据时触发 */
  onStart?: () => void;
  /** 接收到数据片段时触发 */
  onMessage: (chunk: T) => void;
  /** 发生错误时触发 */
  onError?: (error: APIError) => void;
  /** 完成接收时触发 */
  onComplete?: () => void;
}

/** 流式请求配置 */
export interface StreamRequestConfig {
  /** 请求 URL */
  url: string;
  /** 请求方法 */
  method?: 'POST' | 'GET';
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求体（用于 POST） */
  body?: unknown;
  /** 超时时间（毫秒，默认 60000） */
  timeout?: number;
  /** 重试次数（默认 0） */
  retryCount?: number;
  /** 重试间隔（毫秒，默认 1000） */
  retryDelay?: number;
}

/** 流式请求控制器 */
export interface StreamController {
  /** 中断流式请求 */
  abort: () => void;
  /** 检查是否正在活跃 */
  isActive: () => boolean;
}

/**
 * 解析 SSE 数据行
 * @param line SSE 数据行
 * @returns 解析后的数据，如果是结束标记返回 null，如果格式错误返回 undefined
 */
function parseSSELine(line: string): unknown | null | undefined {
  const trimmed = line.trim();

  // 忽略空行和注释行
  if (!trimmed || trimmed.startsWith(':')) {
    return undefined;
  }

  // 必须是以 data: 开头
  if (!trimmed.startsWith(SSE_DATA_PREFIX)) {
    return undefined;
  }

  const data = trimmed.slice(SSE_DATA_PREFIX.length).trim();

  // 结束标记
  if (data === SSE_DONE_MARKER) {
    return null;
  }

  // 尝试解析 JSON
  try {
    return JSON.parse(data);
  } catch {
    // 不是 JSON，返回原始字符串
    return data;
  }
}

/**
 * 创建超时处理
 * @param timeout 超时时间（毫秒）
 * @param abortController AbortController 实例
 * @returns 超时 timer ID
 */
function createTimeout(
  timeout: number,
  abortController: AbortController
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    abortController.abort();
  }, timeout);
}

/**
 * 流式请求函数
 * 支持 SSE (Server-Sent Events) 协议的流式数据接收
 *
 * @param config 流式请求配置
 * @param callbacks 回调函数
 * @returns StreamController 控制器，可用于中断请求
 *
 * @example
 * ```typescript
 * const controller = streamRequest(
 *   {
 *     url: 'https://api.example.com/chat',
 *     method: 'POST',
 *     body: { message: '你好' },
 *     retryCount: 2,
 *   },
 *   {
 *     onStart: () => console.log('开始'),
 *     onMessage: (chunk) => console.log('收到:', chunk),
 *     onError: (err) => console.error('错误:', err),
 *     onComplete: () => console.log('完成'),
 *   }
 * );
 *
 * // 中断请求
 * controller.abort();
 * ```
 */
export function streamRequest<T = unknown>(
  config: StreamRequestConfig,
  callbacks: StreamCallbacks<T>
): StreamController {
  const {
    url,
    method = 'POST',
    headers = {},
    body,
    timeout = 60000,
    retryCount = 0,
    retryDelay = 1000,
  } = config;

  const abortController = new AbortController();
  let retryTimes = 0;
  let isCompleted = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clearRequestTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const execute = async () => {
    try {
      streamLogger.debug('流式请求开始', { url, method, retryTimes });

      const requestHeaders: Record<string, string> = {
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...headers,
      };

      // POST 请求默认添加 Content-Type
      if (method === 'POST' && body && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method,
        headers: requestHeaders,
        signal: abortController.signal,
      };

      if (body && method === 'POST') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      // 设置超时
      timeoutId = createTimeout(timeout, abortController);

      const response = await fetch(url, fetchOptions);

      // 清除超时
      clearRequestTimeout();

      if (!response.ok) {
        throw new APIError({
          message: `HTTP error: ${response.status} ${response.statusText}`,
          code: getErrorCodeFromStatus(response.status),
          statusCode: response.status,
        });
      }

      // 首次成功响应，触发 onStart
      if (retryTimes === 0) {
        callbacks.onStart?.();
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new APIError({
          message: 'Response body is not readable',
          code: ApiErrorCode.UNKNOWN_ERROR,
        });
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // 解码数据
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 按行分割处理
        const lines = buffer.split('\n');
        // 保留最后一个不完整的行到 buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const parsed = parseSSELine(line);

          // 结束标记
          if (parsed === null) {
            isCompleted = true;
            callbacks.onComplete?.();
            return;
          }

          // 有效数据
          if (parsed !== undefined) {
            callbacks.onMessage(parsed as T);
          }
        }
      }

      // 处理 buffer 中剩余的数据
      if (buffer) {
        const parsed = parseSSELine(buffer);
        if (parsed !== null && parsed !== undefined) {
          callbacks.onMessage(parsed as T);
        }
      }

      if (!isCompleted) {
        isCompleted = true;
        callbacks.onComplete?.();
      }

      streamLogger.debug('流式请求完成', { url });
    } catch (error) {
      clearRequestTimeout();

      // 用户主动中断，不触发错误回调
      if (error instanceof Error && error.name === 'AbortError') {
        streamLogger.debug('流式请求被中断', { url });
        return;
      }

      // 是否需要重试
      const shouldRetry = retryTimes < retryCount && isRetryableError(error);

      if (shouldRetry) {
        retryTimes++;
        streamLogger.warn('流式请求失败，准备重试', {
          url,
          retryTimes,
          error: error instanceof Error ? error.message : String(error),
        });

        setTimeout(execute, retryDelay);
        return;
      }

      // 最终错误处理
      const apiError =
        error instanceof APIError
          ? error
          : new APIError({
              message: error instanceof Error ? error.message : 'Stream request failed',
              code: ApiErrorCode.NETWORK_ERROR,
            });

      streamLogger.error('流式请求失败', { url, error: apiError.message });
      callbacks.onError?.(apiError);
    }
  };

  // 启动请求
  execute();

  return {
    abort: () => {
      clearRequestTimeout();
      abortController.abort();
    },
    isActive: () => !abortController.signal.aborted && !isCompleted,
  };
}

/**
 * 根据 HTTP 状态码获取错误代码
 */
function getErrorCodeFromStatus(status: number): ApiErrorCode {
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
 * 判断是否是可以重试的错误
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    // 网络错误或服务器错误可以重试
    return error.code === ApiErrorCode.NETWORK_ERROR || error.code === ApiErrorCode.SERVER_ERROR;
  }
  return true; // 未知错误也尝试重试
}

/**
 * BaseAPI 的流式请求方法封装
 *
 * @param baseURL 基础 URL
 * @param getHeaders 获取请求头的函数
 * @param endpoint API 端点
 * @param body 请求体
 * @param callbacks 回调函数
 * @param options 额外选项
 * @returns StreamController
 */
export function createBaseAPIStreamRequest<T = unknown>(
  baseURL: string,
  getHeaders: (options?: ApiRequestOptions) => Record<string, string>,
  endpoint: string,
  body: unknown,
  callbacks: StreamCallbacks<T>,
  options?: ApiRequestOptions & { timeout?: number; retryCount?: number; retryDelay?: number }
): StreamController {
  const url = `${baseURL}${endpoint}`;
  const headers = getHeaders(options);

  return streamRequest<T>(
    {
      url,
      method: 'POST',
      headers,
      body,
      timeout: options?.timeout,
      retryCount: options?.retryCount,
      retryDelay: options?.retryDelay,
    },
    callbacks
  );
}
