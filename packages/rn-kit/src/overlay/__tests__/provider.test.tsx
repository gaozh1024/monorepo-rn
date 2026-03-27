/**
 * Overlay Provider 测试
 * @module overlay/__tests__/provider
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { OverlayProvider } from '../provider';
import { useLoading } from '../loading/hooks';
import { useToast } from '../toast/hooks';
import { useAlert } from '../alert/hooks';
import { useLogger } from '../logger/hooks';

// 测试组件：Loading
function LoadingTestComponent() {
  const { show, hide } = useLoading();
  return (
    <>
      <button className="probe" testID="loading-show" onPress={() => show('加载中...')}>
        显示 Loading
      </button>
      <button className="probe" testID="loading-hide" onPress={hide}>
        隐藏 Loading
      </button>
    </>
  );
}

// 测试组件：Toast
function ToastTestComponent() {
  const { success, error } = useToast();
  return (
    <>
      <button className="probe" testID="toast-success" onPress={() => success('成功')}>
        成功
      </button>
      <button className="probe" testID="toast-error" onPress={() => error('错误')}>
        错误
      </button>
    </>
  );
}

// 测试组件：Alert
function AlertTestComponent() {
  const { alert, confirm } = useAlert();
  return (
    <>
      <button
        className="probe"
        testID="alert-simple"
        onPress={() => alert({ title: '提示', message: '简单提示' })}
      >
        简单提示
      </button>
      <button
        className="probe"
        testID="alert-confirm"
        onPress={() =>
          confirm({
            title: '确认',
            message: '确定删除吗？',
            onConfirm: () => console.log('确认'),
          })
        }
      >
        确认对话框
      </button>
    </>
  );
}

// 测试组件：Logger
function LoggerTestComponent() {
  const logger = useLogger('ui');
  return (
    <>
      <button
        className="probe"
        testID="logger-info"
        onPress={() => logger.info('点击按钮', { test: true })}
      >
        记录日志
      </button>
      <div className="probe" testID="logger-count">
        {String(logger.entries.length)}
      </div>
    </>
  );
}

describe('OverlayProvider', () => {
  it('应该正确渲染子组件', () => {
    const { getByTestId } = render(
      <OverlayProvider>
        <div testID="child">子组件</div>
      </OverlayProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  it('useLoading 在 Provider 内应该正常工作', () => {
    const { getByTestId } = render(
      <OverlayProvider>
        <LoadingTestComponent />
      </OverlayProvider>
    );

    // 点击显示 loading
    act(() => {
      fireEvent.press(getByTestId('loading-show'));
    });

    // 点击隐藏 loading
    act(() => {
      fireEvent.press(getByTestId('loading-hide'));
    });
  });

  it('useToast 在 Provider 内应该正常工作', () => {
    const { getByTestId } = render(
      <OverlayProvider>
        <ToastTestComponent />
      </OverlayProvider>
    );

    // 显示成功 toast
    act(() => {
      fireEvent.press(getByTestId('toast-success'));
    });

    // 显示错误 toast
    act(() => {
      fireEvent.press(getByTestId('toast-error'));
    });
  });

  it('useLogger 在 Provider 内应该正常工作', () => {
    const { getByTestId } = render(
      <OverlayProvider
        loggerProps={{ enabled: true, overlayEnabled: false, consoleEnabled: false }}
      >
        <LoggerTestComponent />
      </OverlayProvider>
    );

    act(() => {
      fireEvent.press(getByTestId('logger-info'));
    });

    expect(String(getByTestId('logger-count').props.children)).toBe('1');
  });

  it('useAlert 在 Provider 内应该正常工作', () => {
    const { getByTestId } = render(
      <OverlayProvider>
        <AlertTestComponent />
      </OverlayProvider>
    );

    // 显示简单 alert
    act(() => {
      fireEvent.press(getByTestId('alert-simple'));
    });

    // 显示确认对话框
    act(() => {
      fireEvent.press(getByTestId('alert-confirm'));
    });
  });
});
