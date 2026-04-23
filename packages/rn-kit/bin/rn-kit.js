#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const START_MARKER = '<!-- panther:init-ai:start -->';
const END_MARKER = '<!-- panther:init-ai:end -->';

const TEMPLATE_DIR = path.resolve(__dirname, '..', 'init-ai');

function printUsage() {
  console.log(`Usage:
  rn-kit init-ai [--target <dir>] [--check] [--dry-run] [--include cursor] [--force-rewrite]

Examples:
  rn-kit init-ai
  rn-kit init-ai --target ./apps/my-app
  rn-kit init-ai --check
  rn-kit init-ai --include cursor`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const options = {
    command,
    check: false,
    dryRun: false,
    target: process.cwd(),
    includeCursor: false,
    forceRewrite: false,
  };

  for (let i = 1; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--check') {
      options.check = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--force-rewrite') {
      options.forceRewrite = true;
      continue;
    }

    if (arg === '--target') {
      i += 1;
      if (!args[i]) throw new Error('Missing value for --target');
      options.target = path.resolve(args[i]);
      continue;
    }

    if (arg === '--include') {
      i += 1;
      if (!args[i]) throw new Error('Missing value for --include');
      if (args[i] === 'cursor' || args[i] === 'all') {
        options.includeCursor = true;
        continue;
      }

      throw new Error(`Unsupported include value: ${args[i]}`);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, name), 'utf8').trimEnd();
}

function detectEol(text) {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

function normalizeEol(text) {
  return text.replace(/\r\n/g, '\n');
}

function buildTargets(options) {
  const targets = [
    {
      label: 'AGENTS.md',
      path: path.join(options.target, 'AGENTS.md'),
      managedContent: readTemplate('agents-block.md'),
      appendOnly: true,
    },
    {
      label: '.github/copilot-instructions.md',
      path: path.join(options.target, '.github', 'copilot-instructions.md'),
      managedContent: readTemplate('copilot-block.md'),
      appendOnly: true,
    },
  ];

  if (options.includeCursor) {
    targets.push({
      label: '.cursor/rules/panther.mdc',
      path: path.join(options.target, '.cursor', 'rules', 'panther.mdc'),
      managedContent: readTemplate('cursor-rule.mdc'),
      appendOnly: true,
    });
  }

  return targets;
}

function buildManagedBlock(content, eol) {
  return `${START_MARKER}${eol}${content.replace(/\n/g, eol)}${eol}${END_MARKER}`;
}

function appendManagedBlock(originalNormalized, managedBlock) {
  if (originalNormalized.trim().length === 0) {
    return `${managedBlock}\n`;
  }

  const trimmed = originalNormalized.replace(/\s+$/, '');
  return `${trimmed}\n\n${managedBlock}\n`;
}

function syncManagedFile(target, options) {
  const exists = fs.existsSync(target.path);

  if (!exists) {
    const eol = '\n';
    const nextContent = `${buildManagedBlock(target.managedContent, eol)}${eol}`;
    return {
      status: 'created',
      changed: true,
      nextContent,
      eol,
    };
  }

  const original = fs.readFileSync(target.path, 'utf8');
  const eol = detectEol(original);
  const normalized = normalizeEol(original);
  const startIndex = normalized.indexOf(START_MARKER);
  const endIndex = normalized.indexOf(END_MARKER);
  const managedBlock = buildManagedBlock(target.managedContent, eol);

  if (options.forceRewrite) {
    const rewritten = `${managedBlock}${eol}`;
    return {
      status: normalizeEol(rewritten) === normalized ? 'up_to_date' : 'rewritten',
      changed: normalizeEol(rewritten) !== normalized,
      nextContent: rewritten,
      eol,
    };
  }

  if (
    (startIndex >= 0 && endIndex < 0) ||
    (startIndex < 0 && endIndex >= 0) ||
    endIndex < startIndex
  ) {
    return {
      status: 'conflict',
      changed: false,
      error: `Managed block markers are broken in ${target.label}`,
    };
  }

  if (startIndex >= 0 && endIndex >= 0) {
    const endExclusive = endIndex + END_MARKER.length;
    const updatedNormalized =
      normalized.slice(0, startIndex) + normalizeEol(managedBlock) + normalized.slice(endExclusive);

    const changed = updatedNormalized !== normalized;
    return {
      status: changed ? 'updated' : 'up_to_date',
      changed,
      nextContent: updatedNormalized.replace(/\n/g, eol),
      eol,
    };
  }

  const appended = appendManagedBlock(normalized, normalizeEol(managedBlock)).replace(/\n/g, eol);
  return {
    status: 'appended',
    changed: true,
    nextContent: appended,
    eol,
  };
}

function applyResult(target, result, options) {
  if (result.status === 'conflict') {
    throw new Error(result.error);
  }

  if (!result.changed) {
    console.log(`up_to_date ${target.label}`);
    return false;
  }

  if (options.check || options.dryRun) {
    console.log(`${result.status} ${target.label}`);
    return true;
  }

  fs.mkdirSync(path.dirname(target.path), { recursive: true });
  fs.writeFileSync(target.path, result.nextContent);
  console.log(`${result.status} ${target.label}`);
  return true;
}

function runInitAi(options) {
  const targets = buildTargets(options);
  let hasChanges = false;

  for (const target of targets) {
    const result = syncManagedFile(target, options);
    const changed = applyResult(target, result, options);
    hasChanges = hasChanges || changed;
  }

  if (options.check && hasChanges) {
    process.exitCode = 1;
  }
}

function main() {
  try {
    const options = parseArgs(process.argv);

    if (!options.command || options.command === '--help' || options.command === '-h') {
      printUsage();
      return;
    }

    if (options.command !== 'init-ai') {
      throw new Error(`Unsupported command: ${options.command}`);
    }

    runInitAi(options);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  START_MARKER,
  END_MARKER,
  buildTargets,
  syncManagedFile,
  parseArgs,
};
