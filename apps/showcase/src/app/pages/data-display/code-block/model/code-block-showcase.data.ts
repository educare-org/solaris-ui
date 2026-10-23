import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const CODE_BLOCK_SHOWCASE_SLUG = 'code-block';
export const CODE_BLOCK_TRANSLATION_PREFIX = 'code-block';

export const CODE_BLOCK_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.code-block' },
  ];

export const CODE_BLOCK_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.sparkline',
  route: '/data-display/charts/sparkline',
};

export const CODE_BLOCK_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.preview-code',
  route: '/data-display/preview-code',
};

export const CODE_BLOCK_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'code-block.section.examples' },
  { anchor: 'layouts', labelKey: 'code-block.section.layouts' },
  { anchor: 'commands', labelKey: 'code-block.section.commands' },
  { anchor: 'appearances', labelKey: 'code-block.section.appearances' },
  { anchor: 'sizes', labelKey: 'code-block.section.sizes' },
  { anchor: 'density', labelKey: 'code-block.section.density' },
  { anchor: 'expandable', labelKey: 'code-block.section.expandable' },
  { anchor: 'editable', labelKey: 'code-block.section.editable' },
  { anchor: 'highlighting', labelKey: 'code-block.section.highlighting' },
  { anchor: 'installation', labelKey: 'code-block.section.installation' },
  { anchor: 'props', labelKey: 'code-block.section.props' },
];

export const CODE_BLOCK_SHOWCASE_IMPORT_CODE =
  "import { SolarisCodeBlockComponent } from '@solaris-ui/angular';";

export const CODE_BLOCK_SHOWCASE_BASIC_CODE = 'const answer = 42;';

export const CODE_BLOCK_SHOWCASE_INLINE_CODE = 'pnpm nx build angular';

export const CODE_BLOCK_SHOWCASE_LONG_CODE = [
  'const answer = 42;',
  'function greet(name: string) {',
  '  return `Hello ${name}`;',
  '}',
  "console.log(greet('Solaris'));",
  "console.log(greet('Educare'));",
  "console.log(greet('Docs'));",
  "console.log(greet('Tokens'));",
  "console.log(greet('Signals'));",
  "console.log(greet('Standalone'));",
].join('\n');

export const CODE_BLOCK_SHOWCASE_JSON_CODE = [
  '{',
  '  "framework": "Solaris UI",',
  '  "standalone": true,',
  '  "signals": true,',
  '  "version": 1,',
  '}',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as CODE_BLOCK_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
