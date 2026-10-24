import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const TOAST_SHOWCASE_SLUG = 'toast';
export const TOAST_TRANSLATION_PREFIX = 'toast';

export const TOAST_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.feedback', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.toast' },
];

export const TOAST_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.alert',
  route: '/feedback/alert',
};

export const TOAST_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.skeleton',
  route: '/feedback/loading/skeleton',
};

export const TOAST_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'toast.section.examples' },
  { anchor: 'variants', labelKey: 'toast.section.variants' },
  { anchor: 'appearance', labelKey: 'toast.section.appearance' },
  { anchor: 'countdown', labelKey: 'toast.section.countdown' },
  { anchor: 'size-density', labelKey: 'toast.section.size-density' },
  { anchor: 'actions', labelKey: 'toast.section.actions' },
  { anchor: 'progress', labelKey: 'toast.section.progress' },
  { anchor: 'positions', labelKey: 'toast.section.positions' },
  { anchor: 'installation', labelKey: 'toast.section.installation' },
  { anchor: 'props', labelKey: 'toast.section.props' },
];

export const TOAST_SHOWCASE_IMPORT_CODE =
  "import { SolarisToastService } from '@solaris-ui/angular';";

export const TOAST_SHOWCASE_BASIC_CODE = [
  'this.toast.success({',
  "  title: 'Registration created',",
  "  description: 'The institution has been registered successfully.',",
  '});',
].join('\n');

export function toastVariantCode(variant: string): string {
  return [
    `this.toast.show({`,
    `  variant: '${variant}',`,
    `  title: 'Toast ${variant}',`,
    `  description: 'This is a ${variant} toast message.',`,
    '});',
  ].join('\n');
}

export function toastAppearanceCode(appearance: string): string {
  return [
    'this.toast.info({',
    `  title: 'Appearance: ${appearance}',`,
    `  description: 'Toast with ${appearance} appearance.',`,
    `  appearance: '${appearance}',`,
    '});',
  ].join('\n');
}

export function toastCountdownCode(countdown: 'bar' | 'text' | 'both'): string {
  return [
    'this.toast.info({',
    `  title: 'Countdown ${countdown}',`,
    `  countdown: '${countdown}',`,
    '  duration: 6000,',
    '});',
  ].join('\n');
}

export function toastSizeDensityCode(size: string, density: string): string {
  return [
    'this.toast.success({',
    `  title: 'Size ${size} / density ${density}',`,
    `  description: 'Card scale follows the adapted size × density matrix.',`,
    `  size: '${size}',`,
    `  density: '${density}',`,
    '});',
  ].join('\n');
}

export const TOAST_SHOWCASE_ACTIONS_CODE = [
  'this.toast.warning({',
  "  title: 'Unsaved changes',",
  "  description: 'You have unsaved changes. Do you want to continue?',",
  '  actions: [',
  "    { label: 'Undo', appearance: 'outline', action: (ref) => ref.dismiss() },",
  "    { label: 'Dismiss', appearance: 'solid', color: 'primary', closeOnClick: true, action: (ref) => ref.dismiss() },",
  '  ],',
  '});',
].join('\n');

export const TOAST_SHOWCASE_PROGRESS_CODE = [
  'const ref = this.toast.loading({',
  "  title: 'Uploading...',",
  '  progress: 0,',
  '  persistent: true,',
  '});',
  '// …',
  'ref.update({ progress: 100 });',
].join('\n');

export const TOAST_SHOWCASE_PROMISE_CODE = [
  'this.toast.promise(fetch(`/api/save`), {',
  "  loading: { title: 'Saving…' },",
  "  success: { title: 'Saved!', variant: 'success' },",
  "  error: { title: 'Save failed', variant: 'danger' },",
  '});',
].join('\n');

export const TOAST_SHOWCASE_POSITIONS_CODE = [
  'this.toast.success({',
  "  title: 'Position: top-end',",
  "  position: 'top-end',",
  '  duration: 3000,',
  '});',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as TOAST_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
