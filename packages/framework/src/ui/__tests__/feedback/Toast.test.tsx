import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Toast } from '../../feedback/Toast';
import { StyleSheet } from 'react-native';
import { AppView } from '../../primitives';
import { act, create } from 'react-test-renderer';

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
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<Toast message="Success" type="success" visible testID="toast" />);
    });

    const view = renderer!.root.findByType(AppView);
    expect(StyleSheet.flatten(view.props.style).backgroundColor).toBe('#22c55e');
  });
});
