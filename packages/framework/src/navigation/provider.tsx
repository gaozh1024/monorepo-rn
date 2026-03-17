import React from 'react';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { createNavigationTheme } from './utils/navigation-theme';

export interface NavigationProviderProps {
  children: React.ReactNode;
  linking?: LinkingOptions<any>;
  fallback?: React.ReactNode;
  onReady?: () => void;
  onUnhandledAction?: (action: any) => void;
}

export function NavigationProvider({
  children,
  linking,
  fallback,
  onReady,
  onUnhandledAction,
}: NavigationProviderProps) {
  const { theme, isDark } = useTheme();
  const navigationTheme = React.useMemo(
    () => createNavigationTheme(theme, isDark),
    [theme, isDark]
  );

  return (
    <NavigationContainer
      theme={navigationTheme}
      linking={linking}
      fallback={fallback}
      onReady={onReady}
      onUnhandledAction={onUnhandledAction}
    >
      {children}
    </NavigationContainer>
  );
}
