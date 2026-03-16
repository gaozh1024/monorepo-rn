import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Center } from '../../layout/Center';

describe('Center', () => {
  it('应该渲染居中内容', () => {
    const { getByTestId } = render(<Center testID="center" />);
    const center = getByTestId('center');
    expect(center.props.className).toContain('items-center');
    expect(center.props.className).toContain('justify-center');
  });

  it('应该默认flex为true', () => {
    const { getByTestId } = render(<Center testID="center" />);
    const center = getByTestId('center');
    expect(center.props.className).toContain('flex-1');
  });
});
