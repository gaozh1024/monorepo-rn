import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveConditionalExport(
  conditions: string[],
  exportMap: Record<string, string>
): string | undefined {
  for (const [condition, target] of Object.entries(exportMap)) {
    if (conditions.includes(condition)) {
      return target;
    }
  }
  return undefined;
}

describe('rn-kit package Web resolution', () => {
  it('prioritizes browser bundle before react-native/import for Expo Web condition sets', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../package.json'), 'utf8')
    ) as {
      exports: { '.': Record<string, string> };
    };

    const rootExport = packageJson.exports['.'];
    expect(Object.keys(rootExport).indexOf('browser')).toBeLessThan(
      Object.keys(rootExport).indexOf('react-native')
    );
    expect(resolveConditionalExport(['browser', 'react-native', 'import'], rootExport)).toBe(
      './dist/index.web.mjs'
    );
  });
});
