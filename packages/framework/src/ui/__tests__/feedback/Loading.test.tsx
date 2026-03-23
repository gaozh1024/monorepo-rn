import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { Loading } from '../../feedback/Loading';

describe('Loading', () => {
  it('应该显示加载指示器', () => {
    const { getByTestId } = render(<Loading visible testID="loading" />);
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('应该显示文本', () => {
    const { getByText } = render(<Loading text="Loading..." visible />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByTestId } = render(<Loading visible={false} testID="loading" />);
    expect(queryByTestId('loading')).toBeNull();
  });

  it('显示超过30秒后应该出现关闭按钮', () => {
    vi.useFakeTimers();

    try {
      const onClose = vi.fn();
      const { queryByTestId, getByTestId } = render(
        <Loading visible overlay testID="loading" onClose={onClose} />
      );

      expect(queryByTestId('loading-close')).toBeNull();

      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      fireEvent.press(getByTestId('loading-close'));
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
