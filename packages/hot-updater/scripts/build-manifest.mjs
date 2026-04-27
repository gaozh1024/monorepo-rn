#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const result = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith('--')) continue;

    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = 'true';
      continue;
    }

    result[key] = next;
    index += 1;
  }

  return result;
}

function requireArg(args, key) {
  const value = args[key];
  if (!value) {
    throw new Error(`Missing required argument: --${key}`);
  }
  return value;
}

async function readFileMeta(filePath) {
  const buffer = await readFile(filePath);
  const sha256 = createHash('sha256').update(buffer).digest('hex');

  return {
    sha256,
    size: buffer.byteLength,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const platform = requireArg(args, 'platform');
  const channel = requireArg(args, 'channel');
  const bundleId = requireArg(args, 'bundle-id');
  const appVersion = requireArg(args, 'app-version');
  const minNativeVersion = args['min-native-version'] ?? appVersion;
  const url = requireArg(args, 'url');
  const output = requireArg(args, 'output');
  const notes = args.notes ?? '';
  const force = args.force === 'true';
  const disabled = args.disabled === 'true';
  const file = args.file;

  let sha256 = args.sha256;
  let size = args.size ? Number(args.size) : undefined;

  if (file) {
    const meta = await readFileMeta(file);
    sha256 = sha256 ?? meta.sha256;
    size = size ?? meta.size;
  }

  const manifest = {
    schemaVersion: 1,
    platform,
    channel,
    updatedAt: new Date().toISOString(),
    release: {
      bundleId,
      appVersion,
      minNativeVersion,
      force,
      disabled,
      notes,
      url,
      sha256: sha256 ?? 'replace-with-real-sha256',
      size,
    },
  };

  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`Manifest written to ${output}`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
