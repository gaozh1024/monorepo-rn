import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM build
  {
    entry: ['src/index.ts'],
    format: 'esm',
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
      options.jsx = 'transform';
      options.jsxFactory = 'React.createElement';
      options.jsxFragment = 'React.Fragment';
    },
    external: [
      'react',
      'react-native',
      'nativewind',
      'react-native-svg',
      '@gaozh1024/rn-utils',
      '@gaozh1024/rn-theme',
    ],
  },
  // CJS build
  {
    entry: ['src/index.ts'],
    format: 'cjs',
    dts: false,
    splitting: false,
    sourcemap: true,
    esbuildOptions(options) {
      options.jsx = 'transform';
      options.jsxFactory = 'React.createElement';
      options.jsxFragment = 'React.Fragment';
    },
    banner: {
      js: 'var React = require("react");',
    },
    external: [
      'react',
      'react-native',
      'nativewind',
      'react-native-svg',
      '@gaozh1024/rn-utils',
      '@gaozh1024/rn-theme',
    ],
  },
]);
