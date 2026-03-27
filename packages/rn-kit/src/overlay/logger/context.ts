import { createContext, useContext } from 'react';
import type { LoggerContextType } from './types';

export const LoggerContext = createContext<LoggerContextType | null>(null);

export function useLoggerContext(): LoggerContextType {
  const ctx = useContext(LoggerContext);
  if (!ctx) throw new Error('useLogger must be used within LoggerProvider');
  return ctx;
}
