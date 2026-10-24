import { workspaceRoot, fileExists, printSummary } from './shared.mjs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const errors = [];
const warnings = [];
const notes = [];

const args = process.argv.slice(2);
function flagValue(name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}
const forceStrict = args.includes('--strict');
const forceWarn = args.includes('--warn');

function git(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', shell: true }).trim();
  } catch {
    return null;
  }
}

function resolveBase() {
  const explicit = flagValue('--base');
  const candidates = explicit
    ? [explicit]
    : ['origin/develop', 'develop', 'origin/main', 'main'];
  for (const ref of candidates) {
    if (git(`git rev-parse --verify --quiet ${ref}`)) return ref;
  }
  return null;
}

function changedLibFiles(base) {
  const files = new Set();
  if (base) {
    const ranged = git(`git diff --name-only ${base}...HEAD`);
    if (ranged) {
      for (const f of ranged
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)) {
        files.add(f);
      }
    } else {
      notes.push(`No committed differences vs ${base} (or base unreachable).`);
    }
  }
  const dirty = git('git diff --name-only HEAD');
  if (dirty) {
    for (const f of dirty
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)) {
      files.add(f);
    }
  }
  return [...files].filter((f) => f.startsWith('packages/angular/'));
}

function pushingToProtectedBranch() {
  if (process.stdin.isTTY) return false;
  try {
    const chunks = fs.readFileSync(process.stdin.fd, 'utf-8');
    return chunks
      .split('\n')
      .some((line) =>
        ['refs/heads/develop', 'refs/heads/main'].some((b) => line.includes(b)),
      );
  } catch {
    return false;
  }
}

function isCiPrToProtected() {
  if (!process.env.GITHUB_ACTIONS) return false;
  if (process.env.GITHUB_EVENT_NAME !== 'pull_request') return false;
  const baseRef = process.env.GITHUB_BASE_REF || '';
  return baseRef === 'develop' || baseRef === 'main';
}

const libPath = path.join(workspaceRoot, 'packages/angular');
const changesetDir = path.join(workspaceRoot, '.changeset');

if (!fileExists(path.join(libPath, 'package.json'))) {
  warnings.push(
    'packages/angular/package.json not found — changeset check skipped.',
  );
} else {
  const base = resolveBase();
  if (!base) {
    warnings.push('No git base ref found — changeset check skipped.');
  } else {
    const libFiles = changedLibFiles(base);
    const releaseMetadataFiles = new Set([
      'packages/angular/CHANGELOG.md',
      'packages/angular/package.json',
    ]);
    const significant = libFiles.filter((f) => !releaseMetadataFiles.has(f));

    if (significant.length > 0) {
      const hasPending = (() => {
        if (!fileExists(changesetDir)) return false;
        try {
          return fs
            .readdirSync(changesetDir, { withFileTypes: true })
            .some(
              (e) =>
                e.isFile() &&
                e.name.endsWith('.md') &&
                e.name !== 'config.json' &&
                e.name !== 'README.md',
            );
        } catch {
          return false;
        }
      })();

      if (!hasPending) {
        const currentBranch = git('git branch --show-current') || '';
        const onProtected =
          currentBranch === 'develop' || currentBranch === 'main';
        const isRelease = libFiles.includes('packages/angular/CHANGELOG.md');
        const strict =
          forceStrict ||
          (!forceWarn &&
            !isRelease &&
            (onProtected || pushingToProtectedBranch() || isCiPrToProtected()));
        const msg =
          `Changes detected in @educarehq/solaris-ui vs ${base} ` +
          `(${significant.length} file(s)) but no pending changeset found.` +
          ` Run "pnpm changeset add" to document this change.`;
        if (strict) {
          errors.push(msg);
        } else {
          warnings.push(
            `${msg} (warn-only on branch "${currentBranch || '?'}").`,
          );
        }
      }
    }
  }
}

for (const n of notes) console.log(`  (note) ${n}`);
const result = printSummary('Changeset Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
