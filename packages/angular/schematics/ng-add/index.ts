import type { Rule, Tree } from '@angular-devkit/schematics';
import { SchematicsException } from '@angular-devkit/schematics';

interface NgAddOptions {
  project?: string;
  colorScheme?: 'light' | 'dark' | 'system';
  density?: 'comfortable' | 'compact';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
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

function getProjectTargetPath(tree: Tree, projectName: string): string {
  const workspace = tree.read('angular.json');
  if (!workspace) {
    throw new SchematicsException('angular.json not found');
  }

  const workspaceJson = JSON.parse(workspace.toString());
  const project = workspaceJson.projects?.[projectName];

  if (!project) {
    throw new SchematicsException(
      `Project "${projectName}" not found in angular.json`,
    );
  }

  return project.root ?? '';
}

function getStylesPath(tree: Tree, projectRoot: string): string | null {
  const candidates = [
    `${projectRoot}/src/styles.scss`,
    `${projectRoot}/src/styles.sass`,
    `${projectRoot}/src/styles.css`,
    `${projectRoot}/src/style.scss`,
    `${projectRoot}/src/style.sass`,
    `${projectRoot}/src/style.css`,
  ];

  for (const candidate of candidates) {
    if (tree.exists(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getAppConfigPath(tree: Tree, projectRoot: string): string | null {
  const candidates = [
    `${projectRoot}/src/app/app.config.ts`,
    `${projectRoot}/src/app/app.config.ts`,
  ];

  for (const candidate of candidates) {
    if (tree.exists(candidate)) {
      return candidate;
    }
  }

  return null;
}

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

function hasSolarisCoreImport(content: string): boolean {
  return /@use\s+['"]@educarehq\/solaris-ui\/styles['"]/.test(content);
}

function hasSolarisThemeMixin(content: string): boolean {
  return /@include\s+solaris\.theme\s*\(/.test(content);
}

export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree) => {
    const projectName = options.project ?? 'default';
    const projectRoot = getProjectTargetPath(tree, projectName);

    // --- Update styles.scss ---
    const stylesPath = getStylesPath(tree, projectRoot);
    if (stylesPath) {
      let content = tree.readText(stylesPath);

      // 1. Remove old individual component @use statements
      content = removeOldComponentImports(content);

      // 2. Add the unified @use if not present
      if (!hasSolarisCoreImport(content)) {
        content = [
          `@use '@educarehq/solaris-ui/styles' as solaris;`,
          '',
          content,
        ].join('\n');
      }

      // 3. Add @include mixins if not present
      if (!hasSolarisThemeMixin(content)) {
        const mixinBlock = [
          `@include solaris.core((root-font-size: rem-10));`,
          `@include solaris.theme((`,
          `  color-scheme: ${options.colorScheme ?? 'system'},`,
          `  density: ${options.density ?? 'comfortable'},`,
          `  radius: ${options.radius ?? 'md'},`,
          `));`,
        ].join('\n');

        content += `\n${mixinBlock}\n`;
      }

      tree.overwrite(stylesPath, content);
    }

    // --- Update app.config.ts ---
    const appConfigPath = getAppConfigPath(tree, projectRoot);
    if (appConfigPath) {
      const existingContent = tree.readText(appConfigPath);
      const hasSolarisProviders = existingContent.includes(
        'provideSolarisTheme',
      );

      if (!hasSolarisProviders) {
        const importStatement = [
          `import {`,
          `  provideSolarisTheme,`,
          `  provideSolarisTranslate,`,
          `  provideSolarisAccessibility,`,
          `  provideSolarisIcons,`,
          `  provideSolarisDialog,`,
          `  provideSolarisToast,`,
          `} from '@educarehq/solaris-ui';`,
        ].join('\n');

        const providersArray = [
          `provideSolarisTheme(),`,
          `provideSolarisTranslate(),`,
          `provideSolarisAccessibility(),`,
          `provideSolarisIcons(),`,
          `provideSolarisDialog(),`,
          `provideSolarisToast(),`,
        ].join('\n    ');

        let updated = existingContent;

        // Add import if not present
        if (!existingContent.includes('provideSolarisTheme')) {
          const importRegex = /^import\s/gm;
          const matches = [...updated.matchAll(importRegex)];
          if (matches.length > 0) {
            const lastImport = matches[matches.length - 1];
            const importEnd = updated.indexOf(';', lastImport.index!) + 1;
            updated = `${updated.slice(0, importEnd)}\n${importStatement}${updated.slice(importEnd)}`;
          }
        }

        // Add providers if not present
        if (!updated.includes('provideSolarisTheme')) {
          const providersMatch = updated.match(/providers:\s*\[([\s\S]*?)\]/);
          if (providersMatch) {
            const providersContent = providersMatch[1];
            updated = updated.replace(
              providersMatch[0],
              `providers: [${providersContent}\n    ${providersArray}]`,
            );
          }
        }

        tree.overwrite(appConfigPath, updated);
      }
    }

    return tree;
  };
}
