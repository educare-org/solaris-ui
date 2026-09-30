import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SKELETON_SHOWCASE_SLUG = 'skeleton';
export const SKELETON_TRANSLATION_PREFIX = 'skeleton';

export const SKELETON_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.feedback', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.skeleton' },
  ];

export const SKELETON_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.toast',
  route: '/feedback/toast',
};

export const SKELETON_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.spinner',
  route: '/feedback/loading/spinner',
};

export const SKELETON_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'skeleton.section.examples' },
  { anchor: 'variants', labelKey: 'skeleton.section.variants' },
  { anchor: 'animations', labelKey: 'skeleton.section.animations' },
  { anchor: 'size-density', labelKey: 'skeleton.section.size-density' },
  { anchor: 'multiline', labelKey: 'skeleton.section.multiline' },
  { anchor: 'composition', labelKey: 'skeleton.section.composition' },
  { anchor: 'advanced', labelKey: 'skeleton.section.advanced' },
  { anchor: 'installation', labelKey: 'skeleton.section.installation' },
  { anchor: 'props', labelKey: 'skeleton.section.props' },
];

export const SKELETON_SHOWCASE_IMPORT_CODE =
  "import { SolarisSkeletonComponent } from '@educarehq/solaris-ui';";

export const SKELETON_SHOWCASE_BASIC_CODE = [
  '<solaris-skeleton />',
  '<solaris-skeleton variant="rectangular" />',
  '<solaris-skeleton variant="circular" />',
].join('\n');

export function skeletonVariantCode(variant: string): string {
  return `<solaris-skeleton variant="${variant}" />`;
}

export function skeletonAnimationCode(animation: string): string {
  return `<solaris-skeleton animation="${animation}" />`;
}

export function skeletonSizeDensityCode(size: string, density: string): string {
  return [
    `<solaris-skeleton size="${size}" density="${density}" />`,
    `<solaris-skeleton variant="rectangular" size="${size}" density="${density}" />`,
    `<solaris-skeleton variant="circular" size="${size}" density="${density}" />`,
  ].join('\n');
}

export function skeletonMultilineCode(lines: string): string {
  return `<solaris-skeleton [lines]="${lines}" />`;
}

export const SKELETON_SHOWCASE_DELAY_CODE =
  '<solaris-skeleton [delay]="600" />';

export function skeletonPresetCode(
  preset: 'profile' | 'dashboard' | 'list-row' | 'media-block',
): string {
  switch (preset) {
    case 'dashboard':
      return SKELETON_SHOWCASE_DASHBOARD_CODE;
    case 'list-row':
      return SKELETON_SHOWCASE_LIST_CODE;
    case 'media-block':
      return SKELETON_SHOWCASE_MEDIA_CODE;
    case 'profile':
    default:
      return SKELETON_SHOWCASE_PROFILE_CODE;
  }
}

export function skeletonDurationCode(duration: string): string {
  return [
    '<solaris-skeleton',
    '  animation="wave"',
    `  [duration]="'${duration}'"`,
    '></solaris-skeleton>',
  ].join('\n');
}

export const SKELETON_SHOWCASE_ASPECT_CODE = [
  '<solaris-skeleton',
  '  variant="rectangular"',
  '  width="100%"',
  '  aspectRatio="16 / 9"',
  '></solaris-skeleton>',
].join('\n');

export const SKELETON_SHOWCASE_PROFILE_CODE = [
  '<section aria-busy="true" aria-label="Loading profile">',
  '  <solaris-skeleton variant="circular" size="lg"></solaris-skeleton>',
  '  <solaris-skeleton [lines]="3"></solaris-skeleton>',
  '</section>',
].join('\n');

export const SKELETON_SHOWCASE_DASHBOARD_CODE = [
  '<section aria-busy="true" aria-label="Loading dashboard card">',
  '  <solaris-skeleton variant="rectangular" height="160px">',
  '  </solaris-skeleton>',
  '  <solaris-skeleton width="60%"></solaris-skeleton>',
  '  <solaris-skeleton width="85%"></solaris-skeleton>',
  '</section>',
].join('\n');

export const SKELETON_SHOWCASE_LIST_CODE = [
  '<section aria-busy="true" aria-label="Loading list row">',
  '  <solaris-skeleton variant="circular" size="sm"></solaris-skeleton>',
  '  <solaris-skeleton width="50%"></solaris-skeleton>',
  '  <solaris-skeleton width="30%"></solaris-skeleton>',
  '</section>',
].join('\n');

export const SKELETON_SHOWCASE_MEDIA_CODE = [
  '<section aria-busy="true" aria-label="Loading media block">',
  '  <solaris-skeleton',
  '    variant="rectangular"',
  '    width="100%"',
  '    aspectRatio="16 / 9"',
  '  ></solaris-skeleton>',
  '  <solaris-skeleton width="90%"></solaris-skeleton>',
  '  <solaris-skeleton width="50%"></solaris-skeleton>',
  '</section>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SKELETON_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
