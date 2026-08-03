import type { Tree } from '@angular-devkit/schematics';

export interface SolarisStyleOptions {
  colorScheme?: 'light' | 'dark' | 'system';
  density?: 'comfortable' | 'compact';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  motion?: 'auto' | 'reduce';
}

export const SOLARIS_STYLE_PATH = 'src/styles/solaris.scss';

const STYLE_CANDIDATES = [
  'src/styles.scss',
  'src/styles.sass',
  'src/styles.css',
  'src/style.scss',
  'src/style.sass',
  'src/style.css',
];

export function getGlobalStylesPath(
  tree: Tree,
  projectRoot: string,
): string | null {
  for (const candidate of STYLE_CANDIDATES) {
    const full = candidate;
    if (tree.exists(full)) {
      return full;
    }
  }

  for (const candidate of STYLE_CANDIDATES) {
    const full = projectRoot ? `${projectRoot}/${candidate}` : candidate;
    if (tree.exists(full)) {
      return full;
    }
  }

  return null;
}

export function getSolarisStyleContent(
  options: SolarisStyleOptions,
  usePath: string,
): string {
  const themeConfig = [
    `  color-scheme: ${options.colorScheme ?? 'system'},`,
    `  density: ${options.density ?? 'comfortable'},`,
    `  radius: ${options.radius ?? 'md'},`,
    `  motion: ${options.motion ?? 'auto'},`,
  ].join('\n');

  return `@use '${usePath}' as solaris;

@include solaris.core();

@include solaris.theme(
  (
${themeConfig}
  )
);
`;
}

export function createSolarisStyleFile(
  tree: Tree,
  projectRoot: string,
  options: SolarisStyleOptions,
  usePath = '@educarehq/solaris-ui/styles',
): string {
  const fullPath = projectRoot
    ? `${projectRoot}/${SOLARIS_STYLE_PATH}`
    : SOLARIS_STYLE_PATH;

  if (tree.exists(fullPath)) {
    return fullPath;
  }

  tree.create(fullPath, getSolarisStyleContent(options, usePath));
  return fullPath;
}

function importStatementFor(path: string): string {
  const relative = path
    .replace(/^src\//, './')
    .replace(/\.(scss|sass|css)$/, '');
  return `@use '${relative}';`;
}

export function importSolarisStyleFromGlobal(
  tree: Tree,
  globalStylesPath: string,
  solarisStylePath: string,
): boolean {
  const content = tree.readText(globalStylesPath);
  const importStatement = importStatementFor(solarisStylePath);

  if (content.includes(importStatement)) {
    return false;
  }

  const updated = `${importStatement}\n\n${content}`;
  tree.overwrite(globalStylesPath, updated);
  return true;
}
