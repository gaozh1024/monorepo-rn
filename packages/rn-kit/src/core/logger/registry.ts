import type { LoggerLike } from './types';

let globalLogger: LoggerLike | null = null;

export function setGlobalLogger(logger: LoggerLike | null) {
  globalLogger = logger;
}

export function getGlobalLogger() {
  return globalLogger;
}
