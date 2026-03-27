import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { AppView } from '../../primitives/AppView';
import { RadioGroup } from '../../form/RadioGroup';
import { renderWithTheme } from './test-utils';

const options = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信支付', value: 'wechat' },
  { label: '银行卡', value: 'bank', disabled: true },
];

describe('RadioGroup', () => {
  it('应该在点击选项时触发变更', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <RadioGroup value="alipay" options={options} onChange={onChange} direction="row" />
    );

    fireEvent.press(getByText('微信支付'));

    expect(onChange).toHaveBeenCalledWith('wechat');
  });

  it('应该尊重禁用状态', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <RadioGroup value="alipay" options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('银行卡'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('应该支持分组容器快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<RadioGroup options={options} p={6} rounded="lg" gap={10} bg="white" />);
    });

    const group = renderer!.root.findByType(AppView);

    expect(group.props.p).toBe(6);
    expect(group.props.gap).toBe(10);
    expect(group.props.rounded).toBe('lg');
    expect(group.props.bg).toBe('white');
  });
});
