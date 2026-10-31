import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../shell/docs-on-this-page/model/toc-item';
import type { SolarisCodeBlockCommand } from '@solaris-ui/angular';

import { SHOWCASE_INSTALL_COMMANDS } from '../../shared/showcase-page-utils';

export const INSTALLATION_SHOWCASE_SLUG = 'installation';
export const INSTALLATION_TRANSLATION_PREFIX = 'installation';

export const INSTALLATION_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    {
      labelKey: 'shell.sidebar.section.getting-started',
      route: '/introduction',
    },
    { labelKey: 'shell.sidebar.item.installation' },
  ];

export const INSTALLATION_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.introduction',
  route: '/introduction',
};

export const INSTALLATION_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.icons',
  route: '/icons',
};

export const INSTALLATION_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'prerequisites', labelKey: 'installation.section.prerequisites' },
  { anchor: 'install', labelKey: 'installation.section.install' },
  { anchor: 'styles', labelKey: 'installation.section.styles' },
  { anchor: 'providers', labelKey: 'installation.section.providers' },
  { anchor: 'language', labelKey: 'installation.section.language' },
  { anchor: 'verify', labelKey: 'installation.section.verify' },
];

export { SHOWCASE_INSTALL_COMMANDS as INSTALLATION_SHOWCASE_INSTALL_COMMANDS };

export const INSTALLATION_SHOWCASE_SCHEMATIC_COMMANDS: readonly SolarisCodeBlockCommand[] =
  [
    {
      id: 'ng-add',
      label: 'ng add',
      code: 'ng add @educarehq/solaris-ui',
      language: 'shell',
    },
  ];

export const INSTALLATION_SHOWCASE_NX_COMMANDS: readonly SolarisCodeBlockCommand[] =
  [
    {
      id: 'nx',
      label: 'nx',
      code: 'pnpm exec nx g @educarehq/solaris-ui:init',
      language: 'shell',
    },
  ];

export const INSTALLATION_SHOWCASE_VERIFY_COMMANDS: readonly SolarisCodeBlockCommand[] =
  [
    {
      id: 'start',
      label: 'pnpm',
      code: 'pnpm start',
      language: 'shell',
    },
  ];

export const INSTALLATION_SHOWCASE_STYLE_CODE = [
  "@use '@educarehq/solaris-ui/styles' as solaris;",
  '',
  '@include solaris.core();',
  '',
  '@include solaris.theme((',
  '  color-scheme: system,',
  '  density: comfortable,',
  '  radius: md,',
  '  motion: auto,',
  '));',
].join('\n');

export const INSTALLATION_SHOWCASE_GLOBAL_STYLE_CODE =
  "@use './styles/solaris';";

export const INSTALLATION_SHOWCASE_TRANSLATE_CODE = [
  'provideSolaris({',
  '  translate: {',
  "    locale: 'pt-BR',",
  "    fallbackLocale: 'en-US',",
  '    translations: APP_TRANSLATIONS,',
  '  },',
  '}),',
].join('\n');
