import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSetState } from '../useSetState';

describe('useSetState', () => {
  it('应该初始化状态', () => {
    const { result } = renderHook(() => useSetState({ name: 'John', age: 30 }));

    expect(result.current[0]).toEqual({ name: 'John', age: 30 });
  });

  it('应该合并更新状态', () => {
    const { result } = renderHook(() => useSetState({ name: 'John', age: 30 }));

    act(() => {
      result.current[1]({ name: 'Jane' });
    });

    expect(result.current[0]).toEqual({ name: 'Jane', age: 30 });
  });
});
