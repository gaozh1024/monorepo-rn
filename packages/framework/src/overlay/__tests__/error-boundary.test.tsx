import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react-native';
import type { LogEntry } from '@/core/logger';
import { AppErrorBoundary } from '../error-boundary/component';
import { LoggerProvider } from '../logger/provider';

function CrashComponent() {
  throw new Error('render boom');
}

function RecoverableCrashHarness() {
  const [recovered, setRecovered] = React.useState(false);

  return (
    <AppErrorBoundary enabled onReset={() => setRecovered(true)}>
      {recovered ? (
        <div className="probe" testID="recovered">
          recovered
        </div>
      ) : (
        <CrashComponent />
      )}
    </AppErrorBoundary>
  );
}

describe('AppErrorBoundary', () => {
  it('应该捕获渲染错误并写入 logger', () => {
    const entries: LogEntry[] = [];
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId, getByText } = render(
      <LoggerProvider
        enabled
        overlayEnabled={false}
        consoleEnabled={false}
        transports={[entry => entries.push(entry)]}
      >
        <AppErrorBoundary enabled showDetails>
          <CrashComponent />
        </AppErrorBoundary>
      </LoggerProvider>
    );

    expect(getByText('页面发生异常')).toBeTruthy();
    expect(getByText('render boom')).toBeTruthy();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.level).toBe('error');
    expect(entries[0]?.namespace).toBe('react');
    expect(entries[0]?.message).toBe('React ErrorBoundary 捕获渲染异常');

    consoleError.mockRestore();
  });

  it('应该支持点击重试恢复渲染', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId, getByText } = render(
      <LoggerProvider enabled overlayEnabled={false} consoleEnabled={false}>
        <RecoverableCrashHarness />
      </LoggerProvider>
    );

    expect(getByText('页面发生异常')).toBeTruthy();
    fireEvent.press(getByTestId('app-error-boundary-reset'));

    expect(getByTestId('recovered')).toBeTruthy();

    consoleError.mockRestore();
  });
});
