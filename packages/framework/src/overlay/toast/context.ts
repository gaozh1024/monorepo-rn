/**
 * Toast 子系统上下文
 * @module overlay/toast/context
 */

import { createContext, useContext } from 'react';
import type { ToastContextType } from './types';

/**
 * Toast 上下文
 */
export const ToastContext = createContext<ToastContextType | null>(null);

/**
 * Toast 上下文 Hook
 * @throws 如果不在 ToastProvider 内会抛出错误
 */
export function useToastContext(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within OverlayProvider');
  return ctx;
}
