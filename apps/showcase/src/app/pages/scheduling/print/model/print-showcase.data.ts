export { SHOWCASE_INSTALL_COMMANDS as PRINT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PRINT_SHOWCASE_SLUG = 'print';

export const PRINT_TRANSLATION_PREFIX = 'print-view';

export const PRINT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.print' },
];

export const PRINT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.holidays',
  route: '/scheduling/holidays',
};

export const PRINT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.divider',
  route: '/content/divider',
};

export const PRINT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'print-view.section.examples' },
  { anchor: 'installation', labelKey: 'print-view.section.installation' },
  { anchor: 'props', labelKey: 'print-view.section.props' },
];

export const PRINT_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarComponent } from '@solaris-ui/angular';";

export const PRINT_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar',
  '  locale="pt-BR"',
  '  view="month"',
  '  focusedDate="2026-10-15"',
  '  [events]="events"',
  '/>',
  '<!-- window.print(): toolbar/side hide, agenda expands, ink-safe -->',
].join('\n');
