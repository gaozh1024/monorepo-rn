import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageDrawer } from '../../hooks/usePageDrawer';

describe('usePageDrawer', () => {
  it('应该支持默认关闭状态', () => {
    const { result } = renderHook(() => usePageDrawer());

    expect(result.current.visible).toBe(false);
  });

  it('应该支持默认打开状态', () => {
    const { result } = renderHook(() => usePageDrawer(true));

    expect(result.current.visible).toBe(true);
  });

  it('应该支持 open 和 close', () => {
    const { result } = renderHook(() => usePageDrawer());

    act(() => {
      result.current.open();
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.visible).toBe(false);
  });

  it('应该支持 toggle', () => {
    const { result } = renderHook(() => usePageDrawer());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.visible).toBe(false);
  });

  it('应该支持 setVisible', () => {
    const { result } = renderHook(() => usePageDrawer());

    act(() => {
      result.current.setVisible(true);
    });
    expect(result.current.visible).toBe(true);

    act(() => {
      result.current.setVisible(false);
    });
    expect(result.current.visible).toBe(false);
  });
});
