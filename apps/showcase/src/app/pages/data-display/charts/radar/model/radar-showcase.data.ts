import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const RADAR_SHOWCASE_SLUG = 'radar';

export const RADAR_TRANSLATION_PREFIX = 'radar-view';

export const RADAR_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.charts' },
  { labelKey: 'shell.sidebar.item.radar' },
];

export const RADAR_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.heatmap',
  route: '/data-display/charts/heatmap',
};

export const RADAR_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.sparkline',
  route: '/data-display/charts/sparkline',
};

export const RADAR_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'radar-view.section.examples' },
  { anchor: 'many-series', labelKey: 'radar-view.section.manySeries' },
  { anchor: 'empty', labelKey: 'radar-view.section.empty' },
  { anchor: 'size-density', labelKey: 'radar-view.section.size-density' },
  { anchor: 'installation', labelKey: 'radar-view.section.installation' },
  { anchor: 'props', labelKey: 'radar-view.section.props' },
];

export const RADAR_SHOWCASE_IMPORT_CODE =
  "import { SolarisRadarComponent } from '@solaris-ui/angular';";

export const RADAR_SHOWCASE_BASIC_CODE = [
  '<solaris-radar',
  '  locale="en-US"',
  '  [axes]="axes"',
  '  [series]="series"',
  '  [max]="10"',
  '  (vertexSelect)="onVertexSelect($event)"',
  '  (seriesToggle)="onSeriesToggle($event)"',
  '/>',
].join('\n');

export const RADAR_SHOWCASE_EMPTY_CODE = [
  '<solaris-radar',
  '  locale="en-US"',
  '  [axes]="axes"',
  '  [series]="[]"',
  '/>',
].join('\n');

export const RADAR_SHOWCASE_MANY_CODE = [
  '<solaris-radar',
  '  locale="en-US"',
  '  [axes]="manyAxes"',
  '  [series]="manySeries"',
  '  [max]="10"',
  '  (vertexSelect)="onVertexSelect($event)"',
  '  (seriesToggle)="onSeriesToggle($event)"',
  '/>',
].join('\n');
