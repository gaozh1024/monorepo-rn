#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error('Usage: node packages/hot-updater/scripts/print-file-meta.mjs <file>');
  }

  const buffer = await readFile(filePath);
  const sha256 = createHash('sha256').update(buffer).digest('hex');

  console.log(
    JSON.stringify(
      {
        file: filePath,
        sha256,
        size: buffer.byteLength,
      },
      null,
      2,
    ),
  );
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
