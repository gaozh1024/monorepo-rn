/**
 * Logger 核心类型
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogSource = 'logger' | 'console';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  namespace?: string;
  data?: unknown;
  timestamp: number;
  source: LogSource;
}

export type LoggerTransport = (entry: LogEntry) => void;

export interface LoggerLike {
  log: (level: LogLevel, message: string, data?: unknown, namespace?: string) => void;
  debug: (message: string, data?: unknown, namespace?: string) => void;
  info: (message: string, data?: unknown, namespace?: string) => void;
  warn: (message: string, data?: unknown, namespace?: string) => void;
  error: (message: string, data?: unknown, namespace?: string) => void;
}

export interface ConsoleTransportOptions {
  useAnsiColors?: boolean;
  consoleRef?: Pick<Console, 'debug' | 'info' | 'log' | 'warn' | 'error'>;
}
