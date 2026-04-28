import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { LoadingModal } from '../loading/component';

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style;
}

describe('LoadingModal', () => {
  it('显示超过30秒后应该出现关闭按钮', () => {
    vi.useFakeTimers();

    try {
      const onRequestClose = vi.fn();
      const { queryByTestId, getByTestId } = render(
        <LoadingModal visible text="加载中" onRequestClose={onRequestClose} />
      );

      expect(queryByTestId('loading-close')).toBeNull();

      act(() => {
        vi.advanceTimersByTime(30_000);
      });

      expect(flattenStyle(getByTestId('loading-close').props.style)).toMatchObject({
        marginTop: 12,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
      });

      fireEvent.press(getByTestId('loading-close'));
      expect(onRequestClose).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
