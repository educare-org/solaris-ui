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
    { labelKey: 'shell.sidebar.item.buttons' },
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
  { anchor: 'async', labelKey: 'icon-button.section.async' },
  { anchor: 'states', labelKey: 'icon-button.section.states' },
  { anchor: 'badge', labelKey: 'icon-button.section.badge' },
  { anchor: 'custom', labelKey: 'icon-button.section.custom' },
  { anchor: 'installation', labelKey: 'icon-button.section.installation' },
  { anchor: 'props', labelKey: 'icon-button.section.props' },
];

export const ICON_BUTTON_SHOWCASE_IMPORT_CODE =
  "import { SolarisIconButtonDirective } from '@solaris-ui/angular';";

export const ICON_BUTTON_SHOWCASE_BADGE_CODE = [
  '<button solaris-icon-button aria-label="Notifications, 3 new">',
  '  <solaris-icon name="notification" [decorative]="true" />',
  '  <solaris-badge',
  '    solaris-icon-button-badge',
  '    variant="count"',
  '    color="danger"',
  '    size="sm"',
  '  >',
  '    3',
  '  </solaris-badge>',
  '</button>',
].join('\n');

export const ICON_BUTTON_SHOWCASE_MOTION_HTML_CODE = [
  '<button',
  '  solaris-icon-button',
  '  color="primary"',
  '  [loading]="loading()"',
  '  aria-label="Notifications, 3 new"',
  '>',
  '  <solaris-icon name="notification" [decorative]="true" />',
  '  @if (showBadge()) {',
  '    <solaris-badge',
  '      solaris-icon-button-badge',
  '      variant="count"',
  '      color="danger"',
  '      size="sm"',
  '    >',
  '      3',
  '    </solaris-badge>',
  '  }',
  '</button>',
].join('\n');

export const ICON_BUTTON_SHOWCASE_MOTION_TS_CODE = [
  "import { Component, input } from '@angular/core';",
  '',
  'import {',
  '  SolarisBadgeComponent,',
  '  SolarisIconButtonBadgeDirective,',
  '  SolarisIconButtonDirective,',
  '  SolarisIconComponent,',
  "} from '@solaris-ui/angular';",
  '',
  '@Component({',
  '  standalone: true,',
  "  selector: 'app-motion-icon-button-example',",
  '  imports: [',
  '    SolarisBadgeComponent,',
  '    SolarisIconButtonBadgeDirective,',
  '    SolarisIconButtonDirective,',
  '    SolarisIconComponent,',
  '  ],',
  "  templateUrl: './motion.component.html',",
  '})',
  'export class MotionIconButtonExample {',
  '  readonly loading = input(false);',
  '  readonly showBadge = input(true);',
  '}',
].join('\n');

export const ICON_BUTTON_SHOWCASE_ASYNC_HTML_CODE = [
  '<button',
  '  solaris-icon-button',
  '  color="primary"',
  '  aria-label="Refresh"',
  '  [action]="refresh"',
  '  (actionSuccess)="onSuccess()"',
  '  (actionError)="onFailure()"',
  '>',
  '  <solaris-icon name="refresh" [decorative]="true" />',
  '</button>',
  "@if (status() === 'success') {",
  "  <p>{{ 'icon-button.example.async.success' | translate }}</p>",
  "} @else if (status() === 'failure') {",
  "  <p>{{ 'icon-button.example.async.failure' | translate }}</p>",
  '}',
].join('\n');

export const ICON_BUTTON_SHOWCASE_ASYNC_TS_CODE = [
  "import { Component, signal } from '@angular/core';",
  '',
  'import {',
  '  SolarisIconButtonDirective,',
  '  SolarisIconComponent,',
  '  SolarisTranslatePipe,',
  "} from '@solaris-ui/angular';",
  '',
  '@Component({',
  '  standalone: true,',
  "  selector: 'app-async-icon-button-example',",
  '  imports: [',
  '    SolarisIconButtonDirective,',
  '    SolarisIconComponent,',
  '    SolarisTranslatePipe,',
  '  ],',
  "  templateUrl: './async.component.html',",
  '})',
  'export class AsyncIconButtonExample {',
  "  protected readonly status = signal<'idle' | 'success' | 'failure'>('idle');",
  '',
  '  protected refresh = () =>',
  '    new Promise<unknown>((resolve) => {',
  "      setTimeout(() => resolve('refreshed'), 1200);",
  '    });',
  '',
  '  protected onSuccess(): void {',
  "    this.status.set('success');",
  '  }',
  '',
  '  protected onFailure(): void {',
  "    this.status.set('failure');",
  '  }',
  '}',
].join('\n');

export const ICON_BUTTON_SHOWCASE_CUSTOM_HTML_CODE = [
  '<div class="custom-icon-button-example__violet">',
  '  <button solaris-icon-button color="custom" aria-label="Custom violet">',
  '    <solaris-icon name="info" [decorative]="true" />',
  '  </button>',
  '</div>',
].join('\n');

export const ICON_BUTTON_SHOWCASE_CUSTOM_SCSS_CODE = [
  '.custom-icon-button-example__violet [solaris-icon-button] {',
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
  ['solid', 'outline', 'ghost', 'tonal', 'surface', 'gradient'];

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
