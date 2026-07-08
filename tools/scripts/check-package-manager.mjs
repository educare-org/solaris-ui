import path from 'node:path';
import {
  workspaceRoot,
  fileExists,
  readJson,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const lockFiles = [
  { file: 'package-lock.json', name: 'npm' },
  { file: 'yarn.lock', name: 'Yarn' },
  { file: 'bun.lockb', name: 'Bun' },
];

for (const { file, name } of lockFiles) {
  if (fileExists(file)) {
    errors.push(
      `Found ${file} — ${name} lock file detected. Solaris requires pnpm. Delete ${file} and use pnpm install.`,
    );
  }
}

if (!fileExists('pnpm-lock.yaml')) {
  warnings.push('Missing pnpm-lock.yaml — run pnpm install to generate it');
}

if (!fileExists('package.json')) {
  errors.push('Missing package.json at workspace root');
} else {
  const pkg = readJson('package.json');
  if (!pkg.packageManager) {
    errors.push(
      'Missing "packageManager" field in package.json. Add: "packageManager": "pnpm@9.x.x" (use the installed pnpm version)',
    );
  } else if (!pkg.packageManager.startsWith('pnpm')) {
    errors.push(
      `"packageManager" in package.json is "${pkg.packageManager}" — must be "pnpm@<version>"`,
    );
  }
}

const result = printSummary('Package Manager Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
