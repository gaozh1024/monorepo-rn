import React from 'react';
import { useColorScheme } from 'react-native';
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
  const colorScheme = useColorScheme();
  const { themeMode } = useUIStore();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');

  return (
    <AppProvider
      key={isDark ? 'dark' : 'light'}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultDark={isDark}
    >
      {children}
    </AppProvider>
  );
}
