import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { workspaceRoot } from './shared.mjs';

const args = process.argv.slice(2);

function flagValue(name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const base = flagValue('--base');
const skip = new Set(
  (flagValue('--skip') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

const nodeSteps = [
  'check-workspace',
  'check-package-manager',
  'check-scripts',
  'check-architecture',
  'check-docs',
  'check-security',
  'check-dependencies',
  'check-tokens',
  'check-token-references',
  'check-i18n',
  'check-translation',
];

const changesetArgs = base ? ['--base', base] : [];
const pnpmSteps = ['lint:scss', 'lint', 'typecheck'];

let failed = false;

function runNode(script, scriptArgs = []) {
  const scriptPath = path.join(
    workspaceRoot,
    'tools',
    'scripts',
    `${script}.mjs`,
  );
  console.log(`\n▶ ${script}`);
  try {
    execFileSync(process.execPath, [scriptPath, ...scriptArgs], {
      stdio: 'inherit',
      cwd: workspaceRoot,
      timeout: 300000,
    });
  } catch {
    failed = true;
  }
}

function runPnpm(script) {
  console.log(`\n▶ pnpm ${script}`);
  try {
    execFileSync('pnpm', [script], {
      stdio: 'inherit',
      cwd: workspaceRoot,
      shell: true,
      timeout: 300000,
    });
  } catch {
    failed = true;
  }
}

for (const step of nodeSteps) {
  if (skip.has(step)) continue;
  runNode(step);
}

if (!skip.has('check-changeset')) {
  runNode('check-changeset', changesetArgs);
}

if (!skip.has('check-vulnerabilities')) {
  runNode('check-vulnerabilities');
}

for (const step of pnpmSteps) {
  if (skip.has(step)) continue;
  runPnpm(step);
}

if (!skip.has('validate-component')) {
  runNode('validate-component');
}

if (failed) {
  console.log('\n  ❌ Checks failed — review errors above');
  process.exitCode = 1;
} else {
  console.log('\n  ✅ All checks passed');
}
