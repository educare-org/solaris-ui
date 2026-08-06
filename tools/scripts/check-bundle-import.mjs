import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { workspaceRoot, fileExists, printSummary } from './shared.mjs';

const errors = [];
const warnings = [];

const distDir = path.join(workspaceRoot, 'dist/packages/angular');
const bundleFile = path.join(distDir, 'fesm2022/educarehq-solaris-ui.mjs');

if (!fileExists(bundleFile)) {
  warnings.push(
    'dist/packages/angular/fesm2022/educarehq-solaris-ui.mjs not found. Run "pnpm build:lib" first.',
  );
  const result = printSummary('Bundle Import Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
} else {
  try {
    await import('@angular/compiler');
    const mod = await import(pathToFileURL(bundleFile).href);

    const requiredExports = [
      'SolarisAccordionComponent',
      'SolarisCollapsibleComponent',
    ];
    for (const name of requiredExports) {
      if (typeof mod[name] !== 'function') {
        errors.push(
          `Expected export "${name}" to be a class after bundle evaluation.`,
        );
      }
    }

    if (errors.length === 0) {
      console.log('  ✓ Bundle evaluated without temporal-dead-zone errors');
      console.log(`  ✓ Exports verified: ${requiredExports.join(', ')}`);
    }
  } catch (e) {
    errors.push(
      `Bundle evaluation failed — a class is likely referenced before initialization.`,
    );
    errors.push(`  → ${e.name}: ${e.message}`);
    if (e.stack) {
      errors.push(
        `  → First stack frame: ${String(e.stack).split('\n')[1]?.trim() ?? '(none)'}`,
      );
    }
  }

  const result = printSummary('Bundle Import Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
}
