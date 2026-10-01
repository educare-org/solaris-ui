import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PROGRESS_SHOWCASE_SLUG = 'progress';
export const PROGRESS_TRANSLATION_PREFIX = 'progress';

export const PROGRESS_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.feedback', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.progress' },
  ];

export const PROGRESS_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.spinner',
  route: '/feedback/loading/spinner',
};

export const PROGRESS_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.loading-text',
  route: '/feedback/loading/loading-text',
};

export const PROGRESS_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'progress.section.examples' },
  { anchor: 'status', labelKey: 'progress.section.status' },
  { anchor: 'animated', labelKey: 'progress.section.animated' },
  { anchor: 'stripes', labelKey: 'progress.section.stripes' },
  { anchor: 'buffer', labelKey: 'progress.section.buffer' },
  { anchor: 'size-density', labelKey: 'progress.section.size-density' },
  { anchor: 'colors', labelKey: 'progress.section.colors' },
  { anchor: 'indeterminate', labelKey: 'progress.section.indeterminate' },
  { anchor: 'installation', labelKey: 'progress.section.installation' },
  { anchor: 'props', labelKey: 'progress.section.props' },
];

export const PROGRESS_SHOWCASE_IMPORT_CODE =
  "import { SolarisProgressComponent } from '@educarehq/solaris-ui';";

export const PROGRESS_SHOWCASE_BASIC_CODE = [
  '<solaris-progress [value]="40" />',
  '<solaris-progress [value]="60" label="Uploading" showPercent />',
  '<solaris-progress indeterminate label="Loading" />',
].join('\n');

export function progressStatusCode(status: string): string {
  switch (status) {
    case 'success':
      return '<solaris-progress [value]="100" status="success" label="Complete" />';
    case 'exception':
      return '<solaris-progress [value]="65" status="exception" label="Upload failed" showPercent />';
    case 'active':
    default:
      return '<solaris-progress [value]="45" label="Uploading" showPercent />';
  }
}

export function progressAnimatedCode(value: string): string {
  return [
    '<solaris-progress',
    `  [value]="${value}"`,
    '  label="Downloading"',
    '  [showPercent]="true"',
    '></solaris-progress>',
  ].join('\n');
}

export function progressStripesCode(mode: string): string {
  switch (mode) {
    case 'animated':
      return '<solaris-progress [value]="55" animatedStripes />';
    case 'striped':
      return '<solaris-progress [value]="55" striped />';
    case 'none':
    default:
      return '<solaris-progress [value]="55" />';
  }
}

export const PROGRESS_SHOWCASE_BUFFER_CODE = [
  '<solaris-progress',
  '  [value]="40"',
  '  [bufferValue]="70"',
  '  label="Buffering"',
  '  [showPercent]="true"',
  '/>',
].join('\n');

export function progressSizeDensityCode(size: string, density: string): string {
  return `<solaris-progress [value]="60" size="${size}" density="${density}" label="Uploading" showPercent />`;
}

export function progressColorCode(color: string): string {
  return `<solaris-progress [value]="60" color="${color}" />`;
}

export const PROGRESS_SHOWCASE_INDETERMINATE_CODE =
  '<solaris-progress indeterminate label="Loading" />';

export { SHOWCASE_INSTALL_COMMANDS as PROGRESS_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
