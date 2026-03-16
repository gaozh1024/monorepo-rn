import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRequest } from '../useRequest';

describe('useRequest', () => {
  it('应该自动执行请求（manual=false）', async () => {
    const service = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useRequest(service));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data');
  });

  it('应该手动执行请求（manual=true）', async () => {
    const service = vi.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useRequest(service, { manual: true }));

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.run();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('data');
  });
});
