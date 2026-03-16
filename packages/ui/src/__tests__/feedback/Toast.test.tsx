import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Toast } from '../../feedback/Toast';

describe('Toast', () => {
  it('应该显示消息', () => {
    const { getByText } = render(<Toast message="Hello" visible />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByText } = render(<Toast message="Hello" visible={false} />);
    expect(queryByText('Hello')).toBeNull();
  });

  it('应该应用type样式', () => {
    const { getByText } = render(<Toast message="Success" type="success" visible />);
    const toast = getByText('Success').parent;
    expect(toast.props.className).toContain('bg-green-500');
  });
});
