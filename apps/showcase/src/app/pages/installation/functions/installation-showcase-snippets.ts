export type InstallationProvidersVariant = 'basic' | 'theme' | 'translate';

export interface InstallationShowcaseMarkdownSnippets {
  readonly schematicCode: string;
  readonly nxCode: string;
  readonly styleCode: string;
  readonly globalStyleCode: string;
  readonly basicProvidersCode: string;
  readonly themeProvidersCode: string;
  readonly translateProvidersCode: string;
  readonly translateCode: string;
  readonly verifyCode: string;
}

export function buildInstallationMarkdown(
  translate: (key: string) => string,
  snippets: InstallationShowcaseMarkdownSnippets,
): string {
  return [
    `# ${translate('installation.title')}`,
    '',
    translate('installation.description'),
    '',
    `## ${translate('installation.section.prerequisites')}`,
    '',
    translate('installation.prerequisites.note'),
    '',
    `- ${translate('installation.prerequisites.angular')}`,
    `- ${translate('installation.prerequisites.node')}`,
    `- ${translate('installation.prerequisites.peers')}`,
    '',
    `## ${translate('installation.section.install')}`,
    '',
    translate('installation.install.note'),
    '',
    '```sh',
    'pnpm add @educarehq/solaris-ui',
    '```',
    '',
    '```sh',
    snippets.schematicCode,
    '```',
    '',
    '```sh',
    snippets.nxCode,
    '```',
    '',
    `## ${translate('installation.section.styles')}`,
    '',
    translate('installation.styles.note'),
    '',
    '```scss',
    snippets.styleCode,
    '```',
    '',
    '```scss',
    snippets.globalStyleCode,
    '```',
    '',
    `## ${translate('installation.section.providers')}`,
    '',
    translate('installation.providers.note'),
    '',
    '```ts',
    snippets.basicProvidersCode,
    '```',
    '',
    '```ts',
    snippets.themeProvidersCode,
    '```',
    '',
    '```ts',
    snippets.translateProvidersCode,
    '```',
    '',
    `## ${translate('installation.section.language')}`,
    '',
    translate('installation.language.note'),
    '',
    '```ts',
    snippets.translateCode,
    '```',
    '',
    `## ${translate('installation.section.verify')}`,
    '',
    translate('installation.verify.note'),
    '',
    '```sh',
    snippets.verifyCode,
    '```',
    '',
    translate('installation.verify.success'),
    '',
  ].join('\n');
}

export function buildInstallationProvidersCode(
  variant: InstallationProvidersVariant,
): string {
  switch (variant) {
    case 'theme':
      return [
        "import { provideSolaris } from '@educarehq/solaris-ui';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [',
        '    provideSolaris({',
        '      theme: {',
        "        colorScheme: 'system',",
        "        density: 'comfortable',",
        '      },',
        '    }),',
        '  ],',
        '};',
      ].join('\n');
    case 'translate':
      return [
        "import { provideSolaris } from '@educarehq/solaris-ui';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [',
        '    provideSolaris({',
        '      translate: {',
        "        locale: 'pt-BR',",
        "        fallbackLocale: 'en-US',",
        '        translations: APP_TRANSLATIONS,',
        '      },',
        '    }),',
        '  ],',
        '};',
      ].join('\n');
    case 'basic':
    default:
      return [
        "import { provideSolaris } from '@educarehq/solaris-ui';",
        '',
        'export const appConfig: ApplicationConfig = {',
        '  providers: [provideSolaris()],',
        '};',
      ].join('\n');
  }
}
