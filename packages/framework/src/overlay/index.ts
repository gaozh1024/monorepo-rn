/**
 * Overlay 模块
 *
 * @module overlay
 * @description 全局 UI 状态管理（Loading、Toast、Alert）和 Provider 整合
 */

// App Provider - 统一所有 Provider
export { AppProvider, type AppProviderProps } from './AppProvider';
export { AppStatusBar, type AppStatusBarProps } from './AppStatusBar';

// Overlay Provider - 整合 Loading、Toast、Alert
export { OverlayProvider, type OverlayProviderProps } from './provider';

// Loading 子系统
export { useLoading } from './loading/hooks';
export type { LoadingContextType, LoadingState } from './loading/types';

// Toast 子系统
export { useToast } from './toast/hooks';
export type { ToastContextType, ToastItem, ToastType } from './toast/types';

// Alert 子系统
export { useAlert } from './alert/hooks';
export type { AlertContextType, AlertOptions } from './alert/types';
