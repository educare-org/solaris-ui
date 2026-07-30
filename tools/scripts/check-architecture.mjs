import path from 'node:path';
import fs from 'node:fs';
import {
  workspaceRoot,
  fileExists,
  readFileSafe,
  printSummary,
} from './shared.mjs';

const configPath = path.join(
  workspaceRoot,
  'tools',
  'config',
  'architecture-rules.json',
);
const rules = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const errors = [];
const warnings = [];

const libBase = 'packages/angular/src/lib';

if (!fileExists(libBase)) {
  warnings.push(
    `${libBase} does not exist yet — architecture rules partially skipped (expected during early setup).`,
  );
  const result = printSummary('Architecture Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
} else {
  for (const forbiddenPath of rules.forbiddenInternalPaths) {
    if (fileExists(forbiddenPath)) {
      errors.push(
        `Forbidden folder found: ${forbiddenPath}. The "shared" folder is not allowed. Use a clear architectural name like "core", "theme", "i18n", "a11y", or "primitives".`,
      );
    }
  }

  for (const expectedPath of rules.libStructure) {
    if (!fileExists(expectedPath)) {
      warnings.push(
        `Expected lib folder not yet created: ${expectedPath} (expected in future releases)`,
      );
    }
  }

  for (const rule of rules.forbiddenImports) {
    const fromPath = rule.from;
    if (!fileExists(fromPath)) continue;

    const fromFiles = [];
    function walk(dir) {
      const resolved = path.join(workspaceRoot, dir);
      let entries;
      try {
        entries = fs.readdirSync(resolved, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (
          /\.(ts|html)$/.test(entry.name) &&
          !entry.name.endsWith('.spec.ts') &&
          !entry.name.endsWith('.test.ts')
        ) {
          fromFiles.push(fullPath);
        }
      }
    }
    walk(fromPath);

    for (const file of fromFiles) {
      const content = readFileSafe(file);
      for (const forbiddenImport of rule.mustNotImport) {
        const importPattern = forbiddenImport
          .replace(/\\/g, '/')
          .replace('packages/angular/src/lib/', '');
        const lines = content.split('\n');
        const hasViolation = lines.some(
          (line) =>
            (line.includes('from ') ||
              line.includes('import ') ||
              line.includes('require(')) &&
            (line.includes(importPattern) ||
              line.includes(`@solaris-ui/angular/${importPattern}`)),
        );
        if (hasViolation) {
          errors.push(
            `File ${file} imports from ${forbiddenImport}. ${rule.reason}`,
          );
        }
      }
    }
  }

  const showcaseRule = rules.forbiddenLibImportFromShowcase;
  if (showcaseRule && fileExists(showcaseRule.from)) {
    const showcaseFiles = [];
    function walkShowcase(dir) {
      const resolved = path.join(workspaceRoot, dir);
      let entries;
      try {
        entries = fs.readdirSync(resolved, { withFileTypes: true });
      } catch {
        return;
      }
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('node_modules') && !entry.name.startsWith('.')) {
            walkShowcase(fullPath);
          }
        } else if (
          /\.(ts|html)$/.test(entry.name) &&
          !entry.name.endsWith('.spec.ts') &&
          !entry.name.endsWith('.test.ts')
        ) {
          showcaseFiles.push(fullPath);
        }
      }
    }
    walkShowcase(showcaseRule.from);

    for (const file of showcaseFiles) {
      const content = readFileSafe(file);
      const lines = content.split('\n');
      const hasViolation = lines.some(
        (line) =>
          (line.includes('from ') || line.includes('import ') || line.includes('require(')) &&
          showcaseRule.mustNotImport.some((p) => line.includes(p)),
      );
      if (hasViolation) {
        errors.push(`File ${file} — ${showcaseRule.reason}`);
      }
    }
  }

  const result = printSummary('Architecture Check', errors, warnings);
  process.exitCode = result.errorCount > 0 ? 1 : 0;
}
