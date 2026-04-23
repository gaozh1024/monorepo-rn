import { generateArtifacts } from './generate-ai-artifacts.mjs';

const mismatches = generateArtifacts({ check: true });

if (mismatches.length > 0) {
  process.exit(1);
}

console.log('AI artifacts are up to date.');
