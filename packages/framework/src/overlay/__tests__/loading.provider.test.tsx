import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { LoadingProvider } from '../loading/provider';
import { useLoading } from '../loading/hooks';

const loadingModalState = vi.hoisted(() => ({
  propsHistory: [] as Array<{ visible: boolean; text?: string }>,
}));

vi.mock('../loading/component', () => ({
  LoadingModal: (props: { visible: boolean; text?: string }) => {
    loadingModalState.propsHistory.push(props);
    return null;
  },
}));

describe('LoadingProvider', () => {
  afterEach(() => {
    vi.useRealTimers();
    loadingModalState.propsHistory = [];
  });

  const getLatestProps = () => loadingModalState.propsHistory.at(-1);

  it('显示后应该至少保留 500ms', () => {
    vi.useFakeTimers();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LoadingProvider>{children}</LoadingProvider>
    );
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.show('加载中...');
    });

    expect(getLatestProps()).toMatchObject({ visible: true, text: '加载中...' });

    act(() => {
      result.current.hide();
    });

    expect(getLatestProps()).toMatchObject({ visible: true, text: '加载中...' });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(getLatestProps()).toMatchObject({ visible: true, text: '加载中...' });

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(getLatestProps()).toMatchObject({ visible: false });
  });

  it('多个并发 show/hide 时不应该过早关闭', () => {
    vi.useFakeTimers();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LoadingProvider>{children}</LoadingProvider>
    );
    const { result } = renderHook(() => useLoading(), { wrapper });

    act(() => {
      result.current.show('加载中...');
      result.current.show('加载中...');
    });

    expect(getLatestProps()).toMatchObject({ visible: true, text: '加载中...' });

    act(() => {
      vi.advanceTimersByTime(600);
      result.current.hide();
    });

    expect(getLatestProps()).toMatchObject({ visible: true, text: '加载中...' });

    act(() => {
      result.current.hide();
    });

    expect(getLatestProps()).toMatchObject({ visible: false });
  });
});
