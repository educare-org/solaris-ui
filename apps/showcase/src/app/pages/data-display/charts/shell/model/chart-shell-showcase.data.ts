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
  { anchor: 'kpis', labelKey: 'chart-shell-view.section.kpis' },
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
  '  intervalLabel="Apr 28, 2026 → May 04, 2026"',
  '  [(view)]="view"',
  '  [(period)]="period"',
  '  [series]="series"',
  '  (seriesToggle)="onSeriesToggle($event)"',
  '  (actionRequest)="onAction($event)"',
  '>',
  '  <!-- projected chart: line, bar, pie -->',
  '</solaris-chart-shell>',
].join('\n');
