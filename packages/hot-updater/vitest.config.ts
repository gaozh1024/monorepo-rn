import path from 'path';
import { createRequire } from 'module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
// Keep React and react-test-renderer on the same physical React copy. The workspace
// currently resolves package React 19.1 while the root renderer resolves React 19.2.
const reactForTestRenderer = path.resolve(
  path.dirname(require.resolve('react-test-renderer/package.json')),
  '../react'
);

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: reactForTestRenderer,
      },
      {
        find: /^react-native$/,
        replacement: path.resolve(__dirname, './test-react-native-alias.ts'),
      },
      {
        find: /^@hot-updater\/react-native$/,
        replacement: path.resolve(__dirname, './test-hot-updater-react-native-alias.ts'),
      },
      {
        find: /^@gaozh1024\/rn-kit$/,
        replacement: path.resolve(__dirname, './test-rn-kit-alias.ts'),
      },
    ],
  },
});
