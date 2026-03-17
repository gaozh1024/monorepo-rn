import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // 支持 @/ 路径别名
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    };
  },
  // 外部依赖
  external: [
    'react',
    'react-native',
    'react-native-screens',
    'react-native-safe-area-context',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-vector-icons/MaterialIcons',
  ],
});
