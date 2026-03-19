import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Switch } from '../../form/Switch';
import { renderWithTheme } from './test-utils';

describe('Switch', () => {
  it('应该在非受控模式下切换状态', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithTheme(
      <Switch testID="switch" defaultChecked={false} onChange={onChange} />
    );

    fireEvent.press(getByTestId('switch'));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('应该在禁用时阻止切换', () => {
    const onChange = vi.fn();
    const { getByTestId } = renderWithTheme(
      <Switch testID="switch" checked={false} onChange={onChange} disabled />
    );

    fireEvent.press(getByTestId('switch'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
