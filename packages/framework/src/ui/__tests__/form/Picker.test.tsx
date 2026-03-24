import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { Picker } from '../../form/Picker';
import { renderWithTheme, theme } from './test-utils';
import { ThemeProvider } from '@/theme';
import { BottomSheetModal } from '../../form/BottomSheetModal';
import { resolveInteractiveStyle } from '../style-utils';

describe('Picker', () => {
  it('应该支持通用多列选择', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <Picker
        placeholder="请选择地区"
        onChange={onChange}
        columns={[
          {
            key: 'province',
            title: '省',
            options: [
              { label: '广东省', value: 'gd' },
              { label: '浙江省', value: 'zj' },
            ],
          },
          {
            key: 'city',
            title: '市',
            options: [
              { label: '深圳市', value: 'sz' },
              { label: '杭州市', value: 'hz' },
            ],
          },
          {
            key: 'district',
            title: '区',
            options: [
              { label: '南山区', value: 'ns' },
              { label: '西湖区', value: 'xh' },
            ],
          },
        ]}
      />
    );

    fireEvent.press(getByText('请选择地区'));
    fireEvent.press(getByText('浙江省'));
    fireEvent.press(getByText('杭州市'));
    fireEvent.press(getByText('西湖区'));
    fireEvent.press(getByText('确定'));

    expect(onChange).toHaveBeenCalledWith(['zj', 'hz', 'xh']);
  });

  it('应该为底部弹层启用点击遮罩关闭', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Picker
            placeholder="打开地区选择"
            columns={[
              {
                key: 'province',
                options: [{ label: '广东省', value: 'gd' }],
              },
            ]}
          />
        </ThemeProvider>
      );
    });

    const bottomSheet = renderer!.root.findByType(BottomSheetModal);
    expect(bottomSheet.props.closeOnBackdropPress).toBe(true);
  });

  it('应该支持触发器基础快捷参数', () => {
    const { getByText } = renderWithTheme(
      <Picker
        placeholder="打开地区选择"
        h={50}
        rounded="full"
        bg="primary-500"
        columns={[
          {
            key: 'province',
            options: [{ label: '广东省', value: 'gd' }],
          },
        ]}
      />
    );

    let trigger: any = getByText('打开地区选择');
    while (trigger?.props && !trigger.props.onPress) {
      trigger = trigger.parent;
    }

    expect(resolveInteractiveStyle(trigger.props.style)).toMatchObject({
      height: 50,
      borderRadius: 9999,
      backgroundColor: '#f38b32',
    });
  });
});
