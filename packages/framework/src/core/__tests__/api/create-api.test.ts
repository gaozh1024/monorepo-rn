import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createAPI } from '../../api/create-api';

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
});
