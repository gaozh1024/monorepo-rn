import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Radio } from '../../form/Radio';

describe('Radio', () => {
  it('应该渲染未选中状态', () => {
    const { getByTestId } = render(<Radio testID="radio" checked={false} />);
    expect(getByTestId('radio')).toBeTruthy();
  });

  it('应该触发点击事件', () => {
    const onPress = vi.fn();
    const { getByTestId } = render(<Radio testID="radio" checked={false} onPress={onPress} />);

    fireEvent.press(getByTestId('radio'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该渲染标签', () => {
    const { getByText } = render(<Radio checked={false}>选项A</Radio>);
    expect(getByText('选项A')).toBeTruthy();
  });
});
