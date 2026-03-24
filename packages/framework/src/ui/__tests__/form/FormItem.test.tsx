import { describe, it, expect } from 'vitest';
import React from 'react';
import { AppText } from '../../primitives';
import { AppView } from '../../primitives/AppView';
import { FormItem } from '../../form/FormItem';
import { renderWithTheme } from './test-utils';
import { act, create } from 'react-test-renderer';

describe('FormItem', () => {
  it('应该渲染标签、必填标记和内容', () => {
    const { getByText } = renderWithTheme(
      <FormItem name="username" label="用户名" required>
        <AppText>输入框</AppText>
      </FormItem>
    );

    expect(getByText('用户名')).toBeTruthy();
    expect(getByText('*')).toBeTruthy();
    expect(getByText('输入框')).toBeTruthy();
  });

  it('应该在有错误时优先显示错误而不是帮助文案', () => {
    const { getByText, queryByText } = renderWithTheme(
      <FormItem name="email" error="邮箱格式错误" help="请输入常用邮箱">
        <AppText>邮箱输入框</AppText>
      </FormItem>
    );

    expect(getByText('邮箱格式错误')).toBeTruthy();
    expect(queryByText('请输入常用邮箱')).toBeNull();
  });

  it('应该支持表单项容器快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <FormItem name="nickname" label="昵称" p={4} rounded="xl" bg="primary-500">
          <AppText>输入区域</AppText>
        </FormItem>
      );
    });

    const container = renderer!.root
      .findAllByType(AppView)
      .find(node => node.props.p === 4 && node.props.rounded === 'xl');

    expect(container).toBeTruthy();
    expect(container.props.p).toBe(4);
    expect(container.props.rounded).toBe('xl');
  });
});
