/**
 * Alert 子系统上下文
 * @module overlay/alert/context
 */

import { createContext, useContext } from 'react';
import type { AlertContextType } from './types';

/**
 * Alert 上下文
 */
export const AlertContext = createContext<AlertContextType | null>(null);

/**
 * Alert 上下文 Hook
 * @throws 如果不在 AlertProvider 内会抛出错误
 */
export function useAlertContext(): AlertContextType {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within OverlayProvider');
  return ctx;
}
