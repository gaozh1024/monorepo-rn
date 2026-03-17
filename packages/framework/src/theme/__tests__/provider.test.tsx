import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../provider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    light={{ colors: { primary: '#f38b32' } }}
    dark={{ colors: { primary: '#1a1a1a' } }}
  >
    {children}
  </ThemeProvider>
);

describe('ThemeProvider', () => {
  it('应该提供主题上下文', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBeDefined();
    expect(result.current.isDark).toBe(false);
    expect(result.current.toggleTheme).toBeDefined();
  });

  it('切换主题应该工作', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    // 初始应该是亮色主题
    expect(result.current.isDark).toBe(false);

    // 切换主题
    result.current.toggleTheme();

    // 等待状态更新后应该是暗色主题
    await waitFor(() => {
      expect(result.current.isDark).toBe(true);
    });
  });

  it('应该在ThemeProvider外抛出错误', () => {
    // 不提供wrapper，直接使用useTheme
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within ThemeProvider');
  });
});
