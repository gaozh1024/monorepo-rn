import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingUI } from '../../feedback/LoadingUI';

describe('LoadingUI', () => {
  it('应该显示加载指示器', () => {
    const { getByTestId } = render(<LoadingUI visible testID="loading" />);
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('应该显示文本', () => {
    const { getByText } = render(<LoadingUI text="Loading..." visible />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByTestId } = render(<LoadingUI visible={false} testID="loading" />);
    expect(queryByTestId('loading')).toBeNull();
  });
});
