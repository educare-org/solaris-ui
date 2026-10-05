import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const BREADCRUMB_SHOWCASE_SLUG = 'breadcrumb';
export const BREADCRUMB_TRANSLATION_PREFIX = 'breadcrumb';

export const BREADCRUMB_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.breadcrumb' },
  ];

export const BREADCRUMB_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tabs',
  route: '/navigation/tabs',
};

export const BREADCRUMB_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.mega-menu',
  route: '/navigation/mega-menu',
};

export const BREADCRUMB_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'breadcrumb.section.examples' },
  { anchor: 'separators', labelKey: 'breadcrumb.section.separators' },
  { anchor: 'size-density', labelKey: 'breadcrumb.section.size-density' },
  { anchor: 'overflow', labelKey: 'breadcrumb.section.overflow' },
  { anchor: 'truncation', labelKey: 'breadcrumb.section.truncation' },
  { anchor: 'navigation', labelKey: 'breadcrumb.section.navigation' },
  { anchor: 'installation', labelKey: 'breadcrumb.section.installation' },
  { anchor: 'props', labelKey: 'breadcrumb.section.props' },
];

export const BREADCRUMB_SHOWCASE_IMPORT_CODE =
  "import { SolarisBreadcrumbComponent } from '@solaris-ui/angular';";

export const BREADCRUMB_SHOWCASE_BASIC_CODE = [
  '<solaris-breadcrumb [items]="items" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_ICONS_CODE = [
  '<solaris-breadcrumb [items]="items" separator="chevron" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_SEPARATOR_SLASH_CODE = [
  '<solaris-breadcrumb [items]="items" separator="slash" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_SEPARATOR_CHEVRON_CODE = [
  '<solaris-breadcrumb [items]="items" separator="chevron" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_SEPARATOR_DOT_CODE = [
  '<solaris-breadcrumb [items]="items" separator="dot" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_OVERFLOW_START_CODE = [
  '<solaris-breadcrumb',
  '  [items]="items"',
  '  [maxVisibleItems]="3"',
  '  overflowPosition="start"',
  '/>',
].join('\n');

export const BREADCRUMB_SHOWCASE_OVERFLOW_MIDDLE_CODE = [
  '<solaris-breadcrumb',
  '  [items]="items"',
  '  [maxVisibleItems]="3"',
  '  overflowPosition="middle"',
  '/>',
].join('\n');

export const BREADCRUMB_SHOWCASE_OVERFLOW_END_CODE = [
  '<solaris-breadcrumb',
  '  [items]="items"',
  '  [maxVisibleItems]="3"',
  '  overflowPosition="end"',
  '/>',
].join('\n');

export const BREADCRUMB_SHOWCASE_TRUNCATION_CODE = [
  '<solaris-breadcrumb [items]="items" size="sm" />',
].join('\n');

export const BREADCRUMB_SHOWCASE_NAVIGATION_CODE = [
  '<solaris-breadcrumb',
  '  [items]="items"',
  '  [showNavigation]="true"',
  '  (previous)="goBack()"',
  '  (next)="goForward()"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as BREADCRUMB_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
