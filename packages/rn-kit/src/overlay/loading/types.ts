/**
 * Loading 子系统类型定义
 * @module overlay/loading/types
 */

/**
 * Loading 状态
 */
export interface LoadingState {
  visible: boolean;
  text?: string;
}

/**
 * Loading 上下文类型
 */
export interface LoadingContextType {
  /** 显示 Loading */
  show: (text?: string) => void;
  /** 隐藏 Loading */
  hide: () => void;
}
