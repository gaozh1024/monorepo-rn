import React from 'react';
import { useColorScheme } from 'react-native';
import { AppButton, AppProvider, AppText, AppView } from '@gaozh1024/rn-kit';
import { darkTheme, lightTheme } from '../bootstrap/theme';

export type ThemeModeRecipe = 'light' | 'dark' | 'system';

export interface ThemeToggleRecipeProps {
  mode: ThemeModeRecipe;
  onModeChange: (mode: ThemeModeRecipe) => void;
}

/**
 * Controlled theme toggle recipe.
 * Prefer passing isDark into AppProvider instead of remounting the whole app tree.
 */
export function ThemeToggleRecipe({ mode, onModeChange }: ThemeToggleRecipeProps) {
  const systemScheme = useColorScheme();
  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  return (
    <AppProvider lightTheme={lightTheme} darkTheme={darkTheme} isDark={isDark}>
      <AppView flex p={4} gap={3}>
        <AppText size="lg">Current mode: {mode}</AppText>
        <AppView gap={2}>
          <AppButton onPress={() => onModeChange('light')}>Light</AppButton>
          <AppButton onPress={() => onModeChange('dark')}>Dark</AppButton>
          <AppButton onPress={() => onModeChange('system')}>System</AppButton>
        </AppView>
      </AppView>
    </AppProvider>
  );
}
