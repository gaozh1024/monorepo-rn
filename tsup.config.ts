import { defineConfig } from 'tsup';

/**
 * 根目录 tsup 配置
 * 用于统一构建配置模板，子包请使用各自的 tsup.config.ts
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourceMap: true,
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
  ],
});
