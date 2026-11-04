import {
  fileExists,
  readJson,
  printSummary,
  findForbiddenLockfiles,
  lockfileErrorMessage,
  packageManagerFieldErrors,
} from './shared.mjs';

const errors = [];
const warnings = [];

for (const lock of findForbiddenLockfiles()) {
  errors.push(lockfileErrorMessage(lock));
}

if (!fileExists('pnpm-lock.yaml')) {
  warnings.push('Missing pnpm-lock.yaml — run pnpm install to generate it');
}

if (!fileExists('package.json')) {
  errors.push('Missing package.json at workspace root');
} else {
  errors.push(...packageManagerFieldErrors(readJson('package.json')));
}

const result = printSummary('Package Manager Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
