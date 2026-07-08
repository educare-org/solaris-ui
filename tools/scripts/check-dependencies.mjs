import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readJson,
  printSummary,
} from './shared.mjs';

const errors = [];
const warnings = [];

if (fileExists('package-lock.json')) {
  errors.push('package-lock.json found — use pnpm, not npm. Delete this file.');
}
if (fileExists('yarn.lock')) {
  errors.push('yarn.lock found — use pnpm, not Yarn. Delete this file.');
}
if (fileExists('bun.lockb')) {
  errors.push('bun.lockb found — use pnpm, not Bun. Delete this file.');
}

if (fileExists('packages/angular/package.json')) {
  const libPkg = readJson('packages/angular/package.json');

  const deps = {
    ...(libPkg.dependencies || {}),
    ...(libPkg.peerDependencies || {}),
  };

  const forbiddenDeps = [
    {
      pattern: /^tailwind/,
      name: 'Tailwind',
      reason: 'Tailwind is forbidden inside the library per dependency policy',
    },
    {
      pattern: /^@ngrx\/store/,
      name: 'State management',
      reason:
        'State management frameworks are not allowed in core per dependency policy',
    },
    {
      pattern: /^moment/,
      name: 'Moment.js',
      reason:
        'Heavy date libraries are not allowed in core; use Intl or date adapters',
    },
    {
      pattern: /^date-fns/,
      name: 'date-fns',
      reason:
        'Heavy date libraries are not allowed in core; use Intl or date adapters',
    },
    {
      pattern: /^dayjs/,
      name: 'Day.js',
      reason:
        'Date libraries should be evaluated only when datepicker/calendar components require them',
    },
  ];

  for (const [depName] of Object.entries(deps)) {
    for (const rule of forbiddenDeps) {
      if (rule.pattern.test(depName)) {
        errors.push(
          `Forbidden dependency "${depName}" in packages/angular: ${rule.reason}`,
        );
      }
    }
  }

  if (libPkg.peerDependencies && libPkg.dependencies) {
    for (const peerDep of Object.keys(libPkg.peerDependencies)) {
      if (libPkg.dependencies[peerDep]) {
        warnings.push(
          `"${peerDep}" is listed as both dependency and peerDependency in packages/angular/package.json`,
        );
      }
    }
  }
} else {
  warnings.push(
    'packages/angular/package.json not found — dependency validation partially skipped',
  );
}

if (fileExists('package.json')) {
  const rootPkg = readJson('package.json');
  const rootDeps = {
    ...(rootPkg.dependencies || {}),
    ...(rootPkg.devDependencies || {}),
  };
  const heavyDevDeps = ['tailwindcss', 'postcss', 'autoprefixer'];
  for (const dep of heavyDevDeps) {
    if (rootDeps[dep]) {
      warnings.push(
        `"${dep}" found in root dependencies — verify it is needed and justified per dependency policy`,
      );
    }
  }
}

const result = printSummary('Dependencies Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
