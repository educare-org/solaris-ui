import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const BAR_CHART_SHOWCASE_SLUG = 'bar-chart';

export const BAR_CHART_TRANSLATION_PREFIX = 'bar-chart-view';

export const BAR_CHART_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.bar-chart' },
  ];

export const BAR_CHART_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.line-chart',
  route: '/data-display/charts/line-chart',
};

export const BAR_CHART_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.pie-chart',
  route: '/data-display/charts/pie-chart',
};

export const BAR_CHART_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'bar-chart-view.section.examples' },
  { anchor: 'horizontal', labelKey: 'bar-chart-view.section.horizontal' },
  { anchor: 'values', labelKey: 'bar-chart-view.section.values' },
  { anchor: 'diverging', labelKey: 'bar-chart-view.section.diverging' },
  { anchor: 'empty', labelKey: 'bar-chart-view.section.empty' },
  { anchor: 'installation', labelKey: 'bar-chart-view.section.installation' },
  { anchor: 'props', labelKey: 'bar-chart-view.section.props' },
];

export const BAR_CHART_SHOWCASE_IMPORT_CODE =
  "import { SolarisBarChartComponent } from '@solaris-ui/angular';";

export const BAR_CHART_SHOWCASE_BASIC_CODE = [
  '<solaris-bar-chart',
  '  locale="en-US"',
  '  [series]="series"',
  '  layout="stacked"',
  '  [referenceLines]="[{ value: 120, label: \'Average\' }]"',
  '  (pointSelect)="onPointSelect($event)"',
  '/>',
].join('\n');

export const BAR_CHART_SHOWCASE_HORIZONTAL_CODE = [
  '<solaris-bar-chart',
  '  locale="en-US"',
  '  orientation="horizontal"',
  '  [series]="series"',
  '  [referenceLines]="[{ value: 120, label: \'Average\' }]"',
  '/>',
].join('\n');

export const BAR_CHART_SHOWCASE_VALUES_CODE = [
  '<solaris-bar-chart',
  '  locale="en-US"',
  '  [series]="series"',
  '  layout="grouped"',
  '  [referenceLines]="[{ value: 120, label: \'Average\' }]"',
  '  [showValues]="true"',
  '/>',
].join('\n');

export const BAR_CHART_SHOWCASE_DIVERGING_CODE = [
  '<solaris-bar-chart',
  '  locale="en-US"',
  '  [series]="divergingSeries"',
  '  layout="grouped"',
  '  [showValues]="true"',
  '/>',
].join('\n');

export const BAR_CHART_SHOWCASE_EMPTY_CODE = [
  '<solaris-bar-chart',
  '  locale="en-US"',
  '  [series]="[]"',
  '/>',
].join('\n');
