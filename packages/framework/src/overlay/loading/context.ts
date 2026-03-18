/**
 * Loading 子系统上下文
 * @module overlay/loading/context
 */

import { createContext, useContext } from 'react';
import type { LoadingContextType } from './types';

/**
 * Loading 上下文
 */
export const LoadingContext = createContext<LoadingContextType | null>(null);

/**
 * Loading 上下文 Hook
 * @throws 如果不在 LoadingProvider 内会抛出错误
 */
export function useLoadingContext(): LoadingContextType {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within OverlayProvider');
  return ctx;
}
