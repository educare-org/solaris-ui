import type {
  SolarisIconButtonAppearance,
  SolarisIconButtonColor,
  SolarisIconButtonRadius,
} from '@solaris-ui/angular';

import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const ICON_BUTTON_SHOWCASE_SLUG = 'icon-button';
export const ICON_BUTTON_TRANSLATION_PREFIX = 'icon-button';

export const ICON_BUTTON_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.actions', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.icon-button' },
  ];

export const ICON_BUTTON_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.button',
  route: '/actions/button',
};

export const ICON_BUTTON_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.button-group',
  route: '/actions/button-group',
};

export const ICON_BUTTON_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'appearances', labelKey: 'icon-button.section.appearances' },
  { anchor: 'size-density', labelKey: 'icon-button.section.size-density' },
  { anchor: 'shape-radius', labelKey: 'icon-button.section.shape-radius' },
  { anchor: 'chromeless', labelKey: 'icon-button.section.chromeless' },
  { anchor: 'motion', labelKey: 'icon-button.section.motion' },
  { anchor: 'states', labelKey: 'icon-button.section.states' },
  { anchor: 'badge', labelKey: 'icon-button.section.badge' },
  { anchor: 'custom', labelKey: 'icon-button.section.custom' },
  { anchor: 'installation', labelKey: 'icon-button.section.installation' },
  { anchor: 'props', labelKey: 'icon-button.section.props' },
];

export const ICON_BUTTON_SHOWCASE_IMPORT_CODE =
  "import { SolarisIconButtonDirective } from '@solaris-ui/angular';";

export const ICON_BUTTON_SHOWCASE_MOTION_CODE = [
  '<button solaris-icon-button color="primary" [loading]="loading" aria-label="Notifications">',
  '  <solaris-icon name="notification" [decorative]="true" />',
  '  <solaris-badge solaris-icon-button-badge variant="count" color="danger" size="sm">3</solaris-badge>',
  '</button>',
].join('\n');

export const ICON_BUTTON_SHOWCASE_CUSTOM_VIOLET_CODE = [
  '.my-custom-icon-button [solaris-icon-button] {',
  '  --solaris-icon-button-custom-color: #ffffff;',
  '  --solaris-icon-button-custom-background: #9333ea;',
  '  --solaris-icon-button-custom-border-color: #9333ea;',
  '  --solaris-icon-button-custom-hover-background: #7e22ce;',
  '  --solaris-icon-button-custom-hover-border-color: #7e22ce;',
  '  --solaris-icon-button-custom-active-background: #6b21a8;',
  '  --solaris-icon-button-custom-active-border-color: #6b21a8;',
  '}',
].join('\n');

export const ICON_BUTTON_SHOWCASE_APPEARANCES: readonly SolarisIconButtonAppearance[] =
  ['solid', 'outline', 'ghost', 'tonal', 'surface'];

export const ICON_BUTTON_SHOWCASE_COLORS: readonly SolarisIconButtonColor[] = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];

export const ICON_BUTTON_SHOWCASE_RADII: readonly SolarisIconButtonRadius[] = [
  'none',
  'sm',
  'md',
  'lg',
  'full',
];

export { SHOWCASE_INSTALL_COMMANDS as ICON_BUTTON_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
