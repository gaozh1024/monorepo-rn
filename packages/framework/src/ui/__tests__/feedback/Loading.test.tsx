import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Loading } from '../../feedback/Loading';

describe('Loading', () => {
  it('应该显示加载指示器', () => {
    const { getByTestId } = render(<Loading visible testID="loading" />);
    expect(getByTestId('loading')).toBeTruthy();
  });

  it('应该显示文本', () => {
    const { getByText } = render(<Loading text="Loading..." visible />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('不应该渲染当visible为false', () => {
    const { queryByTestId } = render(<Loading visible={false} testID="loading" />);
    expect(queryByTestId('loading')).toBeNull();
  });
});
