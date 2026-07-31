import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { init, type InitOptions } from '../init/index';
import { getGlobalStylesPath } from '../init/styles';
import { getProject } from '../init/workspace';
import { logChange, logSkip } from '../init/messages';

interface NgAddOptions {
  project?: string;
  colorScheme?: 'light' | 'dark' | 'system';
  density?: 'comfortable' | 'compact';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  reducedMotion?: 'auto' | 'reduce' | 'no-preference';
}

const COMPONENT_STYLES = [
  'button',
  'icon-button',
  'input',
  'textarea',
  'popover',
  'tooltip',
  'toast',
  'dropdown-menu',
];

function removeOldComponentImports(content: string): string {
  const lines = content.split('\n');
  const kept: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Remove @use of individual component stylesheets
    const componentMatch = trimmed.match(
      /^@use\s+['"]@educarehq\/solaris-ui\/styles\/(\w+)['"]\s*;?\s*$/,
    );
    if (componentMatch && COMPONENT_STYLES.includes(componentMatch[1])) {
      continue;
    }

    // Remove @use of the old _components shortcut
    if (
      /^@use\s+['"]@educarehq\/solaris-ui\/styles\/components['"]\s*;?\s*$/.test(
        trimmed,
      )
    ) {
      continue;
    }

    kept.push(line);
  }

  return kept.join('\n');
}

function cleanLegacyStyleImports(
  tree: Tree,
  context: SchematicContext,
  projectRoot: string,
): void {
  const stylesPath = getGlobalStylesPath(tree, projectRoot);
  if (!stylesPath) {
    return;
  }

  const content = tree.readText(stylesPath);
  const cleaned = removeOldComponentImports(content);

  if (cleaned !== content) {
    tree.overwrite(stylesPath, cleaned);
    logChange(
      context,
      `Removed legacy Solaris style imports from ${stylesPath}`,
    );
  } else {
    logSkip(context, `No legacy Solaris style imports in ${stylesPath}`);
  }
}

export function ngAdd(options: NgAddOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProject(tree, options.project);

    // Clean up legacy individual component style imports before delegating.
    cleanLegacyStyleImports(tree, context, project.root);

    const initOptions: InitOptions = {
      project: project.name,
      colorScheme: options.colorScheme,
      density: options.density,
      radius: options.radius,
      reducedMotion: options.reducedMotion,
    };

    const initRule = init(initOptions);
    return initRule(tree, context);
  };
}
