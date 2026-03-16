import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    tsconfig: './tsconfig.json',
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-native', 'clsx', 'tailwind-merge'],
});
