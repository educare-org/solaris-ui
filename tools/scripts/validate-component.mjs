#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_BASE = join(
  __dirname,
  '..',
  '..',
  'packages',
  'angular',
  'src',
  'lib',
  'components',
);
const CATEGORIES = [
  'actions',
  'forms',
  'feedback',
  'overlay',
  'navigation',
  'data-display',
];

const errors = [];
const warnings = [];

function checkFile(dir, name) {
  const path = join(dir, name);
  if (!existsSync(path)) {
    errors.push(`Missing: ${name}`);
    return false;
  }
  return true;
}

function checkContent(filePath, pattern, message) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, 'utf-8');
  if (pattern.test(content)) {
    errors.push(`${filePath.split(/[/\\]/).pop()}: ${message}`);
  }
}

function validateComponent(compDir) {
  const name = compDir.split(/[/\\]/).pop();
  const parts = name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  const pascal = parts.join('');

  console.log(`\n  Validating: ${name}`);

  // Directory structure
  const hasComponent = existsSync(join(compDir, 'component'));
  const hasModel = existsSync(join(compDir, 'model'));
  const hasTesting = existsSync(join(compDir, 'testing'));
  const hasDocs = existsSync(join(compDir, 'docs'));
  const hasIndex = existsSync(join(compDir, 'index.ts'));

  if (!hasComponent) warnings.push(`${name}: missing component/ directory`);
  if (!hasModel) warnings.push(`${name}: missing model/ directory`);
  if (!hasTesting) errors.push(`${name}: missing testing/ directory`);
  if (!hasDocs) errors.push(`${name}: missing docs/ directory`);
  if (!hasIndex) errors.push(`${name}: missing index.ts`);

  // Component files
  if (hasComponent) {
    const compDirPath = join(compDir, 'component');
    const tsFiles = readdirSync(compDirPath).filter(
      (f) =>
        f.endsWith('.ts') && !f.includes('.spec.') && !f.includes('.stories.'),
    );

    for (const tsFile of tsFiles) {
      const filePath = join(compDirPath, tsFile);
      const content = readFileSync(filePath, 'utf-8');

      // Check for NgModule
      if (content.includes('NgModule')) {
        errors.push(`${tsFile}: contains NgModule (must be standalone)`);
      }

      // Check for @Input decorator
      if (/@Input\(\)/.test(content)) {
        errors.push(
          `${tsFile}: uses @Input() decorator (use input() signal instead)`,
        );
      }

      // Check for @Output decorator
      if (/@Output\(\)/.test(content)) {
        errors.push(
          `${tsFile}: uses @Output() decorator (use output() signal instead)`,
        );
      }

      // Check for inline template
      if (
        /template:\s*['`]/.test(content) &&
        !content.includes('templateUrl')
      ) {
        errors.push(
          `${tsFile}: uses inline template (use templateUrl instead)`,
        );
      }

      // Check for inline styles
      if (/styles:\s*\[?['`]/.test(content)) {
        errors.push(`${tsFile}: uses inline styles (use styleUrls instead)`);
      }

      // Check for raw color values
      if (/#[0-9a-fA-F]{3,8}/.test(content) || /rgba?\(/.test(content)) {
        warnings.push(
          `${tsFile}: contains raw color values (use --solaris-* tokens)`,
        );
      }
    }
  }

  // Spec files
  if (hasTesting) {
    const specFiles = readdirSync(join(compDir, 'testing')).filter((f) =>
      f.endsWith('.spec.ts'),
    );
    if (specFiles.length === 0) {
      errors.push(`${name}: no spec files found`);
    }
  }

  // Docs
  if (hasDocs) {
    const docFiles = readdirSync(join(compDir, 'docs')).filter((f) =>
      f.endsWith('.md'),
    );
    if (docFiles.length === 0) {
      warnings.push(`${name}: no doc files found`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const target = args[0];

  console.log('Solaris UI — Component Validation');

  if (target) {
    const dir = join(COMPONENTS_BASE, target.replace(/[/\\]/g, '/'));
    if (!existsSync(dir)) {
      console.error(`  ❌ Component not found: ${target}`);
      process.exit(1);
    }
    validateComponent(dir);
  } else {
    // Validate all components
    for (const category of CATEGORIES) {
      const catDir = join(COMPONENTS_BASE, category);
      if (!existsSync(catDir)) continue;
      const components = readdirSync(catDir);
      for (const comp of components) {
        const compDir = join(catDir, comp);
        if (
          existsSync(join(compDir, 'component')) ||
          existsSync(join(compDir, 'index.ts'))
        ) {
          validateComponent(compDir);
        }
      }
    }
  }

  console.log('\n═══════════════════════════════════════');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✅ All components pass validation');
  } else {
    if (errors.length > 0) {
      console.log(`  ❌ ${errors.length} error(s):`);
      errors.forEach((e) => console.log(`     - ${e}`));
    }
    if (warnings.length > 0) {
      console.log(`  ⚠ ${warnings.length} warning(s):`);
      warnings.forEach((w) => console.log(`     - ${w}`));
    }
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
