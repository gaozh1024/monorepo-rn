import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationProvider } from '../provider';
import { ThemeProvider, createTheme } from '@gaozh/rn-theme';

describe('Import Test', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
