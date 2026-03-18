/**
 * Toast 子系统类型定义
 * @module overlay/toast/types
 */

/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast 项
 */
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Toast 上下文类型
 */
export interface ToastContextType {
  /** 显示 Toast */
  show: (message: string, type?: ToastType, duration?: number) => void;
  /** 显示成功 Toast */
  success: (message: string, duration?: number) => void;
  /** 显示错误 Toast */
  error: (message: string, duration?: number) => void;
  /** 显示信息 Toast */
  info: (message: string, duration?: number) => void;
  /** 显示警告 Toast */
  warning: (message: string, duration?: number) => void;
}
