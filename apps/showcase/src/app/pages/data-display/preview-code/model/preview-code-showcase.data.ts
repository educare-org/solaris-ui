import type { SolarisPreviewCodeFile } from '@solaris-ui/angular';

import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PREVIEW_CODE_SHOWCASE_SLUG = 'preview-code';
export const PREVIEW_CODE_TRANSLATION_PREFIX = 'preview-code';

export const PREVIEW_CODE_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.preview-code' },
  ];

export const PREVIEW_CODE_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.code-block',
  route: '/data-display/code-block',
};

export const PREVIEW_CODE_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.table',
  route: '/data-display/table',
};

export const PREVIEW_CODE_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'preview-code.section.examples' },
  { anchor: 'controlled', labelKey: 'preview-code.section.controlled' },
  { anchor: 'files', labelKey: 'preview-code.section.files' },
  { anchor: 'expandable', labelKey: 'preview-code.section.expandable' },
  { anchor: 'layout', labelKey: 'preview-code.section.layout' },
  { anchor: 'installation', labelKey: 'preview-code.section.installation' },
  { anchor: 'props', labelKey: 'preview-code.section.props' },
];

export const PREVIEW_CODE_SHOWCASE_IMPORT_CODE =
  "import { SolarisPreviewCodeComponent } from '@solaris-ui/angular';";

export const PREVIEW_CODE_SHOWCASE_BASIC_CODE =
  '<button solaris-button>Save</button>';

export const PREVIEW_CODE_SHOWCASE_BUTTON_FILES: readonly SolarisPreviewCodeFile[] =
  [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: '<button solaris-button>Save</button>',
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'typescript',
      code: "import { SolarisButtonDirective } from '@solaris-ui/angular';",
    },
  ];

export const PREVIEW_CODE_SHOWCASE_LONG_CODE = [
  'const answer = 42;',
  'function greet(name: string) {',
  '  return `Hello ${name}`;',
  '}',
  "console.log(greet('Solaris'));",
  "console.log(greet('Educare'));",
  "console.log(greet('Docs'));",
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as PREVIEW_CODE_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
