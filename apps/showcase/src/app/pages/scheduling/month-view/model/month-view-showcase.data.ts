export { SHOWCASE_INSTALL_COMMANDS as MONTH_VIEW_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const MONTH_VIEW_SHOWCASE_SLUG = 'month-view';

export const MONTH_VIEW_TRANSLATION_PREFIX = 'month-view';

export const MONTH_VIEW_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.month-view' },
  ];

export const MONTH_VIEW_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.button-group',
  route: '/actions/button-group',
};

export const MONTH_VIEW_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.week-view',
  route: '/scheduling/week-view',
};

export const MONTH_VIEW_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'month-view.section.examples' },
  { anchor: 'drag', labelKey: 'month-view.section.drag' },
  { anchor: 'size-density', labelKey: 'month-view.section.size-density' },
  { anchor: 'locales', labelKey: 'month-view.section.locales' },
  { anchor: 'installation', labelKey: 'month-view.section.installation' },
  { anchor: 'props', labelKey: 'month-view.section.props' },
];

export const MONTH_VIEW_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarMonthViewComponent } from '@solaris-ui/angular';";

export const MONTH_VIEW_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar-month-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (daySelect)="onDaySelect($event)"',
  '  (eventOpen)="onEventOpen($event)"',
  '/>',
].join('\n');

export const MONTH_VIEW_SHOWCASE_DRAG_CODE = [
  '<solaris-calendar-month-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (eventCreate)="onEventCreate($event)"',
  '  (eventMove)="onEventMove($event)"',
  '/>',
].join('\n');
