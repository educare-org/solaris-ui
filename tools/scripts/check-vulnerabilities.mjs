import { execSync } from 'node:child_process';
import { printSummary } from './shared.mjs';

const errors = [];
const warnings = [];

try {
  const result = execSync('pnpm audit --audit-level=high', {
    encoding: 'utf-8',
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  console.log('  ✓ No high or critical vulnerabilities found');
} catch (e) {
  const output = e.stdout || e.stderr || '';
  if (output.includes('No known vulnerabilities found')) {
    console.log('  ✓ No known vulnerabilities found');
  } else if (output.includes('HIGH') || output.includes('CRITICAL')) {
    errors.push('High or critical vulnerabilities found in dependencies.');
    errors.push('  → Run "pnpm audit" for details.');
    errors.push('  → Run "pnpm audit --fix" to attempt automatic fixes.');
    console.error(output);
  } else {
    warnings.push('Vulnerability audit produced warnings:');
    warnings.push(output.trim());
  }
}

const result = printSummary('Vulnerability Check', errors, warnings);
process.exitCode = result.errorCount > 0 ? 1 : 0;
