import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AlertUI } from '../../feedback/AlertUI';

describe('AlertUI', () => {
  it('应该显示标题', () => {
    const { getByText } = render(<AlertUI title="Warning" visible />);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('应该显示消息', () => {
    const { getByText } = render(<AlertUI title="Title" message="Details" visible />);
    expect(getByText('Details')).toBeTruthy();
  });

  it('应该调用onConfirm', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(<AlertUI title="Confirm" onConfirm={onConfirm} visible />);
    fireEvent.press(getByText('确认'));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByText } = render(<AlertUI title="Hidden" visible={false} />);
    expect(queryByText('Hidden')).toBeNull();
  });
});
