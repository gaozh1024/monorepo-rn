import { getGlobalLogger } from '@gaozh1024/rn-kit';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface PendingLogEntry {
  level: LogLevel;
  message: string;
  payload?: unknown;
}

const pendingLogs: PendingLogEntry[] = [];

function writeLog(entry: PendingLogEntry) {
  const logger = getGlobalLogger();
  if (!logger) return false;

  logger[entry.level](entry.message, entry.payload, 'hot-updater');
  return true;
}

export function hotUpdaterLogger(level: LogLevel, message: string, payload?: unknown) {
  const entry: PendingLogEntry = {
    level,
    message,
    payload,
  };

  if (writeLog(entry)) return;

  pendingLogs.push(entry);
}

export function flushPendingHotUpdaterLogs() {
  while (pendingLogs.length > 0) {
    const entry = pendingLogs[0];
    if (!writeLog(entry)) return;
    pendingLogs.shift();
  }
}
