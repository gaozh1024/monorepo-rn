import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from '../../feedback/Alert';

describe('Alert', () => {
  it('应该显示标题', () => {
    const { getByText } = render(<Alert title="Warning" visible />);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('应该显示消息', () => {
    const { getByText } = render(<Alert title="Title" message="Details" visible />);
    expect(getByText('Details')).toBeTruthy();
  });

  it('应该调用onConfirm', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<Alert title="Confirm" onConfirm={onConfirm} visible />);
    fireEvent.press(getByText('确认'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByText } = render(<Alert title="Hidden" visible={false} />);
    expect(queryByText('Hidden')).toBeNull();
  });
});
