import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, create } from 'react-test-renderer';
import { AppText } from '@/ui/primitives';
import { KeyboardInsetView } from '@/ui/primitives/KeyboardInsetView';

const useKeyboardMock = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useKeyboard', () => ({
  useKeyboard: useKeyboardMock,
}));

vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 12,
    left: 0,
    right: 0,
  }),
}));

function flattenStyle(style: any) {
  if (Array.isArray(style)) {
    return style.reduce((acc, item) => Object.assign(acc, flattenStyle(item)), {});
  }

  if (!style) return {};

  return style;
}

describe('KeyboardInsetView', () => {
  beforeEach(() => {
    useKeyboardMock.mockReset();
    useKeyboardMock.mockReturnValue({
      visible: false,
      height: 0,
      dismiss: vi.fn(),
    });
  });

  it('键盘未显示时应保留底部安全区', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <KeyboardInsetView pb={8}>
          <AppText>内容</AppText>
        </KeyboardInsetView>
      );
    });

    const view = renderer!.root.findByType('View');
    const style = flattenStyle(view.props.style);

    expect(style.paddingBottom).toBe(20);
  });

  it('键盘显示时应追加键盘高度与偏移量', () => {
    useKeyboardMock.mockReturnValue({
      visible: true,
      height: 300,
      dismiss: vi.fn(),
    });

    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <KeyboardInsetView pb={8} keyboardOffset={16}>
          <AppText>内容</AppText>
        </KeyboardInsetView>
      );
    });

    const view = renderer!.root.findByType('View');
    const style = flattenStyle(view.props.style);

    expect(style.paddingBottom).toBe(324);
  });

  it('禁用键盘避让时不应追加键盘高度，但仍可保留安全区', () => {
    useKeyboardMock.mockReturnValue({
      visible: true,
      height: 300,
      dismiss: vi.fn(),
    });

    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <KeyboardInsetView enabled={false} pb={8}>
          <AppText>内容</AppText>
        </KeyboardInsetView>
      );
    });

    const view = renderer!.root.findByType('View');
    const style = flattenStyle(view.props.style);

    expect(style.paddingBottom).toBe(20);
  });
});
