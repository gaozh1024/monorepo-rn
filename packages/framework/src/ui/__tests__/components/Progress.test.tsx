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
    const { container } = render(<Progress value={75} testID="progress" />);
    // 查找进度填充元素（第二个 div，第一个是容器）
    const fill = container.querySelector('[style*="width: 75%"]');
    expect(fill).toBeTruthy();
  });

  it('应该限制在0-100范围内', () => {
    const { container } = render(<Progress value={150} testID="progress" />);
    const fill = container.querySelector('[style*="width: 100%"]');
    expect(fill).toBeTruthy();
  });

  it('应该应用size样式', () => {
    const { getByTestId } = render(<Progress value={50} size="lg" testID="progress" />);
    const progress = getByTestId('progress');
    expect(progress.className).toContain('h-3');
  });

  it('应该应用color样式', () => {
    const { container } = render(<Progress value={50} color="success" testID="progress" />);
    const fill = container.querySelector('.bg-success-500');
    expect(fill).toBeTruthy();
  });
});
