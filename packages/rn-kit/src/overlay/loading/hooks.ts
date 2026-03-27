/**
 * Loading 子系统 Hooks
 * @module overlay/loading/hooks
 */

import { useLoadingContext } from './context';
import type { LoadingContextType } from './types';

/**
 * 使用 Loading 控制
 * @returns Loading 控制方法
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { show, hide } = useLoading();
 *
 *   const handleSubmit = async () => {
 *     show('提交中...');
 *     await submitData();
 *     hide();
 *   };
 * }
 * ```
 */
export function useLoading(): LoadingContextType {
  return useLoadingContext();
}
