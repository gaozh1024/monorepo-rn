import React from 'react';
import { useColorScheme } from 'react-native';
import { AppProvider } from '@gaozh1024/rn-kit';
import { lightTheme, darkTheme } from '../bootstrap/theme';
import { appLinking } from '../navigation/linking';
import { AppProviders } from '../providers/AppProviders';
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
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      isDark={isDark}
      linking={appLinking}
      enableLogger
      enableErrorBoundary
      loggerProps={{
        level: 'debug',
        maxEntries: 200,
        exportEnabled: true,
      }}
      errorBoundaryProps={{
        title: '应用渲染异常',
        description: '开发环境已启用错误边界，可结合日志浮层快速排查问题。',
        showDetails: true,
        resetText: '重新加载',
      }}
    >
      <AppProviders>{children}</AppProviders>
    </AppProvider>
  );
}
