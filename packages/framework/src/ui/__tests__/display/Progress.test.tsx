import { describe, it, expect } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@/theme';
import { Progress } from '../../display/Progress';
import { AppView } from '../../primitives/AppView';

const theme = createTheme({
  colors: { primary: '#f38b32', card: '#ffffff', border: '#e5e7eb' },
});

describe('Progress', () => {
  it('应该根据 value 计算进度宽度', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Progress value={40} max={100} />
        </ThemeProvider>
      );
    });

    const views = renderer!.root.findAllByType(AppView);
    const bar = views[1];

    expect(bar.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '40%' })])
    );
  });

  it('应该支持基础快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Progress value={60} w={180} h={12} mt={8} rounded="xl" surface="card" />
        </ThemeProvider>
      );
    });

    const views = renderer!.root.findAllByType(AppView);
    const track = views[0];
    const bar = views[1];

    expect(track.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: 180, height: 12 }),
        expect.objectContaining({ marginTop: 8 }),
        expect.objectContaining({ borderRadius: 16 }),
        expect.objectContaining({ backgroundColor: '#ffffff' }),
      ])
    );
    expect(bar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 16 }),
        expect.objectContaining({ width: '60%' }),
      ])
    );
  });
});
