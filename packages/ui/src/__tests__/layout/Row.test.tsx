import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Row } from '../../layout/Row';

describe('Row', () => {
  it('应该渲染水平布局', () => {
    const { getByTestId } = render(<Row testID="row" />);
    const row = getByTestId('row');
    expect(row.props.className).toContain('flex-row');
  });

  it('应该应用justify样式', () => {
    const { getByTestId } = render(<Row justify="between" testID="row" />);
    const row = getByTestId('row');
    expect(row.props.className).toContain('justify-between');
  });

  it('应该应用align样式', () => {
    const { getByTestId } = render(<Row align="center" testID="row" />);
    const row = getByTestId('row');
    expect(row.props.className).toContain('items-center');
  });
});
