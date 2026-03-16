import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: [
    'react',
    'react-native',
    'react-native-svg',
    'nativewind',
    '@tanstack/react-query',
    'zod',
    'clsx',
    'tailwind-merge',
    '@panther-expo/utils',
    '@panther-expo/theme',
    '@panther-expo/core',
    '@panther-expo/ui',
  ],
});
