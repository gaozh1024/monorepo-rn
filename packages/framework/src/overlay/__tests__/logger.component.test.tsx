import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import { LoggerProvider } from '../logger/provider';
import {
  clampLoggerOverlayButtonPosition,
  getLoggerOverlayButtonBounds,
  getLoggerOverlaySnappedPosition,
} from '../logger/component';
import { useLogger } from '../logger/hooks';

function LogButton() {
  const networkLogger = useLogger('network');
  const authLogger = useLogger('auth');

  return (
    <>
      <button
        className="probe"
        testID="emit-error"
        onPress={() => networkLogger.error('接口请求失败', { code: 500 })}
      >
        emit-error
      </button>
      <button
        className="probe"
        testID="emit-auth"
        onPress={() => authLogger.info('用户登录成功', { userId: 1 })}
      >
        emit-auth
      </button>
    </>
  );
}

function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style;
}

describe('LogOverlay', () => {
  it('应该在面板展开后显示日志内容', () => {
    const { getByTestId, getByText } = render(
      <LoggerProvider enabled overlayEnabled consoleEnabled={false}>
        <LogButton />
      </LoggerProvider>
    );

    fireEvent.press(getByTestId('emit-error'));
    fireEvent.press(getByTestId('logger-overlay-toggle'));

    expect(getByTestId('logger-overlay-panel')).toBeTruthy();
    expect(getByText('开发日志')).toBeTruthy();
    expect(getByText('接口请求失败')).toBeTruthy();
    expect(getByText('[network]')).toBeTruthy();
  });

  it('应该支持 namespace 筛选和导出', () => {
    const onExport = vi.fn();
    const { getByTestId, getByText, queryByText, queryByPlaceholderText } = render(
      <LoggerProvider enabled overlayEnabled consoleEnabled={false} onExport={onExport}>
        <LogButton />
      </LoggerProvider>
    );

    fireEvent.press(getByTestId('emit-error'));
    fireEvent.press(getByTestId('emit-auth'));
    fireEvent.press(getByTestId('logger-overlay-toggle'));

    fireEvent.press(getByTestId('logger-namespace-auth'));
    expect(getByText('用户登录成功')).toBeTruthy();
    expect(queryByText('接口请求失败')).toBeNull();
    expect(getByText('全部模块')).toBeTruthy();
    expect(getByTestId('logger-namespace-all')).toBeTruthy();
    expect(queryByPlaceholderText('搜索日志')).toBeNull();

    fireEvent.press(getByTestId('logger-overlay-export'));

    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: [
          expect.objectContaining({
            namespace: 'auth',
            message: '用户登录成功',
          }),
        ],
        serialized: expect.stringContaining('用户登录成功'),
      })
    );
  });

  it('筛选区、模块区应该横向展示且日志区高度更大', () => {
    const { getByTestId } = render(
      <LoggerProvider enabled overlayEnabled consoleEnabled={false}>
        <LogButton />
      </LoggerProvider>
    );

    fireEvent.press(getByTestId('emit-error'));
    fireEvent.press(getByTestId('emit-auth'));
    fireEvent.press(getByTestId('logger-overlay-toggle'));

    const levels = getByTestId('logger-overlay-levels');
    const namespaces = getByTestId('logger-overlay-namespaces');
    const logs = getByTestId('logger-overlay-logs');

    expect(levels.props.horizontal).toBe(true);
    expect(flattenStyle(levels.props.contentContainerStyle).flexDirection).toBe('row');
    expect(flattenStyle(levels.props.style).height).toBe(44);

    expect(namespaces.props.horizontal).toBe(true);
    expect(flattenStyle(namespaces.props.contentContainerStyle).flexDirection).toBe('row');
    expect(flattenStyle(namespaces.props.style).height).toBe(44);

    expect(logs.props.showsVerticalScrollIndicator).toBe(true);
    expect(flattenStyle(logs.props.style).minHeight).toBe(260);
  });

  it('拖动位置应该按屏幕边界限制并在释放后吸边', () => {
    expect(getLoggerOverlayButtonBounds(390, 844)).toEqual({
      minX: -302,
      minY: -772,
    });

    expect(clampLoggerOverlayButtonPosition({ x: -999, y: -999 }, 390, 844)).toEqual({
      x: -302,
      y: -772,
    });

    expect(getLoggerOverlaySnappedPosition({ x: -220, y: -120 }, 390, 844)).toEqual({
      x: -302,
      y: -120,
    });

    expect(getLoggerOverlaySnappedPosition({ x: -80, y: -120 }, 390, 844)).toEqual({
      x: 0,
      y: -120,
    });
  });
});
