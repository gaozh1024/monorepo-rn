import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../test-setup.ts'],
  },
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, './__mocks__/react-native.tsx'),
      '@testing-library/react-native': path.resolve(
        __dirname,
        './__mocks__/@testing-library/react-native.tsx'
      ),
      'react-native-vector-icons/MaterialIcons': path.resolve(
        __dirname,
        './__mocks__/react-native-vector-icons/MaterialIcons.tsx'
      ),
    },
  },
});
