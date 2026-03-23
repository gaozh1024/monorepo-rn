import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react-native';
import { LoggerProvider } from '../logger/provider';
import { useLogger } from '../logger/hooks';

function LoggerTestComponent() {
  const logger = useLogger('auth');

  return (
    <>
      <button
        className="probe"
        testID="log-info"
        onPress={() => logger.info('开始登录', { page: 'Login' })}
      >
        log
      </button>
      <button className="probe" testID="log-clear" onPress={logger.clear}>
        clear
      </button>
      <div className="probe" testID="log-count">
        {String(logger.entries.length)}
      </div>
      <div className="probe" testID="log-namespace">
        {logger.entries[0]?.namespace || ''}
      </div>
      <div className="probe" testID="log-message">
        {logger.entries[0]?.message || ''}
      </div>
    </>
  );
}

describe('LoggerProvider', () => {
  it('useLogger 应该记录带 namespace 的日志', () => {
    const { getByTestId } = render(
      <LoggerProvider enabled overlayEnabled={false} consoleEnabled={false}>
        <LoggerTestComponent />
      </LoggerProvider>
    );

    fireEvent.press(getByTestId('log-info'));

    expect(String(getByTestId('log-count').props.children)).toBe('1');
    expect(String(getByTestId('log-namespace').props.children)).toBe('auth');
    expect(String(getByTestId('log-message').props.children)).toBe('开始登录');
  });

  it('应该支持清空日志', () => {
    const { getByTestId } = render(
      <LoggerProvider enabled overlayEnabled={false} consoleEnabled={false}>
        <LoggerTestComponent />
      </LoggerProvider>
    );

    fireEvent.press(getByTestId('log-info'));
    fireEvent.press(getByTestId('log-clear'));

    expect(String(getByTestId('log-count').props.children)).toBe('0');
  });
});
