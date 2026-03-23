import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { BottomSheetModal } from '../../form/BottomSheetModal';
import { AppText } from '@/ui/primitives';
import { renderWithTheme } from './test-utils';

describe('BottomSheetModal', () => {
  it('应该支持点击遮罩关闭', () => {
    const onRequestClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <BottomSheetModal
        visible
        onRequestClose={onRequestClose}
        overlayColor="rgba(0,0,0,0.5)"
        surfaceColor="#ffffff"
        closeOnBackdropPress
      >
        <AppText>内容</AppText>
      </BottomSheetModal>
    );

    fireEvent.press(getByTestId('bottom-sheet-backdrop'));
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it('应该支持拖拽 handle 向下关闭', () => {
    const onRequestClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <BottomSheetModal
        visible
        onRequestClose={onRequestClose}
        overlayColor="rgba(0,0,0,0.5)"
        surfaceColor="#ffffff"
      >
        <AppText>内容</AppText>
      </BottomSheetModal>
    );

    const handle = getByTestId('bottom-sheet-handle');

    act(() => {
      handle.props.onPanResponderGrant?.();
      handle.props.onPanResponderMove?.({}, { dx: 0, dy: 96, vy: 0 });
      handle.props.onPanResponderRelease?.({}, { dx: 0, dy: 96, vy: 0 });
    });

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});
