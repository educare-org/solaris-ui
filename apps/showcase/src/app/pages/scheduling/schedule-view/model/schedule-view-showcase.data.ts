import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import { SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';

export const SCHEDULE_VIEW_SHOWCASE_SLUG = 'schedule-view';

export const SCHEDULE_VIEW_TRANSLATION_PREFIX = 'schedule-view';

export const SCHEDULE_VIEW_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.schedule-view' },
  ];

export const SCHEDULE_VIEW_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.year-view',
  route: '/scheduling/year-view',
};

export const SCHEDULE_VIEW_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.event-editor',
  route: '/scheduling/event-editor',
};

export const SCHEDULE_VIEW_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'schedule-view.section.examples' },
  { anchor: 'size-density', labelKey: 'schedule-view.section.size-density' },
  { anchor: 'locales', labelKey: 'schedule-view.section.locales' },
  { anchor: 'installation', labelKey: 'schedule-view.section.installation' },
  { anchor: 'props', labelKey: 'schedule-view.section.props' },
];

export const SCHEDULE_VIEW_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarScheduleViewComponent } from '@solaris-ui/angular';";

export const SCHEDULE_VIEW_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar-schedule-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [windowDays]="7"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (eventOpen)="onEventOpen($event)"',
  '  (taskToggle)="onTaskToggle($event)"',
  '/>',
].join('\n');

export const SCHEDULE_VIEW_SHOWCASE_INSTALL_COMMANDS =
  SHOWCASE_INSTALL_COMMANDS;
