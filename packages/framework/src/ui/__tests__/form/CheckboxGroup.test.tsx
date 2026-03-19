import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { CheckboxGroup } from '../../form/CheckboxGroup';
import { renderWithTheme } from './test-utils';

const options = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
];

describe('CheckboxGroup', () => {
  it('应该在勾选和取消勾选时返回正确结果', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <CheckboxGroup value={['react']} options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('Vue'));
    fireEvent.press(getByText('React'));

    expect(onChange).toHaveBeenNthCalledWith(1, ['react', 'vue']);
    expect(onChange).toHaveBeenNthCalledWith(2, []);
  });

  it('应该尊重禁用状态', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <CheckboxGroup value={[]} options={options} onChange={onChange} disabled />
    );

    fireEvent.press(getByText('React'));
    fireEvent.press(getByText('Svelte'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
