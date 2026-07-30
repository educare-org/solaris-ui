import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { workspaceRoot, fileExists, printSummary } from './shared.mjs';

const errors = [];
const warnings = [];

const libPath = path.join(workspaceRoot, 'packages/angular');
const changesetDir = path.join(workspaceRoot, '.changeset');

function getChangedPackages() {
  const libPkg = path.join(libPath, 'package.json');
  if (!fileExists(libPkg)) {
    return [];
  }
  try {
    const result = execSync('git diff --name-only HEAD', {
      encoding: 'utf-8',
      shell: true,
    });
    const files = result.trim().split('\n').filter(Boolean);
    const libFiles = files.filter((f) => f.startsWith('packages/angular/'));
    return libFiles.length > 0 ? ['@solaris-ui/angular'] : [];
  } catch {
    warnings.push('Could not detect changed files — is this a git repository?');
    return [];
  }
}

function hasPendingChangeset() {
  if (!fileExists(changesetDir)) {
    return false;
  }
  try {
    const entries = fs.readdirSync(changesetDir, { withFileTypes: true });
    return entries.some(
      (e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'config.json' && e.name !== 'README.md',
    );
  } catch {
    return false;
  }
}

const changedPackages = getChangedPackages();

if (changedPackages.length > 0 && !hasPendingChangeset()) {
  errors.push(
    `Changes detected in ${changedPackages.join(', ')} but no pending changeset found.`,
  );
  errors.push(`  → Run "pnpm changeset add" to document this change.`);
}

const result = printSummary('Changeset Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
