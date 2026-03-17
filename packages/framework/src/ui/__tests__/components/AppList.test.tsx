import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppList } from '../../display/AppList';
import { AppText } from '../../primitives';
import { ThemeProvider, createTheme } from '@/theme';

const theme = createTheme({
  colors: { primary: '#f38b32' },
});

describe('AppList', () => {
  const mockData = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
  ];

  it('应该渲染列表项', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <AppList
          data={mockData}
          renderItem={({ item }) => <AppText>{item.title}</AppText>}
          keyExtractor={item => item.id}
        />
      </ThemeProvider>
    );

    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('应该渲染空状态', () => {
    const { getByText } = render(
      <ThemeProvider light={theme}>
        <AppList data={[]} renderItem={() => null} emptyTitle="暂无数据" />
      </ThemeProvider>
    );

    expect(getByText('暂无数据')).toBeTruthy();
  });

  it('应该显示加载状态', () => {
    const { getAllByTestId } = render(
      <ThemeProvider light={theme}>
        <AppList data={[]} renderItem={() => null} loading skeletonCount={3} />
      </ThemeProvider>
    );

    // 骨架屏项
    expect(getAllByTestId('skeleton').length).toBe(3);
  });
});
