import React, { createContext, useContext, useState, useMemo } from 'react';
import type { Theme, ThemeConfig } from './types';
import { createTheme } from './create-theme';

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  light: ThemeConfig;
  dark?: ThemeConfig;
  defaultDark?: boolean;
}

export function ThemeProvider({ children, light, dark, defaultDark = false }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(defaultDark);
  const theme = useMemo(() => {
    const config = isDark && dark ? dark : light;
    return createTheme(config);
  }, [isDark, light, dark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
