/**
 * Alert 子系统类型定义
 * @module overlay/alert/types
 */

import type { PresenceMotionProps } from '@/ui/motion';

/**
 * Alert 选项
 */
export interface AlertOptions extends PresenceMotionProps {
  /** 标题 */
  title?: string;
  /** 消息内容 */
  message?: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认回调 */
  onConfirm?: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
}

/**
 * Alert 上下文类型
 */
export interface AlertContextType {
  /** 显示 Alert */
  alert: (options: AlertOptions) => void;
  /** 显示确认对话框 */
  confirm: (options: Omit<AlertOptions, 'showCancel'>) => void;
}
