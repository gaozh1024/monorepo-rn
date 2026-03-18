/**
 * Alert 子系统 Hooks
 * @module overlay/alert/hooks
 */

import { useAlertContext } from './context';
import type { AlertContextType } from './types';

/**
 * 使用 Alert 控制
 * @returns Alert 控制方法
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { alert, confirm } = useAlert();
 *
 *   const handleDelete = () => {
 *     confirm({
 *       title: '确认删除',
 *       message: '此操作不可撤销',
 *       onConfirm: () => deleteItem(),
 *     });
 *   };
 *
 *   const handleNotify = () => {
 *     alert({
 *       title: '提示',
 *       message: '操作成功',
 *     });
 *   };
 * }
 * ```
 */
export function useAlert(): AlertContextType {
  return useAlertContext();
}
