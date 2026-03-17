import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppPressable } from '../../primitives/AppPressable';

describe('AppPressable', () => {
  it('应该正确渲染子元素', () => {
    const { getByText } = render(
      <AppPressable>
        <>Press me</>
      </AppPressable>
    );
    expect(getByText('Press me')).toBeTruthy();
  });

  it('应该响应onPress', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppPressable onPress={onPress}>
        <>Press me</>
      </AppPressable>
    );
    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该在disabled时不响应', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppPressable onPress={onPress} disabled>
        <>Press me</>
      </AppPressable>
    );
    fireEvent.press(getByText('Press me'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
