import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-native',
    '@gaozh1024/rn-kit',
    '@react-navigation/native',
    '@shopify/flash-list',
    'expo',
    'expo-image',
    'expo-image-manipulator',
    'expo-media-library',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-zoom-toolkit',
  ],
});
