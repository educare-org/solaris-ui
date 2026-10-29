import type {
  SolarisButtonAppearance,
  SolarisButtonColor,
  SolarisButtonRadius,
} from '@solaris-ui/angular';

import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const BUTTON_SHOWCASE_SLUG = 'button';
export const BUTTON_TRANSLATION_PREFIX = 'button';

export const BUTTON_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.actions', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.button' },
];

export const BUTTON_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.icons',
  route: '/icons',
};

export const BUTTON_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.icon-button',
  route: '/actions/icon-button',
};

export const BUTTON_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'button.section.examples' },
  { anchor: 'appearances', labelKey: 'button.section.appearances' },
  { anchor: 'size-density', labelKey: 'button.section.size-density' },
  { anchor: 'shape-radius', labelKey: 'button.section.shape-radius' },
  { anchor: 'icons', labelKey: 'button.section.icons' },
  { anchor: 'motion', labelKey: 'button.section.motion' },
  { anchor: 'states', labelKey: 'button.section.states' },
  { anchor: 'custom', labelKey: 'button.section.custom' },
  { anchor: 'layout', labelKey: 'button.section.layout' },
  { anchor: 'installation', labelKey: 'button.section.installation' },
  { anchor: 'props', labelKey: 'button.section.props' },
];

export const BUTTON_SHOWCASE_IMPORT_CODE =
  "import { SolarisButtonDirective } from '@solaris-ui/angular';";

export const BUTTON_SHOWCASE_BASIC_CODE = [
  '<button solaris-button>Default</button>',
  '<button solaris-button color="primary">Primary</button>',
  '<button solaris-button appearance="outline">Outline</button>',
].join('\n');

export const BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE = [
  '.my-custom-button [solaris-button] {',
  '  --solaris-button-custom-color: #ffffff;',
  '  --solaris-button-custom-background: #9333ea;',
  '  --solaris-button-custom-border-color: #9333ea;',
  '  --solaris-button-custom-hover-background: #7e22ce;',
  '  --solaris-button-custom-hover-border-color: #7e22ce;',
  '  --solaris-button-custom-active-background: #6b21a8;',
  '  --solaris-button-custom-active-border-color: #6b21a8;',
  '}',
].join('\n');

export const BUTTON_SHOWCASE_CUSTOM_AMBER_CODE = [
  '.my-custom-button [solaris-button] {',
  '  --solaris-button-custom-color: #17191e;',
  '  --solaris-button-custom-background: #f59e0b;',
  '  --solaris-button-custom-border-color: #f59e0b;',
  '  --solaris-button-custom-hover-background: #d97706;',
  '  --solaris-button-custom-hover-border-color: #d97706;',
  '  --solaris-button-custom-active-background: #b45309;',
  '  --solaris-button-custom-active-border-color: #b45309;',
  '}',
].join('\n');

export const BUTTON_SHOWCASE_ANCHOR_CODE = [
  '<a solaris-button href="/dashboard">Dashboard</a>',
  '<a solaris-button href="/dashboard" [disabled]="true">Dashboard</a>',
].join('\n');

export const BUTTON_SHOWCASE_FULL_WIDTH_CODE = [
  '<button solaris-button [fullWidth]="true" color="primary">',
  '  Sign in with email',
  '</button>',
].join('\n');

export const BUTTON_SHOWCASE_MOTION_CODE = [
  '<button solaris-button color="primary" [loading]="loading">',
  '  Save changes',
  '</button>',
].join('\n');

/**
 * Static option lists for the Button showcase selectors.
 * Kept outside the page component so the component only holds
 * signals, computed snippets, and page actions.
 */
export const BUTTON_SHOWCASE_APPEARANCES: readonly SolarisButtonAppearance[] = [
  'solid',
  'outline',
  'ghost',
  'tonal',
  'surface',
];

export const BUTTON_SHOWCASE_COLORS: readonly SolarisButtonColor[] = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];

export const BUTTON_SHOWCASE_RADII: readonly SolarisButtonRadius[] = [
  'none',
  'sm',
  'md',
  'lg',
  'full',
];

export { SHOWCASE_INSTALL_COMMANDS as BUTTON_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
