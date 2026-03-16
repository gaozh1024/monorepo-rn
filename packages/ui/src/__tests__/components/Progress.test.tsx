import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Progress } from '../../components/Progress';

describe('Progress', () => {
  it('应该渲染进度条', () => {
    const { getByTestId } = render(<Progress value={50} testID="progress" />);
    expect(getByTestId('progress')).toBeTruthy();
  });

  it('应该应用正确的宽度', () => {
    const { getByTestId } = render(<Progress value={75} testID="progress" />);
    const progress = getByTestId('progress');
    // 查找子元素（进度填充）
    const fill = progress.children[0];
    expect(fill.props.style.width).toBe('75%');
  });

  it('应该限制在0-100范围内', () => {
    const { getByTestId } = render(<Progress value={150} testID="progress" />);
    const progress = getByTestId('progress');
    const fill = progress.children[0];
    expect(fill.props.style.width).toBe('100%');
  });

  it('应该应用size样式', () => {
    const { getByTestId } = render(<Progress value={50} size="lg" testID="progress" />);
    const progress = getByTestId('progress');
    expect(progress.props.className).toContain('h-3');
  });

  it('应该应用color样式', () => {
    const { getByTestId } = render(<Progress value={50} color="success" testID="progress" />);
    const progress = getByTestId('progress');
    const fill = progress.children[0];
    expect(fill.props.className).toContain('bg-success-500');
  });
});
