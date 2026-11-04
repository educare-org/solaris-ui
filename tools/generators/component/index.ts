import { formatFiles, generateFiles, type Tree } from '@nx/devkit';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { ComponentGeneratorSchema } from './schema';

const generatorDir = path.dirname(fileURLToPath(import.meta.url));

const CATEGORIES = [
  'actions',
  'forms',
  'feedback',
  'overlay',
  'navigation',
  'data-display',
  'interaction',
  'icon',
  'scheduling',
];

function toKebab(name: string): string {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

function toPascal(name: string): string {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export default async function componentGenerator(
  tree: Tree,
  options: ComponentGeneratorSchema,
) {
  const name = toKebab(options.name);
  const pascalName = toPascal(name);
  const category = options.category || 'actions';
  if (!CATEGORIES.includes(category)) {
    throw new Error(
      `Invalid category "${category}". Valid: ${CATEGORIES.join(', ')}`,
    );
  }
  const target = `packages/angular/src/lib/components/${category}/${name}`;
  if (tree.exists(`${target}/index.ts`)) {
    throw new Error(`Component already exists: ${target}`);
  }
  generateFiles(tree, path.join(generatorDir, 'files'), target, {
    name,
    pascalName,
    category,
    tmpl: '',
  });
  tree.write(
    `.changeset/${name}-${Date.now()}.md`,
    `---\n'@educarehq/solaris-ui': minor\n---\n\nfeature(${category}): add ${name} component\n\nGenerated scaffold for the ${name} component.\n`,
  );
  await formatFiles(tree);
}
