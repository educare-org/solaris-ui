import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SPINNER_SHOWCASE_SLUG = 'spinner';
export const SPINNER_TRANSLATION_PREFIX = 'spinner';

export const SPINNER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.feedback', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.spinner' },
];

export const SPINNER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.skeleton',
  route: '/feedback/loading/skeleton',
};

export const SPINNER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.progress',
  route: '/feedback/loading/progress',
};

export const SPINNER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'spinner.section.examples' },
  { anchor: 'variants', labelKey: 'spinner.section.variants' },
  { anchor: 'size-density', labelKey: 'spinner.section.size-density' },
  { anchor: 'determinate', labelKey: 'spinner.section.determinate' },
  { anchor: 'colors', labelKey: 'spinner.section.colors' },
  { anchor: 'loading-zone', labelKey: 'spinner.section.loading-zone' },
  { anchor: 'backdrop', labelKey: 'spinner.section.backdrop' },
  { anchor: 'installation', labelKey: 'spinner.section.installation' },
  { anchor: 'props', labelKey: 'spinner.section.props' },
];

export const SPINNER_SHOWCASE_IMPORT_CODE =
  "import { SolarisSpinnerComponent, SolarisLoadingZoneDirective } from '@educarehq/solaris-ui';";

export const SPINNER_SHOWCASE_BASIC_CODE =
  '<solaris-spinner label="Saving…" />';

export function spinnerVariantCode(variant: string): string {
  return `<solaris-spinner variant="${variant}" />`;
}

export function spinnerSizeDensityCode(size: string, density: string): string {
  return `<solaris-spinner size="${size}" density="${density}" label="Loading…" />`;
}

export function spinnerDeterminateCode(value: string): string {
  return [
    '<solaris-spinner',
    '  variant="progress"',
    `  [value]="${value}"`,
    '  label="Downloading"',
    '  [showPercent]="true"',
    "  [description]=\"['File size: 12 MB', 'Time left: 30 s']\"",
    '></solaris-spinner>',
  ].join('\n');
}

export function spinnerColorCode(color: string): string {
  return `<solaris-spinner color="${color}" />`;
}

export const SPINNER_SHOWCASE_ZONE_CODE = [
  '<form [solaris-loading-zone]="saving()">',
  '  <solaris-form-field label="Institution">',
  '    <input solaris-input value="Solaris" />',
  '  </solaris-form-field>',
  '  @if (saving()) {',
  '    <solaris-spinner overlay label="Saving…" />',
  '  }',
  '</form>',
].join('\n');

export const SPINNER_SHOWCASE_BACKDROP_CODE = [
  '<solaris-spinner',
  '  size="xl"',
  '  backdrop',
  '  label="Loading application…"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SPINNER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
