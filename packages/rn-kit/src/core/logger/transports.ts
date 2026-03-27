import type { ConsoleTransportOptions, LogEntry, LoggerTransport } from './types';
import { formatLogTime } from './utils';

const ANSI_COLORS = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
} as const;

function supportsAnsiColors() {
  return typeof process !== 'undefined' && Boolean(process.stdout?.isTTY);
}

function resolveConsoleMethod(consoleRef: ConsoleTransportOptions['consoleRef'], entry: LogEntry) {
  const target = consoleRef ?? console;

  if (entry.level === 'debug' && typeof target.debug === 'function')
    return target.debug.bind(target);
  if (entry.level === 'info' && typeof target.info === 'function') return target.info.bind(target);
  if (entry.level === 'warn' && typeof target.warn === 'function') return target.warn.bind(target);
  if (entry.level === 'error' && typeof target.error === 'function')
    return target.error.bind(target);
  return target.log.bind(target);
}

export function createConsoleTransport(options: ConsoleTransportOptions = {}): LoggerTransport {
  const useAnsiColors = options.useAnsiColors ?? supportsAnsiColors();

  return entry => {
    if (entry.source === 'console') return;

    const method = resolveConsoleMethod(options.consoleRef, entry);
    const time = formatLogTime(entry.timestamp);
    const basePrefix = `[${time}] [${entry.level.toUpperCase()}]${entry.namespace ? ` [${entry.namespace}]` : ''}`;
    const prefix = useAnsiColors
      ? `${ANSI_COLORS[entry.level]}${basePrefix}${ANSI_COLORS.reset}`
      : basePrefix;

    if (entry.data === undefined) {
      method(`${prefix} ${entry.message}`);
      return;
    }

    method(`${prefix} ${entry.message}`, entry.data);
  };
}
