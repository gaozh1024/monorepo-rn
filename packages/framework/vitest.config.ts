import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, './test/react-native-alias.ts'),
      },
      {
        find: /^react-native\/.+$/,
        replacement: path.resolve(__dirname, './test/react-native-alias.ts'),
      },
      {
        find: 'react-native-vector-icons/MaterialIcons',
        replacement: path.resolve(__dirname, './test/material-icons-alias.ts'),
      },
      {
        find: 'react-native-safe-area-context',
        replacement: path.resolve(__dirname, './test/safe-area-context-alias.ts'),
      },
      {
        find: '@react-navigation/stack',
        replacement: path.resolve(__dirname, './test/react-navigation-stack-alias.ts'),
      },
      {
        find: '@/navigation/vendor/stack',
        replacement: path.resolve(__dirname, './test/react-navigation-stack-alias.ts'),
      },
      {
        find: 'nativewind/jsx-runtime',
        replacement: path.resolve(__dirname, './test/nativewind-jsx-runtime-alias.ts'),
      },
      {
        find: 'nativewind/jsx-dev-runtime',
        replacement: path.resolve(__dirname, './test/nativewind-jsx-runtime-alias.ts'),
      },
    ],
  },
});
