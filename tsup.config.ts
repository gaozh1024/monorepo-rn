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
    '@gaozh1024/rn-utils',
    '@gaozh1024/rn-theme',
    '@gaozh1024/rn-core',
    '@gaozh1024/rn-ui',
  ],
});
