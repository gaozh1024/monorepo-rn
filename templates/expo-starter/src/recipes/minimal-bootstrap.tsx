import React from 'react';
import { AppProvider, AppText, AppView } from '@gaozh1024/rn-kit';
import { darkTheme, lightTheme } from '../bootstrap/theme';

export interface MinimalBootstrapRecipeProps {
  isDark?: boolean;
}

/**
 * Minimal AppProvider bootstrap recipe.
 * Use this when a new app needs the smallest Panther-compatible root setup.
 */
export function MinimalBootstrapRecipe({ isDark = false }: MinimalBootstrapRecipeProps) {
  return (
    <AppProvider lightTheme={lightTheme} darkTheme={darkTheme} isDark={isDark}>
      <AppView flex p={4} gap={3}>
        <AppText size="xl" weight="semibold">
          Panther App
        </AppText>
        <AppText color="secondary">
          Start from AppProvider, then add business providers above it.
        </AppText>
      </AppView>
    </AppProvider>
  );
}
