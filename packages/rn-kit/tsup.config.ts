import { defineConfig, type Options } from 'tsup';

const external = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-native',
  'react-native-screens',
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-reanimated',
  '@expo/vector-icons',
  'nativewind',
  'nativewind/jsx-runtime',
  'nativewind/jsx-dev-runtime',
];

function withSharedOptions(options: Options, web = false): Options {
  return {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: web ? false : true,
    splitting: false,
    sourcemap: true,
    clean: !web,
    outExtension({ format }) {
      if (!web) {
        return { js: format === 'esm' ? '.mjs' : '.js' };
      }
      return { js: format === 'esm' ? '.web.mjs' : '.web.js' };
    },
    esbuildOptions(esbuildOptions) {
      esbuildOptions.alias = {
        '@': './src',
      };
      esbuildOptions.jsx = 'automatic';
      esbuildOptions.jsxImportSource = 'nativewind';
      if (web) {
        esbuildOptions.resolveExtensions = [
          '.web.tsx',
          '.web.ts',
          '.web.jsx',
          '.web.js',
          '.tsx',
          '.ts',
          '.jsx',
          '.js',
          '.json',
        ];
      }
      options.esbuildOptions?.(esbuildOptions, {} as never);
    },
    external,
  };
}

export default defineConfig(options => [
  withSharedOptions(options),
  withSharedOptions(options, true),
]);
