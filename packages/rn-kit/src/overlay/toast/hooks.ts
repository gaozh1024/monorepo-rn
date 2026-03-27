/**
 * Toast 子系统 Hooks
 * @module overlay/toast/hooks
 */

import { useToastContext } from './context';
import type { ToastContextType } from './types';

/**
 * 使用 Toast 控制
 * @returns Toast 控制方法
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { success, error } = useToast();
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await submitData();
 *       success('提交成功！');
 *     } catch (e) {
 *       error('提交失败');
 *     }
 *   };
 * }
 * ```
 */
export function useToast(): ToastContextType {
  return useToastContext();
}
