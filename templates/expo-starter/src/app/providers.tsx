import React from 'react';
import { AppProvider } from '@gaozh1024/rn-kit';
import { lightTheme, darkTheme } from '../bootstrap/theme';
import { useUIStore } from '../store/ui.store';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * 应用 Providers
 * 统一包裹 AppProvider，挂主题和全局配置
 */
export function Providers({ children }: ProvidersProps) {
  const { isDark } = useUIStore();

  return (
    <AppProvider
      theme={{
        light: lightTheme,
        dark: darkTheme,
      }}
      initialTheme={isDark ? 'dark' : 'light'}
    >
      {children}
    </AppProvider>
  );
}
