export { SHOWCASE_INSTALL_COMMANDS as HOLIDAYS_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const HOLIDAYS_SHOWCASE_SLUG = 'holidays';

export const HOLIDAYS_TRANSLATION_PREFIX = 'holidays-view';

export const HOLIDAYS_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.holidays' },
  ];

export const HOLIDAYS_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.shell',
  route: '/scheduling/shell',
};

export const HOLIDAYS_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.print',
  route: '/scheduling/print',
};

export const HOLIDAYS_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'holidays-view.section.examples' },
  { anchor: 'installation', labelKey: 'holidays-view.section.installation' },
  { anchor: 'props', labelKey: 'holidays-view.section.props' },
];

export const HOLIDAYS_SHOWCASE_IMPORT_CODE =
  "import { builtInHolidays, preloadBuiltInHolidays } from '@solaris-ui/angular';";

export const HOLIDAYS_SHOWCASE_BASIC_CODE = [
  "await preloadBuiltInHolidays('pt-BR');",
  'const holidays = builtInHolidays().holidays(',
  "  { start: '2026-01-01', end: '2026-12-31' },",
  "  'pt-BR',",
  ');',
].join('\n');
