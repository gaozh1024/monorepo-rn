import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BackHandler } from 'react-native';
import { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@/theme';
import { AppText } from '../../primitives';
import { PageDrawer } from '../../display/PageDrawer';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider light={theme}>{ui}</ThemeProvider>);

describe('PageDrawer', () => {
  it('visible=false 时不渲染', () => {
    const { queryByTestId } = renderWithTheme(
      <PageDrawer visible={false}>
        <AppText>内容</AppText>
      </PageDrawer>
    );

    expect(queryByTestId('page-drawer-content')).toBeNull();
  });

  it('应该渲染标题和内容', () => {
    const { getByText } = renderWithTheme(
      <PageDrawer visible title="筛选条件">
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    expect(getByText('筛选条件')).toBeTruthy();
    expect(getByText('抽屉内容')).toBeTruthy();
  });

  it('应该支持点击遮罩关闭', () => {
    const onClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <PageDrawer visible onClose={onClose}>
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    fireEvent.press(getByTestId('page-drawer-backdrop'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('可以禁用遮罩关闭', () => {
    const onClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <PageDrawer visible onClose={onClose} closeOnBackdropPress={false}>
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    fireEvent.press(getByTestId('page-drawer-backdrop'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('应该支持左侧抽屉和自定义宽度', () => {
    const { getByTestId } = renderWithTheme(
      <PageDrawer visible placement="left" width={280}>
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    const drawerStyle = getByTestId('page-drawer-content').props.style[1][1];

    expect(drawerStyle).toMatchObject({ width: 280, borderRightWidth: 0.5 });
  });

  it('应该支持关闭按钮和底部内容', () => {
    const onClose = vi.fn();
    const { getByTestId, getByText } = renderWithTheme(
      <PageDrawer visible onClose={onClose} footer={<AppText>操作区</AppText>}>
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    expect(getByText('操作区')).toBeTruthy();

    fireEvent.press(getByTestId('page-drawer-close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('应该支持手势关闭', () => {
    const onClose = vi.fn();
    const { getByTestId } = renderWithTheme(
      <PageDrawer visible onClose={onClose} placement="right">
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    const drawer = getByTestId('page-drawer-content');

    act(() => {
      drawer.props.onPanResponderMove?.({}, { dx: -120, dy: 0 });
      drawer.props.onPanResponderRelease?.({}, { dx: -120, dy: 0 });
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('返回时应该优先关闭抽屉', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <PageDrawer visible onClose={onClose}>
        <AppText>抽屉内容</AppText>
      </PageDrawer>
    );

    const addEventListener = vi.mocked(BackHandler.addEventListener);
    const backHandler = addEventListener.mock.calls[0]?.[1];

    expect(typeof backHandler).toBe('function');
    let handled = false;
    act(() => {
      handled = backHandler?.() ?? false;
    });
    expect(handled).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
