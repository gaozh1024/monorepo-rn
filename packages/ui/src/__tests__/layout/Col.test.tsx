import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Col } from '../../layout/Col';

describe('Col', () => {
  it('应该渲染垂直布局', () => {
    const { getByTestId } = render(<Col testID="col" />);
    const col = getByTestId('col');
    expect(col.props.className).toContain('flex-col');
  });

  it('应该应用justify样式', () => {
    const { getByTestId } = render(<Col justify="center" testID="col" />);
    const col = getByTestId('col');
    expect(col.props.className).toContain('justify-center');
  });
});
