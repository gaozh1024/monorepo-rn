import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  streamRequest,
  createBaseAPIStreamRequest,
  StreamRequestConfig,
  StreamCallbacks,
} from '../api/stream-request';
import { APIError, ApiErrorCode } from '../api/base-api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock logger
vi.mock('../logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('streamRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该成功接收流式数据', async () => {
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"content":"Hello"}\n\n'),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"content":" World"}\n\n'),
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: [DONE]\n\n'),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      cancel: vi.fn(),
    };

    const mockResponse = {
      ok: true,
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const onMessage = vi.fn();
    const onComplete = vi.fn();
    const onStart = vi.fn();

    streamRequest(
      { url: 'https://api.example.com/stream' },
      {
        onStart,
        onMessage,
        onComplete,
      }
    );

    // 等待异步操作完成
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenNthCalledWith(1, { content: 'Hello' });
    expect(onMessage).toHaveBeenNthCalledWith(2, { content: ' World' });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('应该处理 HTTP 错误', async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    };

    mockFetch.mockResolvedValue(mockResponse);

    const onError = vi.fn();

    streamRequest(
      { url: 'https://api.example.com/stream' },
      {
        onMessage: vi.fn(),
        onError,
      }
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(APIError);
    expect(onError.mock.calls[0][0].code).toBe(ApiErrorCode.UNAUTHORIZED);
  });

  it('应该支持中断请求', async () => {
    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve({ done: false, value: new Uint8Array() }), 1000);
        });
      }),
      cancel: vi.fn(),
    };

    const mockResponse = {
      ok: true,
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const controller = streamRequest(
      { url: 'https://api.example.com/stream' },
      {
        onMessage: vi.fn(),
      }
    );

    expect(controller.isActive()).toBe(true);

    controller.abort();

    expect(controller.isActive()).toBe(false);
  });

  it('应该支持重试机制', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        getReader: () => ({
          read: vi
            .fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"content":"Hello"}\n\n'),
            })
            .mockResolvedValueOnce({ done: true, value: undefined }),
          cancel: vi.fn(),
        }),
      },
    });

    const onMessage = vi.fn();

    streamRequest(
      {
        url: 'https://api.example.com/stream',
        retryCount: 1,
        retryDelay: 10,
      },
      {
        onMessage,
      }
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(onMessage).toHaveBeenCalledWith({ content: 'Hello' });
  });

  it('应该正确处理原始字符串数据（非 JSON）', async () => {
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: Hello World\n\n'),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      cancel: vi.fn(),
    };

    const mockResponse = {
      ok: true,
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const onMessage = vi.fn();

    streamRequest(
      { url: 'https://api.example.com/stream' },
      {
        onMessage,
      }
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(onMessage).toHaveBeenCalledWith('Hello World');
  });

  it('应该忽略空行和注释行', async () => {
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(': comment\n\ndata: {"content":"valid"}\n\n'),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      cancel: vi.fn(),
    };

    const mockResponse = {
      ok: true,
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const onMessage = vi.fn();

    streamRequest(
      { url: 'https://api.example.com/stream' },
      {
        onMessage,
      }
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith({ content: 'valid' });
  });
});

describe('createBaseAPIStreamRequest', () => {
  it('应该正确构建请求 URL 和头部', async () => {
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"result":"ok"}\n\n'),
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
      cancel: vi.fn(),
    };

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      body: {
        getReader: () => mockReader,
      },
    });

    const onMessage = vi.fn();

    createBaseAPIStreamRequest(
      'https://api.example.com',
      () => ({ Authorization: 'Bearer token123' }),
      '/chat',
      { message: 'Hello' },
      { onMessage },
      { timeout: 30000 }
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/chat',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer token123',
          Accept: 'text/event-stream',
        }),
        body: JSON.stringify({ message: 'Hello' }),
      })
    );
  });
});
