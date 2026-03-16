import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Checkbox } from '../../form/Checkbox';

describe('Checkbox', () => {
  it('应该渲染未选中状态', () => {
    const { getByTestId } = render(
      <Checkbox testID="checkbox" checked={false} onChange={() => {}} />
    );
    expect(getByTestId('checkbox')).toBeTruthy();
  });

  it('应该切换选中状态', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <Checkbox testID="checkbox" checked={false} onChange={onChange} />
    );

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('应该禁用交互', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(
      <Checkbox testID="checkbox" checked={false} onChange={onChange} disabled />
    );

    fireEvent.press(getByTestId('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('应该渲染标签', () => {
    const { getByText } = render(
      <Checkbox checked={false} onChange={() => {}}>
        同意协议
      </Checkbox>
    );
    expect(getByText('同意协议')).toBeTruthy();
  });
});
