import type { Tree } from '@angular-devkit/schematics';

export interface SolarisProviderOptions {
  colorScheme?: 'light' | 'dark' | 'system';
  density?: 'comfortable' | 'compact';
  reducedMotion?: 'auto' | 'reduce' | 'no-preference';
  defaultLocale?: string;
  fallbackLocale?: string;
  useBrowserLocale?: boolean;
}

const APP_CONFIG_CANDIDATES = ['src/app/app.config.ts', 'src/app.config.ts'];

export function getAppConfigPath(
  tree: Tree,
  projectRoot: string,
): string | null {
  for (const candidate of APP_CONFIG_CANDIDATES) {
    const full = projectRoot ? `${projectRoot}/${candidate}` : candidate;
    if (tree.exists(full)) {
      return full;
    }
  }
  return null;
}

function quote(value: string): string {
  return `'${value}'`;
}

function buildThemeEntry(options: SolarisProviderOptions): string | null {
  const themeEntries: string[] = [];

  if (options.colorScheme && options.colorScheme !== 'system') {
    themeEntries.push(`colorScheme: ${quote(options.colorScheme)}`);
  }
  if (options.density && options.density !== 'comfortable') {
    themeEntries.push(`density: ${quote(options.density)}`);
  }
  if (options.reducedMotion && options.reducedMotion !== 'auto') {
    themeEntries.push(`reducedMotion: ${quote(options.reducedMotion)}`);
  }

  if (themeEntries.length === 0) {
    return null;
  }

  const indented = themeEntries.map((e) => `      ${e}`).join(',\n');
  return `    theme: {\n${indented},\n    }`;
}

export function buildProviderConfig(options: SolarisProviderOptions): string {
  const themeEntry = buildThemeEntry(options);
  const topEntries = themeEntry ? [themeEntry] : [];

  if (topEntries.length === 0) {
    return 'provideSolaris(),';
  }

  const indented = topEntries.map((e) => `  ${e}`).join(',\n');
  return `provideSolaris({\n${indented},\n  }),`;
}

export function addProvideSolarisImport(
  content: string,
  importStatement: string,
): string {
  if (content.includes(importStatement)) {
    return content;
  }

  const importRegex = /^import\s/gm;
  const matches = [...content.matchAll(importRegex)];
  if (matches.length === 0) {
    return `${importStatement}\n\n${content}`;
  }

  const lastImport = matches[matches.length - 1];
  const lastImportIndex = lastImport.index;
  if (lastImportIndex === undefined) {
    return `${importStatement}\n\n${content}`;
  }
  const importEnd = content.indexOf(';', lastImportIndex) + 1;
  return `${content.slice(0, importEnd)}\n${importStatement}${content.slice(importEnd)}`;
}

export function addProvideSolarisToProviders(
  content: string,
  providerEntry: string,
): string {
  if (/provideSolaris\s*\(/.test(content)) {
    return content;
  }

  const providersMatch = content.match(/providers:\s*\[([\s\S]*?)\]/);
  if (providersMatch) {
    const providersContent = providersMatch[1];
    const entry =
      providersContent.trim().length === 0
        ? `\n    ${providerEntry}\n  `
        : `${providersContent}\n    ${providerEntry}`;
    return content.replace(providersMatch[0], `providers: [${entry}]`);
  }

  return content;
}

export function updateAppConfig(
  tree: Tree,
  appConfigPath: string,
  options: SolarisProviderOptions,
): boolean {
  const existingContent = tree.readText(appConfigPath);

  if (/provideSolaris\s*\(/.test(existingContent)) {
    return false;
  }

  const importStatement = `import { provideSolaris } from '@educarehq/solaris-ui';`;
  const providerEntry = buildProviderConfig(options);

  let updated = addProvideSolarisImport(existingContent, importStatement);
  updated = addProvideSolarisToProviders(updated, providerEntry);

  tree.overwrite(appConfigPath, updated);
  return true;
}
