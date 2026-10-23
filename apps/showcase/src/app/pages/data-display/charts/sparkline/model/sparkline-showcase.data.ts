import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const SPARKLINE_SHOWCASE_SLUG = 'sparkline';

export const SPARKLINE_TRANSLATION_PREFIX = 'sparkline-view';

export const SPARKLINE_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.sparkline' },
  ];

export const SPARKLINE_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radar',
  route: '/data-display/charts/radar',
};

export const SPARKLINE_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.code-block',
  route: '/data-display/code-block',
};

export const SPARKLINE_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'sparkline-view.section.examples' },
  { anchor: 'kpis', labelKey: 'sparkline-view.section.kpis' },
  { anchor: 'gaps', labelKey: 'sparkline-view.section.gaps' },
  { anchor: 'states', labelKey: 'sparkline-view.section.states' },
  { anchor: 'installation', labelKey: 'sparkline-view.section.installation' },
  { anchor: 'props', labelKey: 'sparkline-view.section.props' },
];

export const SPARKLINE_SHOWCASE_IMPORT_CODE =
  "import { SolarisSparklineComponent } from '@solaris-ui/angular';";

export const SPARKLINE_SHOWCASE_BASIC_CODE = [
  '<solaris-sparkline',
  '  [points]="[3, 5, 4, 8, 7, 10]"',
  '  ariaLabel="Revenue trend, rising"',
  '/>',
].join('\n');

export const SPARKLINE_SHOWCASE_KPI_CODE = [
  '<div class="kpi">',
  '  <span>Active users</span>',
  '  <solaris-badge color="success" size="sm">+12.4%</solaris-badge>',
  '  <solaris-sparkline',
  '    [points]="usersSpark"',
  '    ariaLabel="Active users trend, rising"',
  '  />',
  '</div>',
  '<div class="kpi">',
  '  <span>Churn</span>',
  '  <solaris-badge color="danger" size="sm">-8.1%</solaris-badge>',
  '  <solaris-sparkline',
  '    [points]="churnSpark"',
  '    [positiveIsGood]="false"',
  '    ariaLabel="Churn trend, falling"',
  '  />',
  '</div>',
].join('\n');

export const SPARKLINE_SHOWCASE_GAPS_CODE = [
  '<solaris-sparkline',
  '  [points]="[3, null, 5, 4, undefined, 8]"',
  '  ariaLabel="Attendance trend with gaps"',
  '/>',
].join('\n');

export const SPARKLINE_SHOWCASE_EMPTY_CODE = [
  '<solaris-sparkline',
  '  [points]="[]"',
  '  ariaLabel="No data yet"',
  '/>',
].join('\n');
