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
  { labelKey: 'shell.sidebar.item.buttons' },
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
  { anchor: 'async', labelKey: 'button.section.async' },
  { anchor: 'states', labelKey: 'button.section.states' },
  { anchor: 'custom', labelKey: 'button.section.custom' },
  { anchor: 'installation', labelKey: 'button.section.installation' },
  { anchor: 'props', labelKey: 'button.section.props' },
];

export const BUTTON_SHOWCASE_IMPORT_CODE =
  "import { SolarisButtonDirective } from '@solaris-ui/angular';";

export const BUTTON_SHOWCASE_BASIC_CODE = [
  '<button solaris-button>',
  "  {{ 'button.example.basic.default' | translate }}",
  '</button>',
].join('\n');

export const BUTTON_SHOWCASE_CUSTOM_HTML_CODE = [
  "@if (variant() === 'amber') {",
  '  <div class="custom-button-example__amber">',
  '    <button solaris-button color="custom">',
  "      {{ 'button.example.custom.label' | translate }}",
  '    </button>',
  '  </div>',
  '} @else {',
  '  <div class="custom-button-example__violet">',
  '    <button solaris-button color="custom">',
  "      {{ 'button.example.custom.label' | translate }}",
  '    </button>',
  '  </div>',
  '}',
].join('\n');

export const BUTTON_SHOWCASE_CUSTOM_SCSS_CODE = [
  '.custom-button-example__violet [solaris-button] {',
  '  --solaris-button-custom-color: #ffffff;',
  '  --solaris-button-custom-background: #9333ea;',
  '  --solaris-button-custom-border-color: #9333ea;',
  '  --solaris-button-custom-hover-background: #7e22ce;',
  '  --solaris-button-custom-hover-border-color: #7e22ce;',
  '  --solaris-button-custom-active-background: #6b21a8;',
  '  --solaris-button-custom-active-border-color: #6b21a8;',
  '}',
  '',
  '.custom-button-example__amber [solaris-button] {',
  '  --solaris-button-custom-color: #17191e;',
  '  --solaris-button-custom-background: #f59e0b;',
  '  --solaris-button-custom-border-color: #f59e0b;',
  '  --solaris-button-custom-hover-background: #d97706;',
  '  --solaris-button-custom-hover-border-color: #d97706;',
  '  --solaris-button-custom-active-background: #b45309;',
  '  --solaris-button-custom-active-border-color: #b45309;',
  '}',
].join('\n');

export const BUTTON_SHOWCASE_MOTION_CODE = [
  '<button solaris-button color="primary" [loading]="loading()">',
  '  @if (longLabel()) {',
  "    {{ 'button.example.motion.long' | translate }}",
  '  } @else {',
  "    {{ 'button.example.motion.short' | translate }}",
  '  }',
  '</button>',
].join('\n');

export const BUTTON_SHOWCASE_MOTION_TS_CODE = [
  "import { Component, input } from '@angular/core';",
  '',
  'import {',
  '  SolarisButtonDirective,',
  '  SolarisTranslatePipe,',
  "} from '@solaris-ui/angular';",
  '',
  '@Component({',
  '  standalone: true,',
  "  selector: 'app-motion-button-example',",
  '  imports: [SolarisButtonDirective, SolarisTranslatePipe],',
  "  templateUrl: './motion.component.html',",
  '})',
  'export class MotionButtonExample {',
  '  readonly loading = input(false);',
  '  readonly longLabel = input(false);',
  '}',
].join('\n');

export const BUTTON_SHOWCASE_ASYNC_HTML_CODE = [
  '<button',
  '  solaris-button',
  '  color="primary"',
  '  [action]="save"',
  '  (actionSuccess)="onSuccess()"',
  '  (actionError)="onFailure()"',
  '>',
  "  {{ 'button.example.async.save' | translate }}",
  '</button>',
  "@if (status() === 'success') {",
  "  <p>{{ 'button.example.async.success' | translate }}</p>",
  "} @else if (status() === 'failure') {",
  "  <p>{{ 'button.example.async.failure' | translate }}</p>",
  '}',
].join('\n');

export const BUTTON_SHOWCASE_ASYNC_TS_CODE = [
  "import { Component, signal } from '@angular/core';",
  '',
  'import {',
  '  SolarisButtonDirective,',
  '  SolarisTranslatePipe,',
  "} from '@solaris-ui/angular';",
  '',
  '@Component({',
  '  standalone: true,',
  "  selector: 'app-async-button-example',",
  '  imports: [SolarisButtonDirective, SolarisTranslatePipe],',
  "  templateUrl: './async.component.html',",
  '})',
  'export class AsyncButtonExample {',
  "  protected readonly status = signal<'idle' | 'success' | 'failure'>('idle');",
  '',
  '  protected save = () =>',
  '    new Promise<unknown>((resolve) => {',
  "      setTimeout(() => resolve('saved'), 1200);",
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

export const BUTTON_SHOWCASE_APPEARANCES: readonly SolarisButtonAppearance[] = [
  'solid',
  'outline',
  'ghost',
  'tonal',
  'surface',
  'gradient',
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
