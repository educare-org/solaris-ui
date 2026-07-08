import path from 'node:path';
import {
  workspaceRoot,
  fileExists,
  readdirSafe,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const hasPnpmWorkspace = fileExists('pnpm-workspace.yaml');
const hasNxJson = fileExists('nx.json');
const hasTsconfigBase = fileExists('tsconfig.base.json');
const hasApps = fileExists('apps');
const hasPackages = fileExists('packages');

if (!hasPnpmWorkspace) {
  errors.push(
    'Missing pnpm-workspace.yaml — required for pnpm workspace setup',
  );
}
if (!hasNxJson) {
  errors.push('Missing nx.json — required for Nx workspace configuration');
}
if (!hasTsconfigBase) {
  warnings.push(
    'Missing tsconfig.base.json — recommended for TypeScript project references',
  );
}
if (!hasApps) {
  warnings.push(
    'apps/ directory not found — expected for application projects',
  );
}
if (!hasPackages) {
  warnings.push(
    'packages/ directory not found — expected for library projects',
  );
}

if (hasApps) {
  const appEntries = readdirSafe('apps');
  if (appEntries.length === 0) {
    warnings.push('apps/ directory is empty');
  }
}
if (hasPackages) {
  const pkgEntries = readdirSafe('packages');
  if (pkgEntries.length === 0) {
    warnings.push('packages/ directory is empty');
  }
}

const result = printSummary('Workspace Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
