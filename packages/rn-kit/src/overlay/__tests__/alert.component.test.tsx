import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { AlertModal } from '../alert/component';

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
});
