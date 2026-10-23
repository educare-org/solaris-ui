import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const LINE_CHART_SHOWCASE_SLUG = 'line-chart';

export const LINE_CHART_TRANSLATION_PREFIX = 'line-chart-view';

export const LINE_CHART_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.line-chart' },
  ];

export const LINE_CHART_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.chart-shell',
  route: '/data-display/charts/shell',
};

export const LINE_CHART_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.bar-chart',
  route: '/data-display/charts/bar-chart',
};

export const LINE_CHART_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'line-chart-view.section.examples' },
  {
    anchor: 'interpolation',
    labelKey: 'line-chart-view.section.interpolation',
  },
  { anchor: 'gaps', labelKey: 'line-chart-view.section.gaps' },
  { anchor: 'size-density', labelKey: 'line-chart-view.section.size-density' },
  { anchor: 'installation', labelKey: 'line-chart-view.section.installation' },
  { anchor: 'props', labelKey: 'line-chart-view.section.props' },
];

export const LINE_CHART_SHOWCASE_IMPORT_CODE =
  "import { SolarisLineChartComponent } from '@solaris-ui/angular';";

export const LINE_CHART_SHOWCASE_BASIC_CODE = [
  '<solaris-line-chart',
  '  locale="en-US"',
  '  [series]="series"',
  '  [referenceLines]="[{ value: 120, label: \'Average\' }]"',
  '  (pointSelect)="onPointSelect($event)"',
  '/>',
].join('\n');

export const LINE_CHART_SHOWCASE_INTERPOLATION_CODE = [
  '<solaris-line-chart',
  '  locale="en-US"',
  '  [series]="series"',
  '  [interpolation]="interpolation"',
  '  [step]="step"',
  '  (pointSelect)="onPointSelect($event)"',
  '/>',
].join('\n');

export const LINE_CHART_SHOWCASE_GAPS_CODE = [
  '<solaris-line-chart',
  '  locale="en-US"',
  '  [series]="gapSeries"',
  '  [referenceLines]="[{ value: 120, label: \'Average\' }]"',
  '  (pointSelect)="onPointSelect($event)"',
  '/>',
].join('\n');
