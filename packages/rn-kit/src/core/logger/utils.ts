import type { LogEntry, LogLevel } from './types';

export const LOG_LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function shouldLog(currentLevel: LogLevel, nextLevel: LogLevel) {
  return LOG_LEVEL_WEIGHT[nextLevel] >= LOG_LEVEL_WEIGHT[currentLevel];
}

export function createLogEntry(input: {
  level: LogLevel;
  message: string;
  data?: unknown;
  namespace?: string;
  source?: LogEntry['source'];
}): LogEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level: input.level,
    message: input.message,
    data: input.data,
    namespace: input.namespace,
    timestamp: Date.now(),
    source: input.source ?? 'logger',
  };
}

export function formatLogTime(timestamp: number) {
  const date = new Date(timestamp);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function stringifyLogData(data: unknown) {
  if (data === undefined) return '';
  if (typeof data === 'string') return data;

  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function normalizeConsoleArgs(args: unknown[]) {
  if (args.length === 0) {
    return { message: '', data: undefined as unknown };
  }

  const [first, ...rest] = args;

  if (typeof first === 'string') {
    return {
      message: first,
      data: rest.length === 0 ? undefined : rest.length === 1 ? rest[0] : rest,
    };
  }

  return {
    message: stringifyLogData(first),
    data: args.length === 1 ? first : args,
  };
}

export function serializeLogEntries(entries: LogEntry[]) {
  return JSON.stringify(
    entries.map(entry => ({
      id: entry.id,
      level: entry.level,
      message: entry.message,
      namespace: entry.namespace,
      timestamp: entry.timestamp,
      source: entry.source,
      data: entry.data,
    })),
    null,
    2
  );
}
