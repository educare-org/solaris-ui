export { SHOWCASE_INSTALL_COMMANDS as SHELL_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SHELL_SHOWCASE_SLUG = 'shell';

export const SHELL_TRANSLATION_PREFIX = 'shell-view';

export const SHELL_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.shell' },
];

export const SHELL_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.schedule-view',
  route: '/scheduling/schedule-view',
};

export const SHELL_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.holidays',
  route: '/scheduling/holidays',
};

export const SHELL_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'shell-view.section.examples' },
  { anchor: 'responsive', labelKey: 'shell-view.section.responsive' },
  { anchor: 'installation', labelKey: 'shell-view.section.installation' },
  { anchor: 'props', labelKey: 'shell-view.section.props' },
];

export const SHELL_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarComponent } from '@solaris-ui/angular';";

export const SHELL_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar',
  '  locale="pt-BR"',
  '  [(view)]="view"',
  '  [(focusedDate)]="focusedDate"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (eventCreate)="onEventCreate($event)"',
  '/>',
].join('\n');
