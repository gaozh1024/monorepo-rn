import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createAPI } from '../../api/create-api';
import { ErrorCode } from '../../error/types';

describe('createAPI', () => {
  it('应该创建API实例', () => {
    const api = createAPI({
      baseURL: 'https://api.example.com',
      endpoints: {},
    });
    expect(api).toBeDefined();
  });

  it('应该支持Zod校验', () => {
    const UserSchema = z.object({ id: z.string(), name: z.string() });

    const api = createAPI({
      baseURL: 'https://api.example.com',
      endpoints: {
        getUser: {
          method: 'GET',
          path: '/users/:id',
          output: UserSchema,
        },
      },
    });

    expect(api.getUser).toBeDefined();
  });

  it('应该验证输入数据', async () => {
    const InputSchema = z.object({ email: z.string().email() });

    const api = createAPI({
      baseURL: 'https://api.example.com',
      endpoints: {
        createUser: {
          method: 'POST',
          path: '/users',
          input: InputSchema,
        },
      },
    });

    // 无效输入应该抛出错误
    await expect(api.createUser({ email: 'invalid' })).rejects.toThrow();
  });

  it('应该统一监听 HTTP 错误', async () => {
    const onError = vi.fn();

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(
        async () =>
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'content-type': 'application/json' },
          })
      ) as typeof fetch,
      onError,
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await expect(api.getProfile()).rejects.toMatchObject({
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      isAuth: true,
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: ErrorCode.UNAUTHORIZED }),
      expect.objectContaining({ endpointName: 'getProfile', path: '/profile', method: 'GET' })
    );
  });

  it('应该统一监听网络错误', async () => {
    const onError = vi.fn();

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(async () => {
        throw new Error('Network down');
      }) as typeof fetch,
      onError,
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await expect(api.getProfile()).rejects.toMatchObject({
      code: ErrorCode.NETWORK,
      isNetwork: true,
      isRetryable: true,
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('应该支持统一业务错误解析', async () => {
    const onError = vi.fn();

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false, message: 'Business failed' }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
      ) as typeof fetch,
      parseBusinessError: data => {
        const result = data as { success?: boolean; message?: string };
        if (result.success === false) {
          return {
            code: ErrorCode.BUSINESS,
            message: result.message || 'Business error',
          };
        }
        return null;
      },
      onError,
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await expect(api.getProfile()).rejects.toMatchObject({
      code: ErrorCode.BUSINESS,
      message: 'Business failed',
    });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('应该优先调用 endpoint 级错误监听器，再调用全局监听器', async () => {
    const calls: string[] = [];

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(
        async () =>
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'content-type': 'application/json' },
          })
      ) as typeof fetch,
      onError: () => {
        calls.push('global');
      },
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
          onError: () => {
            calls.push('endpoint');
          },
        },
      },
    });

    await expect(api.getProfile()).rejects.toBeDefined();
    expect(calls).toEqual(['endpoint', 'global']);
  });
});
