import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme, theme } from './test-utils';
import { Select } from '../../form/Select';
import { ThemeProvider } from '@/theme';
import { act, create } from 'react-test-renderer';
import { BottomSheetModal } from '../../form/BottomSheetModal';
import { resolveInteractiveStyle } from '../style-utils';

const options = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
];

describe('Select', () => {
  it('应该支持单选', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <Select placeholder="请选择城市" options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('请选择城市'));
    fireEvent.press(getByText('北京'));

    expect(onChange).toHaveBeenCalledWith('beijing');
  });

  it('应该支持搜索过滤', () => {
    const onSearch = vi.fn();
    const { getByText, getByPlaceholderText, queryByText } = renderWithTheme(
      <Select placeholder="搜索城市" options={options} searchable onSearch={onSearch} />
    );

    fireEvent.press(getByText('搜索城市'));
    fireEvent.changeText(getByPlaceholderText('搜索...'), '深');

    expect(onSearch).toHaveBeenCalledWith('深');
    expect(getByText('深圳')).toBeTruthy();
    expect(queryByText('北京')).toBeNull();
  });

  it('应该支持多选', () => {
    const onChange = vi.fn();
    const { getByText } = renderWithTheme(
      <Select multiple value={['beijing']} options={options} onChange={onChange} />
    );

    fireEvent.press(getByText('北京'));
    expect(getByText('已选择 1 项')).toBeTruthy();

    fireEvent.press(getByText('上海'));

    expect(onChange).toHaveBeenCalledWith(['beijing', 'shanghai']);
  });

  it('重复 value 的选项也应该能正常渲染', () => {
    const duplicateOptions = [
      { label: 'check-circle', value: 'check-circle' },
      { label: 'success', value: 'check-circle' },
    ];

    const { getByText } = renderWithTheme(
      <Select placeholder="选择图标" options={duplicateOptions} />
    );

    fireEvent.press(getByText('选择图标'));

    expect(getByText('check-circle')).toBeTruthy();
    expect(getByText('success')).toBeTruthy();
  });

  it('应该支持自定义弹窗文案', () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <Select
        placeholder="打开选择器"
        options={options}
        multiple
        searchable
        singleSelectTitle="请选择城市"
        multipleSelectTitle="选择城市"
        searchPlaceholder="搜索城市"
        emptyText="无可选项"
        selectedCountText="共 {{count}} 项"
        confirmText="完成"
      />
    );

    fireEvent.press(getByText('打开选择器'));
    expect(getByText('选择城市')).toBeTruthy();
    expect(getByPlaceholderText('搜索城市')).toBeTruthy();
    expect(getByText('共 0 项')).toBeTruthy();
    expect(getByText('完成')).toBeTruthy();
  });

  it('弹窗打开时不应使用整体 slide 动画', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Select placeholder="打开选择器" options={options} />
        </ThemeProvider>
      );
    });

    const modal = renderer!.root.find(
      node => typeof node.type === 'string' && node.type === 'Modal'
    );

    expect(modal.props.animationType).toBe('none');
  });

  it('应该为底部弹窗启用点击遮罩关闭', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Select placeholder="打开城市选择" options={options} />
        </ThemeProvider>
      );
    });

    const bottomSheet = renderer!.root.findByType(BottomSheetModal);
    expect(bottomSheet.props.closeOnBackdropPress).toBe(true);
  });

  it('应该支持触发器基础快捷参数', () => {
    const { getByText } = renderWithTheme(
      <Select placeholder="选择城市" options={options} h={48} rounded="full" bg="primary-500" />
    );

    let trigger: any = getByText('选择城市');
    while (trigger?.props && !trigger.props.onPress) {
      trigger = trigger.parent;
    }

    expect(resolveInteractiveStyle(trigger.props.style)).toMatchObject({
      height: 48,
      borderRadius: 9999,
      backgroundColor: '#f38b32',
    });
  });
});
