import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const cliPath = path.resolve(__dirname, '../bin/rn-kit.js');

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'rn-kit-init-ai-'));
}

function runCli(args: string[], cwd?: string) {
  return execFileSync('node', [cliPath, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

describe('rn-kit init-ai', () => {
  it('creates AGENTS.md and copilot instructions in a fresh target', () => {
    const targetDir = makeTempDir();

    runCli(['init-ai', '--target', targetDir]);

    expect(fs.existsSync(path.join(targetDir, 'AGENTS.md'))).toBe(true);
    expect(fs.existsSync(path.join(targetDir, '.github', 'copilot-instructions.md'))).toBe(true);
  });

  it('appends a single managed block to an existing AGENTS.md and stays idempotent', () => {
    const targetDir = makeTempDir();
    const agentsPath = path.join(targetDir, 'AGENTS.md');

    fs.writeFileSync(agentsPath, '# Existing Rules\n\nKeep local conventions.\n');

    runCli(['init-ai', '--target', targetDir]);
    runCli(['init-ai', '--target', targetDir]);

    const content = fs.readFileSync(agentsPath, 'utf8');

    expect(content).toContain('# Existing Rules');
    expect(content.match(/<!-- panther:init-ai:start -->/g)?.length ?? 0).toBe(1);
    expect(content.match(/<!-- panther:init-ai:end -->/g)?.length ?? 0).toBe(1);
  });

  it('fails on broken markers instead of writing duplicate content', () => {
    const targetDir = makeTempDir();
    const agentsPath = path.join(targetDir, 'AGENTS.md');

    fs.writeFileSync(agentsPath, '<!-- panther:init-ai:start -->\nBroken block\n');

    expect(() => runCli(['init-ai', '--target', targetDir])).toThrow(
      /Managed block markers are broken/
    );
  });

  it('supports check mode and reports pending changes', () => {
    const targetDir = makeTempDir();

    expect(() => runCli(['init-ai', '--target', targetDir, '--check'])).toThrow();
  });

  it('creates the optional cursor rule only when requested', () => {
    const targetDir = makeTempDir();

    runCli(['init-ai', '--target', targetDir, '--include', 'cursor']);

    expect(fs.existsSync(path.join(targetDir, '.cursor', 'rules', 'panther.mdc'))).toBe(true);
  });
});
