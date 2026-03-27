import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider, createTheme } from '@/theme';

export const theme = createTheme({
  colors: { primary: '#f38b32' },
});

export const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider light={theme}>{ui}</ThemeProvider>);
};
