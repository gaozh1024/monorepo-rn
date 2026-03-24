import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createAPI } from '../../api/create-api';
import { ErrorCode } from '../../error/types';
import { setGlobalLogger } from '../../logger';

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

  it('应该为 POST 请求发送 JSON body 并合并 headers', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
    );

    const api = createAPI({
      baseURL: 'https://api.example.com',
      headers: {
        Accept: 'application/json',
      },
      fetcher: fetcher as typeof fetch,
      endpoints: {
        requestPhoneCode: {
          method: 'POST',
          path: '/api/v1/auth/phone-code',
          headers: {
            'X-Trace-Id': 'trace-123',
          },
          input: z.object({
            phone: z.string(),
            code_type: z.enum(['register', 'login', 'reset_password']),
          }),
          output: z.object({
            ok: z.boolean(),
          }),
        },
      },
    });

    const payload = {
      phone: '18092006106',
      code_type: 'register' as const,
    };

    await expect(api.requestPhoneCode(payload)).resolves.toEqual({ ok: true });

    expect(fetcher).toHaveBeenCalledTimes(1);

    const [url, init] = fetcher.mock.calls[0]!;
    const headers = new Headers(init?.headers);

    expect(url).toBe('https://api.example.com/api/v1/auth/phone-code');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify(payload));
    expect(headers.get('accept')).toBe('application/json');
    expect(headers.get('content-type')).toBe('application/json');
    expect(headers.get('x-trace-id')).toBe('trace-123');
  });

  it('应该为带路径参数的 POST 请求替换 URL，同时仍发送完整 body', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(null, {
          status: 204,
        })
    );

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: fetcher as typeof fetch,
      endpoints: {
        revokeDevice: {
          method: 'POST',
          path: '/api/v1/devices/{device_id}/revoke',
          input: z.object({
            device_id: z.string(),
          }),
          output: z.void(),
        },
      },
    });

    const payload = {
      device_id: 'device-123',
    };

    await expect(api.revokeDevice(payload)).resolves.toBeUndefined();

    const [url, init] = fetcher.mock.calls[0]!;
    const headers = new Headers(init?.headers);

    expect(url).toBe('https://api.example.com/api/v1/devices/device-123/revoke');
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify(payload));
    expect(headers.get('content-type')).toBe('application/json');
  });

  it('应该支持异步动态 headers 注入，并允许 endpoint 覆盖全局同名 header', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
    );

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: fetcher as typeof fetch,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer static-token',
      },
      getHeaders: async context => {
        expect(context.endpointName).toBe('getProfile');
        expect(context.url).toBe('https://api.example.com/profile?include=devices');
        return {
          Authorization: 'Bearer global-token',
          'X-App-Version': '1.0.0',
        };
      },
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
          getHeaders: async () => ({
            Authorization: 'Bearer endpoint-token',
            'X-Endpoint': 'profile',
          }),
          input: z.object({
            include: z.string().optional(),
          }),
          output: z.object({
            ok: z.boolean(),
          }),
        },
      },
    });

    await expect(api.getProfile({ include: 'devices' })).resolves.toEqual({ ok: true });

    const [, init] = fetcher.mock.calls[0]!;
    const headers = new Headers(init?.headers);

    expect(headers.get('accept')).toBe('application/json');
    expect(headers.get('authorization')).toBe('Bearer endpoint-token');
    expect(headers.get('x-app-version')).toBe('1.0.0');
    expect(headers.get('x-endpoint')).toBe('profile');
  });

  it('GET 请求应该替换路径参数并把剩余字段拼到 query，不发送 body', async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
    );

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: fetcher as typeof fetch,
      endpoints: {
        getDevice: {
          method: 'GET',
          path: '/api/v1/devices/{device_id}',
          input: z.object({
            device_id: z.string(),
            include: z.string().optional(),
          }),
          output: z.object({
            ok: z.boolean(),
          }),
        },
      },
    });

    await expect(
      api.getDevice({
        device_id: 'device-123',
        include: 'status',
      })
    ).resolves.toEqual({ ok: true });

    const [url, init] = fetcher.mock.calls[0]!;

    expect(url).toBe('https://api.example.com/api/v1/devices/device-123?include=status');
    expect(init?.method).toBe('GET');
    expect(init?.body).toBeUndefined();
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

  it('应该输出 request/response/error observability 事件', async () => {
    const transport = vi.fn();
    const successApi = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
      ) as typeof fetch,
      observability: {
        enabled: true,
        transports: [transport],
      },
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await successApi.getProfile({ include: 'stats' });

    expect(transport).toHaveBeenCalledTimes(2);
    expect(transport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        stage: 'request',
        endpointName: 'getProfile',
        method: 'GET',
        path: '/profile',
      })
    );
    expect(transport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        stage: 'response',
        endpointName: 'getProfile',
        method: 'GET',
        path: '/profile',
        statusCode: 200,
      })
    );

    transport.mockClear();

    const errorApi = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(async () => {
        throw new Error('Network down');
      }) as typeof fetch,
      observability: {
        enabled: true,
        transports: [transport],
      },
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await expect(errorApi.getProfile()).rejects.toMatchObject({
      code: ErrorCode.NETWORK,
    });

    expect(transport).toHaveBeenCalledTimes(2);
    expect(transport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        stage: 'request',
        endpointName: 'getProfile',
      })
    );
    expect(transport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        stage: 'error',
        endpointName: 'getProfile',
        error: expect.objectContaining({ code: ErrorCode.NETWORK }),
      })
    );
  });

  it('应该通过全局 logger 自动记录网络请求日志', async () => {
    const logger = {
      log: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    setGlobalLogger(logger);

    const api = createAPI({
      baseURL: 'https://api.example.com',
      fetcher: vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
      ) as typeof fetch,
      observability: {
        enabled: true,
      },
      endpoints: {
        getProfile: {
          method: 'GET',
          path: '/profile',
        },
      },
    });

    await api.getProfile({ id: 1 });

    expect(logger.debug).toHaveBeenCalledWith(
      'API Request GET /profile',
      expect.objectContaining({
        endpointName: 'getProfile',
        method: 'GET',
        path: '/profile',
        url: 'https://api.example.com/profile?id=1',
      }),
      'api'
    );
    expect(logger.info).toHaveBeenCalledWith(
      'API Response GET /profile 200',
      expect.objectContaining({
        endpointName: 'getProfile',
        statusCode: 200,
      }),
      'api'
    );

    setGlobalLogger(null);
  });
});
