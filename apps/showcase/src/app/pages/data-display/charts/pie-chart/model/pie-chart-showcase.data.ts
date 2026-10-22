import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const PIE_CHART_SHOWCASE_SLUG = 'pie-chart';

export const PIE_CHART_TRANSLATION_PREFIX = 'pie-chart-view';

export const PIE_CHART_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.pie-chart' },
  ];

export const PIE_CHART_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.bar-chart',
  route: '/data-display/charts/bar-chart',
};

export const PIE_CHART_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.code-block',
  route: '/data-display/code-block',
};

export const PIE_CHART_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'pie-chart-view.section.examples' },
  { anchor: 'grouping', labelKey: 'pie-chart-view.section.grouping' },
  { anchor: 'gauge', labelKey: 'pie-chart-view.section.gauge' },
  { anchor: 'score-ring', labelKey: 'pie-chart-view.section.scoreRing' },
  { anchor: 'drill-down', labelKey: 'pie-chart-view.section.drillDown' },
  { anchor: 'empty', labelKey: 'pie-chart-view.section.empty' },
  { anchor: 'installation', labelKey: 'pie-chart-view.section.installation' },
  { anchor: 'props', labelKey: 'pie-chart-view.section.props' },
];

export const PIE_CHART_SHOWCASE_IMPORT_CODE =
  "import { SolarisPieChartComponent } from '@solaris-ui/angular';";

export const PIE_CHART_SHOWCASE_BASIC_CODE = [
  '<solaris-pie-chart',
  '  locale="en-US"',
  '  variant="donut"',
  '  [slices]="slices"',
  '  [showValues]="true"',
  '  (sliceSelect)="onSliceSelect($event)"',
  '/>',
].join('\n');

export const PIE_CHART_SHOWCASE_GAUGE_CODE = [
  '<solaris-pie-chart',
  '  locale="en-US"',
  '  variant="gauge"',
  "  [slices]=\"[{ id: 'attendance', label: 'Attendance', value: 87 }\"",
  '  [gaugeMin]="0"',
  '  [gaugeMax]="100"',
  '  [gaugeTarget]="90"',
  '  centerLabel="Attendance"',
  '/>',
].join('\n');

export const PIE_CHART_SHOWCASE_EMPTY_CODE = [
  '<solaris-pie-chart',
  '  locale="en-US"',
  '  variant="donut"',
  '  [slices]="[]"',
  '/>',
].join('\n');
