import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { AlertModal } from '../alert/component';
import { AppPressable } from '@/ui';

describe('AlertModal', () => {
  it('应该使用内部动画而不是 Modal 默认动画', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AlertModal
          visible
          title="提示"
          message="内容"
          showCancel
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      );
    });

    const modal = renderer!.root.find(
      node => typeof node.type === 'string' && node.type === 'Modal'
    );
    expect(modal.props.animationType).toBe('none');
  });

  it('应该用内联快捷参数提供按钮点击区域和居中布局', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AlertModal visible title="提示" showCancel onConfirm={vi.fn()} onCancel={vi.fn()} />
      );
    });

    const buttons = renderer!.root.findAllByType(AppPressable);

    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.props.flex).toBe(true);
      expect(button.props.py).toBe(12);
      expect(button.props.items).toBe('center');
      expect(button.props.justify).toBe('center');
      expect(button.props.rounded).toBe('lg');
    }
  });
});
