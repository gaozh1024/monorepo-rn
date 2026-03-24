import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { AppView } from '../../primitives/AppView';
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

  it('应该支持分组容器快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <CheckboxGroup options={options} p={4} rounded="xl" gap={12} surface="card" />
      );
    });

    const group = renderer!.root.findByType(AppView);

    expect(group.props.p).toBe(4);
    expect(group.props.gap).toBe(12);
    expect(group.props.rounded).toBe('xl');
    expect(group.props.surface).toBe('card');
  });
});
