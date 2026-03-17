import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../../composables/AppButton';

describe('AppButton', () => {
  it('应该显示文本', () => {
    const { getByText } = render(<AppButton>Click me</AppButton>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('应该响应onPress', () => {
    const onPress = vi.fn();
    const { getByText } = render(<AppButton onPress={onPress}>Click</AppButton>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该在disabled时不响应', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppButton onPress={onPress} disabled>
        Click
      </AppButton>
    );
    fireEvent.press(getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('应该显示加载指示器', () => {
    const { queryByText } = render(<AppButton loading>Click</AppButton>);
    expect(queryByText('Click')).toBeNull();
  });

  it('应该应用variant样式', () => {
    const { getByText } = render(<AppButton variant="outline">Outline</AppButton>);
    const button = getByText('Outline').parent;
    expect(button.props.className).toContain('border-2');
  });
});
