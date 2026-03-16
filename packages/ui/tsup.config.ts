import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // 暂时关闭，NativeWind 类型问题需要单独处理
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-native',
    'nativewind',
    'react-native-svg',
    '@gaozh1024/rn-utils',
    '@gaozh1024/rn-theme',
  ],
});
