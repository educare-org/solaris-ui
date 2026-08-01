#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';
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
  'interaction',
  'icon',
];

const REQUIRED_DOC_SECTIONS = ['Purpose', 'API', 'Accessibility', 'Examples'];

const VARIANT_HEADING =
  /^##+ .*(appearance|color|size|density|radius|orientation|variant|shape|position).*/i;
const CSS_HEADING = /^##+ .*(css|custom|customiz|styling|variables).*/i;

const errors = [];
const warnings = [];

function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, ext, out);
    } else if (entry.endsWith(ext)) {
      out.push(full);
    }
  }
  return out;
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

  console.log(`\n  Validating: ${name}`);

  // Directory structure
  const hasSourceDir = ['component', 'directives', 'components'].some((d) =>
    existsSync(join(compDir, d)),
  );
  const hasModel = walk(compDir, '.ts').some((f) =>
    f.includes(`${sep}model${sep}`),
  );
  const hasDocs = existsSync(join(compDir, 'docs'));
  const hasIndex = existsSync(join(compDir, 'index.ts'));

  if (!hasSourceDir)
    warnings.push(
      `${name}: missing component/ (or directives/ or components/) directory`,
    );
  if (!hasModel) warnings.push(`${name}: missing model/ directory`);
  if (!hasDocs) errors.push(`${name}: missing docs/ directory`);
  if (!hasIndex) errors.push(`${name}: missing index.ts`);

  // Component files
  if (hasSourceDir) {
    const tsFiles = walk(compDir, '.ts').filter(
      (f) => !f.includes('.spec.') && !f.includes('.stories.'),
    );

    for (const filePath of tsFiles) {
      const tsFile = filePath.split(/[/\\]/).pop();
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
      const isPassthroughTemplate =
        /template:\s*['`]\s*(<ng-template[^>]*>\s*)?<ng-content\s*\/?>\s*(<\/ng-template>)?\s*['`]/.test(
          content,
        );
      const isEmptyTemplate = /template:\s*['`]\s*['`]/.test(content);
      if (
        /template:\s*['`]/.test(content) &&
        !content.includes('templateUrl') &&
        !isPassthroughTemplate &&
        !isEmptyTemplate
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
  const specFiles = walk(compDir, '.spec.ts');
  if (specFiles.length === 0) {
    errors.push(`${name}: no spec files found`);
  }

  // Docs
  if (hasDocs) {
    validateDocs(compDir, name);
  }
}

function validateDocs(compDir, name) {
  const docDir = join(compDir, 'docs');
  const docFiles = readdirSync(docDir).filter((f) => f.endsWith('.md'));
  if (docFiles.length === 0) {
    warnings.push(`${name}: no doc files found`);
    return;
  }

  const scssFiles = walk(compDir, '.scss');
  const scssText = scssFiles.map((f) => readFileSync(f, 'utf-8')).join('\n');
  const hasTokens = /--solaris-[a-z0-9-]+/.test(scssText);

  const tsAndTypes = walk(compDir, '.ts')
    .filter((f) => !f.includes('.spec.') && !f.includes('.stories.'))
    .map((f) => readFileSync(f, 'utf-8'))
    .join('\n');
  const hasVariants =
    /Solaris\w*(Appearance|Color|Size|Radius|Density|Orientation|Variant|Shape|Position)\b/.test(
      tsAndTypes,
    );

  for (const docFile of docFiles) {
    const filePath = join(docDir, docFile);
    const content = readFileSync(filePath, 'utf-8');
    const headings = [...content.matchAll(/^##+ .+$/gm)].map((m) => m[0]);

    for (const section of REQUIRED_DOC_SECTIONS) {
      if (!new RegExp(`^## ${section}$`, 'm').test(content)) {
        errors.push(`${docFile}: missing required section "## ${section}"`);
      }
    }

    const hasCssSection = headings.some((h) => CSS_HEADING.test(h));
    if (hasTokens && !hasCssSection) {
      warnings.push(
        `${docFile}: component defines --solaris-* tokens but doc has no CSS Variables section`,
      );
    }

    const hasVariantSection = headings.some((h) => VARIANT_HEADING.test(h));
    if (hasVariants && !hasVariantSection) {
      warnings.push(
        `${docFile}: component exposes variant inputs but doc has no visual variants section`,
      );
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

      // A category may itself be a component unit (e.g. icon has component/
      // and index.ts at the category root) rather than containing subfolders.
      if (
        existsSync(join(catDir, 'component')) ||
        existsSync(join(catDir, 'index.ts'))
      ) {
        validateComponent(catDir);
        continue;
      }

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
