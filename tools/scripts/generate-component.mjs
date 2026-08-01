#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates', 'component');
const TARGET_BASE = join(
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

function toPascal(name) {
  return name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

function toKebab(name) {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

function replacePlaceholders(content, name, pascal) {
  return content.replace(/\$name\$/g, name).replace(/\$Name\$/g, pascal);
}

function generateChangeset(name, category) {
  const date = new Date().toISOString().split('T')[0];
  return {
    name: '@educarehq/solaris-ui',
    content: {
      minor: [`feature(${category}): add ${name} component`],
    },
    createdAt: date,
  };
}

function main() {
  const args = process.argv.slice(2);
  const name = args[0];
  const category = args[1] || 'actions';
  const type = args[2] || 'component';

  if (!name) {
    console.error(
      'Usage: node generate-component.mjs <component-name> [category] [component|directive]',
    );
    console.error(`  Categories: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  if (!CATEGORIES.includes(category)) {
    console.error(
      `Invalid category "${category}". Valid: ${CATEGORIES.join(', ')}`,
    );
    process.exit(1);
  }

  const kebabName = toKebab(name);
  const pascalName = toPascal(kebabName);
  const targetDir = join(TARGET_BASE, category, kebabName);

  if (existsSync(targetDir)) {
    console.error(`Component already exists: ${targetDir}`);
    process.exit(1);
  }

  console.log(`\nCreating ${type}: ${kebabName} (${category})`);
  console.log(`  Target: ${targetDir}\n`);

  // Create directory structure
  const dirs = ['component', 'model', 'testing', 'docs'];
  for (const dir of dirs) {
    mkdirSync(join(targetDir, dir), { recursive: true });
    console.log(`  📁 ${dir}/`);
  }

  // Copy and process templates
  const templateFiles = {
    'component.ts': `component/${kebabName}.component.ts`,
    'component.html': `component/${kebabName}.component.html`,
    'component.scss': `component/${kebabName}.component.scss`,
    'spec.ts': `testing/${kebabName}.component.spec.ts`,
    'doc.md': `docs/${kebabName}.md`,
    'types.ts': `model/${kebabName}.types.ts`,
  };

  for (const [tmpl, dest] of Object.entries(templateFiles)) {
    const src = join(TEMPLATES_DIR, tmpl);
    const dst = join(targetDir, dest);
    const content = readFileSync(src, 'utf-8');
    writeFileSync(
      dst,
      replacePlaceholders(content, kebabName, pascalName),
      'utf-8',
    );
    console.log(`  📄 ${dest}`);
  }

  // Create index.ts
  const indexContent = `export { Solaris${pascalName}Component } from './component/${kebabName}.component';
export type { Solaris${pascalName}Size, Solaris${pascalName}Config } from './model/${kebabName}.types';
`;
  writeFileSync(join(targetDir, 'index.ts'), indexContent, 'utf-8');
  console.log(`  📄 index.ts`);

  // Generate changeset
  const changeset = generateChangeset(kebabName, category);
  const changesetDir = join(__dirname, '..', '..', '.changeset');
  mkdirSync(changesetDir, { recursive: true });
  const changesetFile = join(changesetDir, `${kebabName}-${Date.now()}.md`);
  const changesetContent = `---
'@educarehq/solaris-ui': minor
---

feature(${category}): add ${kebabName} component

Generated scaffold for the ${kebabName} component.
`;
  writeFileSync(changesetFile, changesetContent, 'utf-8');
  console.log(`  📄 .changeset/${changesetFile.split(/[/\\]/).pop()}`);

  console.log(`\n✅ ${pascalName} scaffold created successfully.`);
  console.log(`\nNext steps:`);
  console.log(
    `  1. Implement the component logic in component/${kebabName}.component.ts`,
  );
  console.log(
    `  2. Style the component in component/${kebabName}.component.scss`,
  );
  console.log(`  3. Write tests in testing/${kebabName}.component.spec.ts`);
  console.log(`  4. Document in docs/${kebabName}.md`);
  console.log(`  5. Register in showcase app`);
}

main();
