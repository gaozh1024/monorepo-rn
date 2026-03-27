import type { AliyunPushLogger } from './types';

const NAMESPACE = 'aliyun-push';

let globalLogger: AliyunPushLogger | null = null;

export function setAliyunPushLogger(logger: AliyunPushLogger | null) {
  globalLogger = logger;
}

export function getAliyunPushLogger() {
  return globalLogger;
}

function fallback(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown) {
  const args = data === undefined ? [message] : [message, data];

  switch (level) {
    case 'debug':
      console.debug('[AliyunPush]', ...args);
      break;
    case 'info':
      console.info('[AliyunPush]', ...args);
      break;
    case 'warn':
      console.warn('[AliyunPush]', ...args);
      break;
    case 'error':
      console.error('[AliyunPush]', ...args);
      break;
  }
}

function log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown) {
  const logger = getAliyunPushLogger();

  if (logger) {
    logger[level](message, data, NAMESPACE);
    return;
  }

  fallback(level, message, data);
}

export const pushLogger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};
