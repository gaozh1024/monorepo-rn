import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../../error/hooks';

describe('useAsync', () => {
  it('初始状态应该是空闲的', () => {
    const { result } = renderHook(() => useAsync());
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('应该成功执行异步操作', async () => {
    const { result } = renderHook(() => useAsync<string>());

    // 使用延迟的 Promise
    const promise = new Promise<string>(resolve => {
      setTimeout(() => resolve('success'), 10);
    });

    // 执行异步操作
    let executePromise: Promise<string>;
    await waitFor(() => {
      executePromise = result.current.execute(promise);
    });

    // 等待操作完成
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('应该捕获错误', async () => {
    const { result } = renderHook(() => useAsync());

    const error = new Error('test error');
    const promise = Promise.reject(error);

    try {
      await result.current.execute(promise);
    } catch {}

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('reset应该清空状态', async () => {
    const { result } = renderHook(() => useAsync<string>());

    await result.current.execute(Promise.resolve('data'));
    result.current.reset();

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
