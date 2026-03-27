/**
 * Overlay Hooks 使用约束测试
 * @module overlay/__tests__/hooks
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-native';
import { OverlayProvider } from '../provider';
import { LoadingProvider } from '../loading/provider';
import { ToastProvider } from '../toast/provider';
import { AlertProvider } from '../alert/provider';
import { useLoading } from '../loading/hooks';
import { useToast } from '../toast/hooks';
import { useAlert } from '../alert/hooks';
import { useLoadingContext } from '../loading/context';
import { useToastContext } from '../toast/context';
import { useAlertContext } from '../alert/context';

describe('useLoading', () => {
  it('应该在 LoadingProvider 内正常工作', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LoadingProvider>{children}</LoadingProvider>
    );

    const { result } = renderHook(() => useLoading(), { wrapper });
    expect(typeof result.current.show).toBe('function');
    expect(typeof result.current.hide).toBe('function');
  });

  it('应该在完整的 OverlayProvider 内工作', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OverlayProvider>{children}</OverlayProvider>
    );

    const { result } = renderHook(() => useLoading(), { wrapper });
    expect(typeof result.current.show).toBe('function');
    expect(typeof result.current.hide).toBe('function');
  });
});

describe('useToast', () => {
  it('应该在 ToastProvider 内正常工作', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });
    expect(typeof result.current.show).toBe('function');
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.error).toBe('function');
    expect(typeof result.current.info).toBe('function');
    expect(typeof result.current.warning).toBe('function');
  });
});

describe('useAlert', () => {
  it('应该在 AlertProvider 内正常工作', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AlertProvider>{children}</AlertProvider>
    );

    const { result } = renderHook(() => useAlert(), { wrapper });
    expect(typeof result.current.alert).toBe('function');
    expect(typeof result.current.confirm).toBe('function');
  });
});

describe('Context Hooks 约束', () => {
  it('useLoadingContext 不在 Provider 内应该抛出错误', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useLoadingContext());
    }).toThrow('useLoading must be used within OverlayProvider');
    consoleError.mockRestore();
  });

  it('useToastContext 不在 Provider 内应该抛出错误', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useToastContext());
    }).toThrow('useToast must be used within OverlayProvider');
    consoleError.mockRestore();
  });

  it('useAlertContext 不在 Provider 内应该抛出错误', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useAlertContext());
    }).toThrow('useAlert must be used within OverlayProvider');
    consoleError.mockRestore();
  });
});
