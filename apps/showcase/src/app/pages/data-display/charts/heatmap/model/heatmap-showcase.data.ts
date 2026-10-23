import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';

export const HEATMAP_SHOWCASE_SLUG = 'heatmap';

export const HEATMAP_TRANSLATION_PREFIX = 'heatmap-view';

export const HEATMAP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.charts' },
  { labelKey: 'shell.sidebar.item.heatmap' },
];

export const HEATMAP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.pie-chart',
  route: '/data-display/charts/pie-chart',
};

export const HEATMAP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radar',
  route: '/data-display/charts/radar',
};

export const HEATMAP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'heatmap-view.section.examples' },
  { anchor: 'scale', labelKey: 'heatmap-view.section.scale' },
  { anchor: 'empty', labelKey: 'heatmap-view.section.empty' },
  { anchor: 'size-density', labelKey: 'heatmap-view.section.size-density' },
  { anchor: 'installation', labelKey: 'heatmap-view.section.installation' },
  { anchor: 'props', labelKey: 'heatmap-view.section.props' },
];

export const HEATMAP_SHOWCASE_IMPORT_CODE =
  "import { SolarisHeatmapComponent } from '@solaris-ui/angular';";

export const HEATMAP_SHOWCASE_BASIC_CODE = [
  '<solaris-heatmap',
  '  locale="en-US"',
  '  [rows]="rows"',
  '  [columns]="columns"',
  '  [max]="100"',
  '  (cellSelect)="onCellSelect($event)"',
  '/>',
].join('\n');

export const HEATMAP_SHOWCASE_EMPTY_CODE = [
  '<solaris-heatmap',
  '  locale="en-US"',
  '  [rows]="[]"',
  '  [columns]="columns"',
  '/>',
].join('\n');

export const HEATMAP_SHOWCASE_SCALE_CODE = [
  '<solaris-heatmap',
  '  locale="en-US"',
  '  [rows]="scaleRows"',
  '  [columns]="scaleColumns"',
  '  [max]="100"',
  '  [showScale]="true"',
  '  (cellSelect)="onCellSelect($event)"',
  '/>',
].join('\n');
