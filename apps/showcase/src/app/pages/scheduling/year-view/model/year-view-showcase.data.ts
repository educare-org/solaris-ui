import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import { SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';

export const YEAR_VIEW_SHOWCASE_SLUG = 'year-view';

export const YEAR_VIEW_TRANSLATION_PREFIX = 'year-view';

export const YEAR_VIEW_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.calendar', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.year-view' },
  ];

export const YEAR_VIEW_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.week-view',
  route: '/scheduling/week-view',
};

export const YEAR_VIEW_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.schedule-view',
  route: '/scheduling/schedule-view',
};

export const YEAR_VIEW_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'year-view.section.examples' },
  { anchor: 'drill', labelKey: 'year-view.section.drill' },
  { anchor: 'size-density', labelKey: 'year-view.section.size-density' },
  { anchor: 'locales', labelKey: 'year-view.section.locales' },
  { anchor: 'installation', labelKey: 'year-view.section.installation' },
  { anchor: 'props', labelKey: 'year-view.section.props' },
];

export const YEAR_VIEW_SHOWCASE_IMPORT_CODE =
  "import { SolarisCalendarYearViewComponent } from '@solaris-ui/angular';";

export const YEAR_VIEW_SHOWCASE_BASIC_CODE = [
  '<solaris-calendar-year-view',
  '  locale="pt-BR"',
  '  timeZone="America/Sao_Paulo"',
  '  [(focusedDate)]="focusedDate"',
  '  [events]="events"',
  '  [tasks]="tasks"',
  '  [holidays]="holidays"',
  '  (daySelect)="onDaySelect($event)"',
  '/>',
].join('\n');

export const YEAR_VIEW_SHOWCASE_INSTALL_COMMANDS = SHOWCASE_INSTALL_COMMANDS;
