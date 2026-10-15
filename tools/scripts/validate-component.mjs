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

function baseName(filePath) {
  return filePath.split(/[/\\]/).pop();
}

function extractInlineTemplate(content) {
  const idx = content.indexOf('template:');
  if (idx === -1) return null;
  const rest = content.slice(idx + 'template:'.length).trimStart();
  const quote = rest[0];
  if (quote !== "'" && quote !== '"' && quote !== '`') return null;
  const end = rest.indexOf(quote, 1);
  if (end === -1) return null;
  return rest.slice(1, end).trim();
}

const NG_CONTENT_SHAPES = new Set([
  '<ng-content/>',
  '<ng-content>',
  '<ng-content></ng-content>',
]);

function isPassthroughBody(body) {
  const compact = body.replace(/\s+/g, '');
  if (NG_CONTENT_SHAPES.has(compact)) return true;
  if (
    !compact.startsWith('<ng-template') ||
    !compact.endsWith('</ng-template>')
  ) {
    return false;
  }
  const openEnd = compact.indexOf('>');
  if (openEnd === -1) return false;
  const inner = compact.slice(
    openEnd + 1,
    compact.length - '</ng-template>'.length,
  );
  return NG_CONTENT_SHAPES.has(inner);
}

function checkStructure(compDir, name) {
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

  return { hasSourceDir, hasDocs };
}

function checkInlineTemplate(tsFile, content) {
  if (content.includes('templateUrl')) return;
  const body = extractInlineTemplate(content);
  if (body === null || body === '') return;
  if (!isPassthroughBody(body)) {
    errors.push(`${tsFile}: uses inline template (use templateUrl instead)`);
  }
}

function checkRawColors(tsFile, content) {
  // Honors SOLARIS_TOKEN_EXCEPTION, e.g. Canvas2D colors that cannot read
  // CSS vars — see 03-standards-decision.
  const lines = content.split('\n');
  const hasUnexceptedColor = lines.some((line, i) => {
    if (!/#[0-9a-fA-F]{3,8}/.test(line) && !/rgba?\(/.test(line)) {
      return false;
    }
    return !lines
      .slice(Math.max(0, i - 3), i + 1)
      .some((l) => l.includes('SOLARIS_TOKEN_EXCEPTION'));
  });
  if (hasUnexceptedColor) {
    warnings.push(
      `${tsFile}: contains raw color values (use --solaris-* tokens)`,
    );
  }
}

function checkTsFile(filePath) {
  const tsFile = baseName(filePath);
  const content = readFileSync(filePath, 'utf-8');

  if (content.includes('NgModule')) {
    errors.push(`${tsFile}: contains NgModule (must be standalone)`);
  }

  if (/@Input\(\)/.test(content)) {
    errors.push(
      `${tsFile}: uses @Input() decorator (use input() signal instead)`,
    );
  }

  if (/@Output\(\)/.test(content)) {
    errors.push(
      `${tsFile}: uses @Output() decorator (use output() signal instead)`,
    );
  }

  checkInlineTemplate(tsFile, content);

  if (/styles:\s*\[?['`]/.test(content)) {
    errors.push(`${tsFile}: uses inline styles (use styleUrls instead)`);
  }

  checkRawColors(tsFile, content);
}

function validateComponent(compDir) {
  const name = baseName(compDir);

  console.log(`\n  Validating: ${name}`);

  const { hasSourceDir, hasDocs } = checkStructure(compDir, name);

  if (hasSourceDir) {
    const tsFiles = walk(compDir, '.ts').filter(
      (f) => !f.includes('.spec.') && !f.includes('.stories.'),
    );

    for (const filePath of tsFiles) {
      checkTsFile(filePath);
    }
  }

  const specFiles = walk(compDir, '.spec.ts');
  if (specFiles.length === 0) {
    errors.push(`${name}: no spec files found`);
  }

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

function validateTarget(target) {
  const dir = join(COMPONENTS_BASE, target.replace(/[/\\]/g, '/'));
  if (!existsSync(dir)) {
    console.error(`  ❌ Component not found: ${target}`);
    process.exit(1);
  }
  validateComponent(dir);
}

function isComponentDir(dir) {
  return (
    existsSync(join(dir, 'component')) || existsSync(join(dir, 'index.ts'))
  );
}

function validateCategory(catDir) {
  if (isComponentDir(catDir)) {
    validateComponent(catDir);
    return;
  }

  for (const comp of readdirSync(catDir)) {
    const compDir = join(catDir, comp);
    if (isComponentDir(compDir)) {
      validateComponent(compDir);
    }
  }
}

function printReport() {
  console.log('\n═══════════════════════════════════════');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✅ All components pass validation');
    return;
  }
  if (errors.length > 0) {
    console.log(`  ❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.log(`     - ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`  ⚠ ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`     - ${w}`));
  }
}

function main() {
  const target = process.argv.slice(2)[0];

  console.log('Solaris UI — Component Validation');

  if (target) {
    validateTarget(target);
  } else {
    for (const category of CATEGORIES) {
      const catDir = join(COMPONENTS_BASE, category);
      if (existsSync(catDir)) validateCategory(catDir);
    }
  }

  printReport();

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
