import { useMemo } from 'react';
import type { LogLevel } from '@/core/logger';
import { useLoggerContext } from './context';
import type { ScopedLoggerContextType } from './types';

export function useLogger(namespace?: string): ScopedLoggerContextType {
  const logger = useLoggerContext();

  return useMemo(
    () => ({
      entries: logger.entries,
      enabled: logger.enabled,
      level: logger.level,
      clear: logger.clear,
      namespace,
      log: (level: LogLevel, message: string, data?: unknown) =>
        logger.log(level, message, data, namespace),
      debug: (message: string, data?: unknown) => logger.debug(message, data, namespace),
      info: (message: string, data?: unknown) => logger.info(message, data, namespace),
      warn: (message: string, data?: unknown) => logger.warn(message, data, namespace),
      error: (message: string, data?: unknown) => logger.error(message, data, namespace),
    }),
    [logger, namespace]
  );
}
