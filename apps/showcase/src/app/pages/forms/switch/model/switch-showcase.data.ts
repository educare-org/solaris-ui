import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SWITCH_SHOWCASE_SLUG = 'switch';
export const SWITCH_TRANSLATION_PREFIX = 'switch';

export const SWITCH_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.switch' },
];

export const SWITCH_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radio-group',
  route: '/forms/radio-group',
};

export const SWITCH_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch-group',
  route: '/forms/switch-group',
};

export const SWITCH_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'switch.section.examples' },
  { anchor: 'appearances', labelKey: 'switch.section.appearances' },
  { anchor: 'size-density', labelKey: 'switch.section.size-density' },
  { anchor: 'color', labelKey: 'switch.section.color' },
  { anchor: 'thumb-content', labelKey: 'switch.section.thumb-content' },
  { anchor: 'group', labelKey: 'switch.section.group' },
  { anchor: 'states', labelKey: 'switch.section.states' },
  { anchor: 'description', labelKey: 'switch.section.description' },
  { anchor: 'form', labelKey: 'switch.section.form' },
  { anchor: 'installation', labelKey: 'switch.section.installation' },
  { anchor: 'props', labelKey: 'switch.section.props' },
];

export const SWITCH_SHOWCASE_IMPORT_CODE =
  "import { SolarisSwitchComponent, SolarisSwitchGroupComponent } from '@solaris-ui/angular';";

export const SWITCH_SHOWCASE_BASIC_CODE = [
  '<solaris-switch [(checked)]="notifications">',
  '  Notifications',
  '</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<solaris-switch appearance="surface">Surface</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<solaris-switch appearance="outline">Outline</solaris-switch>',
].join('\n');

function switchColorCode(color: string): string {
  const label = color.charAt(0).toUpperCase() + color.slice(1);
  return `<solaris-switch color="${color}">${label}</solaris-switch>`;
}

export const SWITCH_SHOWCASE_COLOR_NEUTRAL_CODE = switchColorCode('neutral');
export const SWITCH_SHOWCASE_COLOR_PRIMARY_CODE = switchColorCode('primary');
export const SWITCH_SHOWCASE_COLOR_SUCCESS_CODE = switchColorCode('success');
export const SWITCH_SHOWCASE_COLOR_WARNING_CODE = switchColorCode('warning');
export const SWITCH_SHOWCASE_COLOR_DANGER_CODE = switchColorCode('danger');
export const SWITCH_SHOWCASE_COLOR_INFO_CODE = switchColorCode('info');
export const SWITCH_SHOWCASE_COLOR_CUSTOM_CODE = [
  '<solaris-switch color="custom">Custom</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_THUMB_NONE_CODE = [
  '<solaris-switch>Notifications</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_THUMB_ICON_CODE = [
  '<solaris-switch [(checked)]="enabled" [icon]="enabled() ? \'check\' : \'x\'">',
  '  Notifications',
  '</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_THUMB_TEXT_CODE = [
  '<solaris-switch text="ON">Notifications</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_GROUP_CODE = [
  '<solaris-switch-group size="lg" density="compact">',
  '  <!-- children inherit size/density unless set -->',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms" size="sm">SMS</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_SHOWCASE_STATES_CODE = [
  '<solaris-switch [disabled]="true">Disabled</solaris-switch>',
  '<solaris-switch [checked]="true" [disabled]="true">',
  '  Disabled checked',
  '</solaris-switch>',
  '<solaris-switch [readonly]="true">Readonly</solaris-switch>',
  '<solaris-switch [invalid]="true">Invalid</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_DESCRIPTION_CODE = [
  '<solaris-switch label="Email notifications" description="Get updates about your account." size="sm" />',
  '<solaris-switch label="SMS notifications" description="Get urgent alerts by text message." size="lg" />',
].join('\n');

export const SWITCH_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Notifications" hint="Affects your account.">',
  '  <solaris-switch formControlName="notifications">',
  '    Receive notifications',
  '  </solaris-switch>',
  '</solaris-form-field>',
].join('\n');

export const SWITCH_SHOWCASE_REACTIVE_CODE = [
  '<solaris-switch [formControl]="enableControl">',
  '  Enable feature',
  '</solaris-switch>',
].join('\n');

export const SWITCH_SHOWCASE_CUSTOM_CODE = [
  '<solaris-switch color="custom" [checked]="true">Custom</solaris-switch>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SWITCH_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
