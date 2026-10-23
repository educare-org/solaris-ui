import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const CHART_SHELL_SHOWCASE_SLUG = 'chart-shell';

export const CHART_SHELL_TRANSLATION_PREFIX = 'chart-shell-view';

export const CHART_SHELL_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.chart-shell' },
  ];

export const CHART_SHELL_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.card',
  route: '/data-display/card',
};

export const CHART_SHELL_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.line-chart',
  route: '/data-display/charts/line-chart',
};

export const CHART_SHELL_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'chart-shell-view.section.examples' },
  { anchor: 'views', labelKey: 'chart-shell-view.section.views' },
  { anchor: 'display', labelKey: 'chart-shell-view.section.display' },
  { anchor: 'states', labelKey: 'chart-shell-view.section.states' },
  { anchor: 'installation', labelKey: 'chart-shell-view.section.installation' },
  { anchor: 'props', labelKey: 'chart-shell-view.section.props' },
];

export const CHART_SHELL_SHOWCASE_IMPORT_CODE =
  "import { SolarisChartShellComponent } from '@solaris-ui/angular';";

export const CHART_SHELL_SHOWCASE_BASIC_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  heroValue="12,450"',
  '  heroLabel="tasks"',
  '  heroDelta="+12.4%"',
  '  heroDeltaDirection="up"',
  '  intervalLabel="Apr 28, 2026 → May 04, 2026"',
  '  locale="en-US"',
  '  [(view)]="view"',
  '  [(period)]="period"',
  '  [(displayMode)]="displayMode"',
  '  [availablePeriods]="periodOptions"',
  '  [series]="series"',
  '  [loading]="loading"',
  '  (viewChange)="onViewChange($event)"',
  '  (periodChange)="onPeriodChange($event)"',
  '  (displayModeChange)="onDisplayModeChange($event)"',
  '  (seriesToggle)="onSeriesToggle($event)"',
  '  (actionRequest)="onAction($event)"',
  '>',
  '  <!-- projected chart: line, bar, pie -->',
  '</solaris-chart-shell>',
].join('\n');

export const CHART_SHELL_SHOWCASE_STATES_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  locale="en-US"',
  '  [series]="[]"',
  '/>',
].join('\n');

export const CHART_SHELL_SHOWCASE_LOADING_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  locale="en-US"',
  '  [series]="series"',
  '  [loading]="true"',
  '/>',
].join('\n');

export const CHART_SHELL_SHOWCASE_ERROR_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  locale="en-US"',
  '  [series]="series"',
  '  error="Could not load the data."',
  '  (retry)="onRetry()"',
  '/>',
].join('\n');

export const CHART_SHELL_SHOWCASE_VIEWS_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  locale="en-US"',
  '  [(view)]="view"',
  '  [series]="series"',
  '  (viewChange)="onViewChange($event)"',
  '>',
  '  @if (view === "bar") {',
  '    <solaris-bar-chart [series]="series" />',
  '  } @else if (view === "pie") {',
  '    <solaris-pie-chart [series]="series" />',
  '  } @else {',
  '    <solaris-line-chart [series]="series" />',
  '  }',
  '</solaris-chart-shell>',
].join('\n');

export const CHART_SHELL_SHOWCASE_DISPLAY_CODE = [
  '<solaris-chart-shell',
  '  title="Weekly Agent Activity"',
  '  locale="en-US"',
  '  [(displayMode)]="displayMode"',
  '  [series]="series"',
  '  (displayModeChange)="onDisplayModeChange($event)"',
  '>',
  '  @if (displayMode === "list") {',
  '    <!-- totals table -->',
  '  } @else {',
  '    <solaris-line-chart [series]="series" />',
  '  }',
  '</solaris-chart-shell>',
].join('\n');
