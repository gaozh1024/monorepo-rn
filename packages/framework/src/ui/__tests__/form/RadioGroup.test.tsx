import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
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
});
