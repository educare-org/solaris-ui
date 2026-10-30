import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const BUTTON_GROUP_SHOWCASE_SLUG = 'button-group';
export const BUTTON_GROUP_TRANSLATION_PREFIX = 'button-group';

export const BUTTON_GROUP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.buttons' },
    { labelKey: 'shell.sidebar.item.button-group' },
  ];

export const BUTTON_GROUP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.icon-button',
  route: '/actions/icon-button',
};

export const BUTTON_GROUP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.month-view',
  route: '/scheduling/month-view',
};

export const BUTTON_GROUP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'basic', labelKey: 'button-group.section.basic' },
  { anchor: 'size-density', labelKey: 'button-group.section.size-density' },
  { anchor: 'orientation', labelKey: 'button-group.section.orientation' },
  { anchor: 'attached', labelKey: 'button-group.section.attached' },
  { anchor: 'mixed', labelKey: 'button-group.section.mixed' },
  { anchor: 'motion', labelKey: 'button-group.section.motion' },
  { anchor: 'states', labelKey: 'button-group.section.states' },
  { anchor: 'full-width', labelKey: 'button-group.section.full-width' },
  { anchor: 'installation', labelKey: 'button-group.section.installation' },
  { anchor: 'props', labelKey: 'button-group.section.props' },
];

export const BUTTON_GROUP_SHOWCASE_IMPORT_CODE =
  "import { SolarisButtonGroupComponent } from '@solaris-ui/angular';";

export const BUTTON_GROUP_SHOWCASE_BASIC_CODE = [
  '<solaris-button-group',
  '  [aria-label]="\'button-group.example.editorActions\' | translate"',
  '>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.edit' | translate }}",
  '  </button>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.duplicate' | translate }}",
  '  </button>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.delete' | translate }}",
  '  </button>',
  '</solaris-button-group>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_MIXED_CODE = [
  '<solaris-button-group',
  '  [aria-label]="\'button-group.example.saveActions\' | translate"',
  '>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.copyPage' | translate }}",
  '  </button>',
  '  <button',
  '    solaris-icon-button',
  '    [aria-label]="\'button-group.example.moreSaveActions\' | translate"',
  '  >',
  '    <solaris-icon name="chevron-down" [decorative]="true" />',
  '  </button>',
  '</solaris-button-group>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_STATES_DISABLED_CODE = [
  '<solaris-button-group',
  '  [aria-label]="\'button-group.example.editorActions\' | translate"',
  '>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.edit' | translate }}",
  '  </button>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.duplicate' | translate }}",
  '  </button>',
  '  <button solaris-button [disabled]="true">',
  "    {{ 'button-group.example.delete' | translate }}",
  '  </button>',
  '</solaris-button-group>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_STATES_LOADING_CODE = [
  '<solaris-button-group',
  '  [aria-label]="\'button-group.example.loadingActions\' | translate"',
  '>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.save' | translate }}",
  '  </button>',
  '  <button solaris-button [loading]="true">',
  "    {{ 'button-group.example.loading' | translate }}",
  '  </button>',
  '</solaris-button-group>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_FULL_WIDTH_CODE = [
  '<div class="full-width-button-group-example__row">',
  '  <solaris-button-group',
  '    [aria-label]="\'button-group.example.formActions\' | translate"',
  '    [fullWidth]="true"',
  '  >',
  '    <button solaris-button>',
  "      {{ 'button-group.example.cancel' | translate }}",
  '    </button>',
  '    <button solaris-button color="primary">',
  "      {{ 'button-group.example.submit' | translate }}",
  '    </button>',
  '  </solaris-button-group>',
  '</div>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_MOTION_HTML_CODE = [
  '<solaris-button-group',
  '  [aria-label]="\'button-group.example.saveActions\' | translate"',
  '>',
  '  <button solaris-button>',
  "    {{ 'button-group.example.save' | translate }}",
  '  </button>',
  '  <button solaris-button [loading]="loading()">',
  "    {{ 'button-group.example.saveChanges' | translate }}",
  '  </button>',
  '</solaris-button-group>',
].join('\n');

export const BUTTON_GROUP_SHOWCASE_MOTION_TS_CODE = [
  "import { Component, input } from '@angular/core';",
  '',
  'import {',
  '  SolarisButtonDirective,',
  '  SolarisButtonGroupComponent,',
  '  SolarisTranslatePipe,',
  "} from '@solaris-ui/angular';",
  '',
  '@Component({',
  '  standalone: true,',
  "  selector: 'app-motion-button-group-example',",
  '  imports: [',
  '    SolarisButtonDirective,',
  '    SolarisButtonGroupComponent,',
  '    SolarisTranslatePipe,',
  '  ],',
  "  templateUrl: './motion.component.html',",
  '})',
  'export class MotionButtonGroupExample {',
  '  readonly loading = input(false);',
  '}',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
