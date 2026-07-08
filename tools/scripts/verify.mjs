import { printSummary, readJson } from './shared.mjs';
import { execSync } from 'node:child_process';

const errors = [];
const warnings = [];

function runCommand(label, command, required = false) {
  console.log(`\n▶ Running ${label}...`);
  try {
    execSync(command, { stdio: 'inherit', shell: true, timeout: 120000 });
    console.log(`  ✓ ${label} passed`);
    return true;
  } catch (e) {
    const status = e.status !== null ? `exit code ${e.status}` : 'timed out';
    if (required) {
      errors.push(`${label} failed (${status})`);
      console.log(`  ✗ ${label} FAILED`);
    } else {
      warnings.push(`${label} not available (${status}) — skipped`);
      console.log(`  ⚠ ${label} skipped`);
    }
    return false;
  }
}

function runTooling(label) {
  const pkg = readJson('package.json');
  const scripts = pkg.scripts || {};
  const exists = !!scripts[label];

  if (!exists) {
    warnings.push(`${label} is not configured in package.json — skipped`);
    console.log(`\n▶ Running ${label}...`);
    console.log(`  ⚠ ${label} not configured — skipped`);
    return false;
  }

  console.log(`\n▶ Running ${label}...`);
  try {
    execSync(`pnpm ${label}`, {
      stdio: 'inherit',
      shell: true,
      timeout: 120000,
    });
    console.log(`  ✓ ${label} passed`);
    return true;
  } catch (e) {
    errors.push(`${label} failed (exit code ${e.status})`);
    console.log(`  ✗ ${label} FAILED`);
    return false;
  }
}

console.log('\n═══════════════════════════════════════');
console.log('  Solaris UI — Full Verification');
console.log('═══════════════════════════════════════');

runCommand('pnpm run doctor', 'node tools/scripts/doctor.mjs', true);

console.log('\n--- Check Suite ---');
runCommand(
  'pnpm check',
  'node tools/scripts/check-workspace.mjs && node tools/scripts/check-package-manager.mjs && node tools/scripts/check-scripts.mjs && node tools/scripts/check-architecture.mjs && node tools/scripts/check-docs.mjs && node tools/scripts/check-security.mjs',
  true,
);

console.log('\n--- Extended Checks ---');
runCommand('check:tokens', 'node tools/scripts/check-tokens.mjs', false);
runCommand('check:i18n', 'node tools/scripts/check-i18n.mjs', false);
runCommand(
  'check:dependencies',
  'node tools/scripts/check-dependencies.mjs',
  false,
);

console.log('\n--- Tooling ---');
runTooling('format:check');
runTooling('lint');
runTooling('typecheck');
runTooling('test');
runTooling('build');

console.log('\n═══════════════════════════════════════');
const result = printSummary('Verification Complete', errors, warnings);

if (errors.length > 0) {
  console.log('\n  ❌ Verification failed — review errors above');
} else {
  console.log('\n  ✅ Verification passed');
}

process.exitCode = result.errorCount > 0 ? 1 : 0;
