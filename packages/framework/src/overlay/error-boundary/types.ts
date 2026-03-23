import type { ReactNode } from 'react';
import type { ErrorInfo } from 'react';

export interface ErrorBoundaryFallbackRenderProps {
  error: Error;
  reset: () => void;
}

export interface AppErrorBoundaryProps {
  children: ReactNode;
  enabled?: boolean;
  title?: string;
  description?: string;
  showDetails?: boolean;
  resetText?: string;
  fallback?: ReactNode | ((props: ErrorBoundaryFallbackRenderProps) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
}
