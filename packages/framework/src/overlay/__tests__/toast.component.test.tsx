import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ToastItemView } from '../toast/component';
import { AppView } from '@/ui/primitives';
import { act, create } from 'react-test-renderer';

describe('ToastItemView', () => {
  it('success 类型应该有默认背景色', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ToastItemView message="成功" type="success" duration={3000} id="1" onHide={vi.fn()} />
      );
    });

    const view = renderer!.root.findByType(AppView);
    expect(StyleSheet.flatten(view.props.style).backgroundColor).toBe('#22c55e');
  });
});
