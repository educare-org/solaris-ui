import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import { SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';

export const WEEK_VIEW_SHOWCASE_SLUG = 'week-view';

export const WEEK_VIEW_TRANSLATION_PREFIX = 'week-view';

export const WEEK_VIEW_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.week-view' },
  ];

export const WEEK_VIEW_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.month-view',
  route: '/scheduling/month-view',
};

export const WEEK_VIEW_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.year-view',
  route: '/scheduling/year-view',
};

export const WEEK_VIEW_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'week-view.section.examples' },
  { anchor: 'drag', labelKey: 'week-view.section.drag' },
  { anchor: 'size-density', labelKey: 'week-view.section.size-density' },
  { anchor: 'locales', labelKey: 'week-view.section.locales' },
  { anchor: 'installation', labelKey: 'week-view.section.installation' },
  { anchor: 'props', labelKey: 'week-view.section.props' },
];

export const WEEK_VIEW_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarWeekViewComponent } from '@solaris-ui/angular';";

export const WEEK_VIEW_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar-week-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [visibleDays]="7"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (slotSelect)="onSlotSelect($event)"',
  '  (eventOpen)="onEventOpen($event)"',
  '/>',
].join('\n');

export const WEEK_VIEW_SHOWCASE_DRAG_CODE = [
  '<solaris-calendar-week-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [visibleDays]="7"',
  '  [events]="events"',
  '  [snapStepMinutes]="30"',
  '  (eventCreate)="onEventCreate($event)"',
  '  (eventMove)="onEventMove($event)"',
  '  (eventResize)="onEventResize($event)"',
  '/>',
].join('\n');

export const WEEK_VIEW_SHOWCASE_INSTALL_COMMANDS = SHOWCASE_INSTALL_COMMANDS;
