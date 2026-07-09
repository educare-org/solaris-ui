import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import {
  workspaceRoot,
  fileExists,
  readJson,
  readdirSafe,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
if (nodeMajor < 18) {
  errors.push(
    `Node version ${nodeVersion} is too old. Solaris requires Node >= 18. Current: ${nodeVersion}`,
  );
} else {
  warnings.push(`Node version: ${nodeVersion}`);
}

try {
  const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
  warnings.push(`pnpm version: ${pnpmVersion}`);
} catch {
  errors.push(
    'pnpm is not installed or not found in PATH. Solaris requires pnpm.',
  );
}

if (fileExists('package.json')) {
  const pkg = readJson('package.json');
  if (pkg.packageManager) {
    warnings.push(`packageManager: ${pkg.packageManager}`);
  } else {
    errors.push('Missing "packageManager" field in package.json');
  }
} else {
  errors.push('Missing package.json at workspace root');
}

if (fileExists('pnpm-lock.yaml')) {
  warnings.push('pnpm-lock.yaml found — OK');
} else {
  errors.push('pnpm-lock.yaml not found — run pnpm install');
}

const forbiddenLocks = ['package-lock.json', 'yarn.lock', 'bun.lockb'];
for (const lock of forbiddenLocks) {
  if (fileExists(lock)) {
    errors.push(`Found ${lock} — should not exist in a pnpm workspace`);
  }
}

if (fileExists('apps')) {
  const apps = readdirSafe('apps');
  warnings.push(`apps/ directory found with ${apps.length} entries`);
} else {
  warnings.push('apps/ directory not found');
}

if (fileExists('packages')) {
  const packages = readdirSafe('packages');
  warnings.push(`packages/ directory found with ${packages.length} entries`);
} else {
  warnings.push('packages/ directory not found');
}

const docDirs = [
  'docs/overview',
  'docs/architecture',
  'docs/engineering',
  'docs/quality-and-validation',
  'docs/roadmap',
  'docs/standards',
  'docs/workflow-and-release',
];
for (const dir of docDirs) {
  if (fileExists(dir)) {
    const entries = readdirSafe(dir);
    warnings.push(`${dir}/ — ${entries.length} file(s)`);
  } else {
    warnings.push(`${dir}/ — not found`);
  }
}

if (fileExists('package.json')) {
  const pkg = readJson('package.json');
  const scripts = pkg.scripts || {};
  const requiredScripts = [
    'start',
    'build',
    'test',
    'lint',
    'format',
    'check',
    'verify',
    'doctor',
  ];
  for (const script of requiredScripts) {
    if (!scripts[script]) {
      warnings.push(`Missing recommended script: "${script}" in package.json`);
    }
  }
}

try {
  const isPnpm =
    process.env.npm_config_user_agent &&
    process.env.npm_config_user_agent.startsWith('pnpm');
  if (isPnpm) {
    warnings.push('Running with pnpm — OK');
  } else {
    warnings.push('Not detected as running with pnpm. Run with: pnpm doctor');
  }
} catch {}

if (fs.existsSync(path.join(workspaceRoot, '.git'))) {
  warnings.push('.git found — repository initialized');
  const hooksDirPath = path.join(workspaceRoot, '.git', 'hooks');
  try {
    const hookFiles = fs.readdirSync(hooksDirPath);
    const hasPreCommit = hookFiles.includes('pre-commit');
    const hasCommitMsg = hookFiles.includes('commit-msg');
    if (hasPreCommit) {
      warnings.push('pre-commit hook is installed');
    } else {
      warnings.push('pre-commit hook not found — run pnpm prepare');
    }
    if (hasCommitMsg) {
      warnings.push('commit-msg hook is installed');
    } else {
      warnings.push('commit-msg hook not found — run pnpm prepare');
    }
  } catch {
    warnings.push('Git hooks directory not found');
  }
} else {
  errors.push('No .git directory found — not a git repository');
}

if (fileExists('commitlint.config.mjs')) {
  warnings.push('commitlint config found — OK');
} else {
  errors.push('commitlint.config.mjs not found');
}

if (fileExists('package.json')) {
  const pkg = readJson('package.json');
  if (pkg['simple-git-hooks']) {
    warnings.push('simple-git-hooks configured in package.json');
  } else {
    warnings.push('simple-git-hooks not configured in package.json');
  }
}

if (fileExists('.changeset/config.json')) {
  warnings.push('.changeset/config.json found — OK');
} else {
  warnings.push('.changeset directory not found — run pnpm changeset init');
}

if (fileExists('.github/workflows/ci.yml')) {
  warnings.push('.github/workflows/ci.yml found — OK');
} else {
  warnings.push('CI workflow not configured');
}

if (fileExists('.storybook') || fileExists('packages/angular/.storybook')) {
  warnings.push('Storybook config found — OK');
} else {
  warnings.push('Storybook not configured');
}

if (fileExists('packages/angular/src') && fileExists('packages/angular/.storybook')) {
  const storyFiles = findFilesRecursive('packages/angular/src', /\.stories\.ts$/);
  if (storyFiles.length > 0) {
    warnings.push(`Storybook stories found: ${storyFiles.length} file(s)`);
  } else {
    warnings.push('No Storybook stories found');
  }
}

const result = printSummary('Doctor', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
