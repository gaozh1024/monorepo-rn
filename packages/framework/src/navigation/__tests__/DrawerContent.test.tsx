import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider, createTheme } from '@/theme';
import { DrawerContent } from '../components/DrawerContent';

vi.mock('@react-navigation/drawer', () => ({
  DrawerContentScrollView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
}));

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style;
}

function createProps(index = 0) {
  return {
    state: {
      index,
      routes: [
        { key: 'home-key', name: 'Home' },
        { key: 'settings-key', name: 'Settings' },
      ],
    },
    descriptors: {
      'home-key': { options: { title: '首页' } },
      'settings-key': { options: { title: '设置' } },
    },
    navigation: {
      navigate: vi.fn(),
    },
  } as any;
}

describe('DrawerContent', () => {
  it('应该渲染自定义头尾、菜单项与激活态指示条', () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <ThemeProvider light={theme}>
        <DrawerContent
          {...createProps(1)}
          header={<View testID="drawer-header" />}
          footer={<View testID="drawer-footer" />}
          items={[
            { name: 'Home', label: '首页', icon: 'home' },
            { name: 'Settings', label: '设置', icon: 'settings', badge: 108 },
          ]}
        />
      </ThemeProvider>
    );

    expect(getByTestId('drawer-header')).toBeTruthy();
    expect(getByTestId('drawer-footer')).toBeTruthy();
    expect(getByText('首页')).toBeTruthy();
    expect(getByText('设置')).toBeTruthy();
    expect(queryByTestId('drawer-item-Home-indicator')).toBeNull();
    expect(getByTestId('drawer-item-Settings-indicator')).toBeTruthy();
    expect(getByText('99+')).toBeTruthy();
  });

  it('点击菜单项时应该触发导航', () => {
    const props = createProps(0);
    const { getByTestId } = render(
      <ThemeProvider light={theme}>
        <DrawerContent
          {...props}
          items={[
            { name: 'Home', label: '首页' },
            { name: 'Settings', label: '设置' },
          ]}
        />
      </ThemeProvider>
    );

    fireEvent.press(getByTestId('drawer-item-Settings'));

    expect(props.navigation.navigate).toHaveBeenCalledWith('Settings');
  });

  it('应该支持隐藏激活态指示条并保留激活文本样式', () => {
    const { queryByTestId, getByTestId } = render(
      <ThemeProvider light={theme}>
        <DrawerContent
          {...createProps(0)}
          showActiveIndicator={false}
          items={[
            { name: 'Home', label: '首页' },
            { name: 'Settings', label: '设置' },
          ]}
        />
      </ThemeProvider>
    );

    expect(queryByTestId('drawer-item-Home-indicator')).toBeNull();
    expect(flattenStyle(getByTestId('drawer-item-Home-label').props.style)).toMatchObject({
      fontWeight: '600',
    });
  });
});
