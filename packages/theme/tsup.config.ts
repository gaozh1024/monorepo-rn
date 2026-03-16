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
  external: ['react', 'react-native', '@gaozh1024/rn-utils'],
});
