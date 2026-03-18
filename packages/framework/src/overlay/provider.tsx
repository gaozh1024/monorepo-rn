/**
 * 统一 Overlay Provider
 * @module overlay/provider
 * @description 整合 Loading、Toast、Alert 三个子系统
 */

import React from 'react';
import { LoadingProvider } from './loading/provider';
import { ToastProvider } from './toast/provider';
import { AlertProvider } from './alert/provider';

/**
 * Overlay Provider Props
 */
export interface OverlayProviderProps {
  children: React.ReactNode;
}

/**
 * 统一 Overlay Provider
 *
 * 整合：LoadingProvider + ToastProvider + AlertProvider
 * 提供全局 Loading、Toast、Alert 功能
 */
export function OverlayProvider({ children }: OverlayProviderProps) {
  return (
    <LoadingProvider>
      <ToastProvider>
        <AlertProvider>{children}</AlertProvider>
      </ToastProvider>
    </LoadingProvider>
  );
}
