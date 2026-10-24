import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const CHART_CARDS_SHOWCASE_SLUG = 'chart-cards';

export const CHART_CARDS_TRANSLATION_PREFIX = 'chart-cards-view';

export const CHART_CARDS_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.charts' },
    { labelKey: 'shell.sidebar.item.chart-cards' },
  ];

export const CHART_CARDS_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.sparkline',
  route: '/data-display/charts/sparkline',
};

export const CHART_CARDS_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.code-block',
  route: '/data-display/code-block',
};

export const CHART_CARDS_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'recipes', labelKey: 'chart-cards-view.section.recipes' },
  { anchor: 'pattern', labelKey: 'chart-cards-view.section.pattern' },
  { anchor: 'installation', labelKey: 'chart-cards-view.section.installation' },
  { anchor: 'props', labelKey: 'chart-cards-view.section.props' },
];

export const CHART_CARDS_SHOWCASE_IMPORT_CODE =
  "import { SolarisCardComponent, SolarisSparklineComponent, SolarisBarChartComponent, SolarisLineChartComponent } from '@solaris-ui/angular';";

export const CHART_CARDS_SHOWCASE_REVENUE_CODE = [
  '<solaris-card padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Revenue</h3>',
  '    <p solaris-card-description>Sales Report · 2026</p>',
  '  </div>',
  '  <div solaris-card-content>',
  '    <span class="kpi-value">R$ 1,2 mi</span>',
  '    <solaris-badge color="success" size="sm">+12,4%</solaris-badge>',
  '    <solaris-sparkline [points]="revenueSpark" ariaLabel="Revenue trend, rising" />',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CHART_CARDS_SHOWCASE_CHANNELS_CODE = [
  '<solaris-card padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Sales by channel</h3>',
  '    <p solaris-card-description>Q3 2026 · settled orders</p>',
  '  </div>',
  '  <div solaris-card-content>',
  '    <solaris-bar-chart locale="en-US" [series]="channelSeries" />',
  '    <!-- totals table mirrors the chart for screen readers and print -->',
  '    <table>',
  '      ...',
  '    </table>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CHART_CARDS_SHOWCASE_TARGET_CODE = [
  '<solaris-card padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Monthly target</h3>',
  '    <p solaris-card-description>Actual vs goal · 2026</p>',
  '  </div>',
  '  <div solaris-card-content>',
  '    <solaris-line-chart',
  '      locale="en-US"',
  '      [series]="targetSeries"',
  '      [referenceLines]="targetReference"',
  '    />',
  '  </div>',
  '</solaris-card>',
].join('\n');
