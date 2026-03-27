/**
 * 统一 Overlay Provider
 * @module overlay/provider
 * @description 整合 Loading、Toast、Alert 三个子系统
 */

import React from 'react';
import { LoadingProvider } from './loading/provider';
import { ToastProvider } from './toast/provider';
import { AlertProvider } from './alert/provider';
import { LoggerProvider } from './logger/provider';
import type { LoggerProviderProps } from './logger/types';
import { AppErrorBoundary } from './error-boundary/component';
import type { AppErrorBoundaryProps } from './error-boundary/types';

/**
 * Overlay Provider Props
 */
export interface OverlayProviderProps {
  children: React.ReactNode;
  loggerProps?: Omit<LoggerProviderProps, 'children'>;
  errorBoundaryProps?: Omit<AppErrorBoundaryProps, 'children'>;
}

/**
 * 统一 Overlay Provider
 *
 * 整合：LoadingProvider + ToastProvider + AlertProvider
 * 提供全局 Loading、Toast、Alert 功能
 */
export function OverlayProvider({
  children,
  loggerProps,
  errorBoundaryProps,
}: OverlayProviderProps) {
  return (
    <LoggerProvider {...loggerProps}>
      <AppErrorBoundary {...errorBoundaryProps}>
        <LoadingProvider>
          <ToastProvider>
            <AlertProvider>{children}</AlertProvider>
          </ToastProvider>
        </LoadingProvider>
      </AppErrorBoundary>
    </LoggerProvider>
  );
}
