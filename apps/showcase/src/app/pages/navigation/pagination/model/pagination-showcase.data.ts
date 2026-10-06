import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PAGINATION_SHOWCASE_SLUG = 'pagination';
export const PAGINATION_TRANSLATION_PREFIX = 'pagination';

export const PAGINATION_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.pagination' },
  ];

export const PAGINATION_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.editable-tabs',
  route: '/navigation/editable-tabs',
};

export const PAGINATION_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.dialog',
  route: '/overlay/dialog',
};

export const PAGINATION_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'pagination.section.examples' },
  { anchor: 'basic', labelKey: 'pagination.section.basic' },
  { anchor: 'page-size', labelKey: 'pagination.section.page-size' },
  { anchor: 'unknown-total', labelKey: 'pagination.section.unknown-total' },
  { anchor: 'density', labelKey: 'pagination.section.density' },
  { anchor: 'installation', labelKey: 'pagination.section.installation' },
  { anchor: 'props', labelKey: 'pagination.section.props' },
];

export const PAGINATION_SHOWCASE_IMPORT_CODE =
  "import { SolarisPaginationComponent } from '@solaris-ui/angular';";

export const PAGINATION_SHOWCASE_BASIC_CODE = [
  '<solaris-pagination',
  '  [pageIndex]="pageIndex"',
  '  [pageSize]="pageSize"',
  '  [total]="total"',
  '  (pageChange)="onPageChange($event)"',
  '/>',
].join('\n');

export const PAGINATION_SHOWCASE_UNKNOWN_TOTAL_CODE = [
  '<solaris-pagination',
  '  [pageIndex]="pageIndex"',
  '  [hasMore]="true"',
  '/>',
].join('\n');

export const PAGINATION_PAGE_SIZE_CODE = [
  '<solaris-pagination',
  '  [pageIndex]="pageIndex"',
  '  [pageSize]="pageSize"',
  '  [total]="total"',
  '  [pageSizeOptions]="[10, 25, 50]"',
  '  (pageChange)="onPageChange($event)"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as PAGINATION_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
