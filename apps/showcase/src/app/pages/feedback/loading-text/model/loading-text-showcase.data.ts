import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const LOADING_TEXT_SHOWCASE_SLUG = 'loading-text';
export const LOADING_TEXT_TRANSLATION_PREFIX = 'loading-text';

export const LOADING_TEXT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.feedback', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.loading-text' },
  ];

export const LOADING_TEXT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.progress',
  route: '/feedback/loading/progress',
};

export const LOADING_TEXT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.form-field',
  route: '/forms/form-field',
};

export const LOADING_TEXT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'loading-text.section.examples' },
  { anchor: 'size-density', labelKey: 'loading-text.section.size-density' },
  { anchor: 'colors', labelKey: 'loading-text.section.colors' },
  { anchor: 'dots', labelKey: 'loading-text.section.dots' },
  { anchor: 'clamp', labelKey: 'loading-text.section.clamp' },
  { anchor: 'speeds', labelKey: 'loading-text.section.speeds' },
  { anchor: 'installation', labelKey: 'loading-text.section.installation' },
  { anchor: 'props', labelKey: 'loading-text.section.props' },
];

export const LOADING_TEXT_SHOWCASE_IMPORT_CODE =
  "import { SolarisLoadingTextComponent } from '@educarehq/solaris-ui';";

export const LOADING_TEXT_SHOWCASE_BASIC_CODE = [
  '<solaris-loading-text />',
  '<solaris-loading-text text="Preparing your workspace…" />',
].join('\n');

export function loadingTextSizeDensityCode(
  size: string,
  density: string,
): string {
  return `<solaris-loading-text text="Loading" size="${size}" density="${density}" />`;
}

export function loadingTextColorCode(color: string): string {
  return `<solaris-loading-text text="Loading" color="${color}" />`;
}

export const LOADING_TEXT_SHOWCASE_DOTS_CODE =
  '<solaris-loading-text text="Uploading" dots />';

export function loadingTextClampCode(maxLines: string): string {
  return [
    '<solaris-loading-text',
    '  text="Preparing your workspace and syncing every document…"',
    `  [maxLines]="${maxLines}"`,
    '/>',
  ].join('\n');
}

export function loadingTextSpeedCode(speed: string): string {
  return `<solaris-loading-text text="Loading" speed="${speed}" />`;
}

export { SHOWCASE_INSTALL_COMMANDS as LOADING_TEXT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
