import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readJson,
  printSummary,
  findForbiddenLockfiles,
  lockfileErrorMessage,
} from './shared.mjs';

const errors = [];
const warnings = [];

for (const lock of findForbiddenLockfiles()) {
  errors.push(lockfileErrorMessage(lock));
}

const rulesPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'dependency-rules.json',
);
const depRules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));

if (fileExists('packages/angular/package.json')) {
  const libPkg = readJson('packages/angular/package.json');

  const deps = {
    ...(libPkg.dependencies || {}),
    ...(libPkg.peerDependencies || {}),
  };

  for (const [depName] of Object.entries(deps)) {
    for (const rule of depRules.forbiddenLibDeps) {
      if (new RegExp(rule.pattern).test(depName)) {
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
  for (const dep of depRules.heavyRootDeps) {
    if (rootDeps[dep]) {
      warnings.push(
        `"${dep}" found in root dependencies — verify it is needed and justified per dependency policy`,
      );
    }
  }
}

const result = printSummary('Dependencies Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
