import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const RADIO_SHOWCASE_SLUG = 'radio';
export const RADIO_TRANSLATION_PREFIX = 'radio';

export const RADIO_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.radio' },
];

export const RADIO_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.checkbox-group',
  route: '/forms/checkbox-group',
};

export const RADIO_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radio-group',
  route: '/forms/radio-group',
};

export const RADIO_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'radio.section.examples' },
  { anchor: 'appearances', labelKey: 'radio.section.appearances' },
  { anchor: 'size-density', labelKey: 'radio.section.size-density' },
  { anchor: 'color', labelKey: 'radio.section.color' },
  { anchor: 'label-layout', labelKey: 'radio.section.label-layout' },
  { anchor: 'description', labelKey: 'radio.section.description' },
  { anchor: 'states', labelKey: 'radio.section.states' },
  { anchor: 'form', labelKey: 'radio.section.form' },
  { anchor: 'installation', labelKey: 'radio.section.installation' },
  { anchor: 'props', labelKey: 'radio.section.props' },
];

export const RADIO_SHOWCASE_IMPORT_CODE =
  "import { SolarisRadioComponent, SolarisRadioGroupComponent } from '@solaris-ui/angular';";

export const RADIO_SHOWCASE_BASIC_CODE = [
  '<solaris-radio value="basic">Basic</solaris-radio>',
  '<solaris-radio [checked]="true" value="pro">Pro</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<solaris-radio appearance="surface">Surface</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<solaris-radio appearance="outline">Outline</solaris-radio>',
].join('\n');

function radioColorCode(color: string): string {
  const label = color.charAt(0).toUpperCase() + color.slice(1);
  return `<solaris-radio color="${color}">${label}</solaris-radio>`;
}

export const RADIO_SHOWCASE_COLOR_NEUTRAL_CODE = radioColorCode('neutral');
export const RADIO_SHOWCASE_COLOR_PRIMARY_CODE = radioColorCode('primary');
export const RADIO_SHOWCASE_COLOR_SUCCESS_CODE = radioColorCode('success');
export const RADIO_SHOWCASE_COLOR_WARNING_CODE = radioColorCode('warning');
export const RADIO_SHOWCASE_COLOR_DANGER_CODE = radioColorCode('danger');
export const RADIO_SHOWCASE_COLOR_INFO_CODE = radioColorCode('info');
export const RADIO_SHOWCASE_COLOR_CUSTOM_CODE = [
  '<solaris-radio color="custom" [checked]="true">Custom</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_LABEL_END_CODE = [
  '<solaris-radio value="pro">Pro</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_LABEL_START_CODE = [
  '<solaris-radio value="pro" labelPosition="start">Pro</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_DESCRIPTION_CODE = [
  '<solaris-radio',
  '  value="pro"',
  '  label="Pro"',
  '  description="For growing teams."',
  '/>',
].join('\n');

export const RADIO_SHOWCASE_STATES_CODE = [
  '<solaris-radio [disabled]="true">Disabled</solaris-radio>',
  '<solaris-radio [checked]="true" [disabled]="true">',
  '  Disabled checked',
  '</solaris-radio>',
  '<solaris-radio [readonly]="true">Readonly</solaris-radio>',
  '<solaris-radio [invalid]="true">Invalid</solaris-radio>',
].join('\n');

export const RADIO_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Plan" hint="Select one option.">',
  '  <solaris-radio-group formControlName="plan">',
  '    <solaris-radio value="basic">Basic</solaris-radio>',
  '    <solaris-radio value="pro">Pro</solaris-radio>',
  '  </solaris-radio-group>',
  '</solaris-form-field>',
].join('\n');

export const RADIO_SHOWCASE_REACTIVE_CODE = [
  '<solaris-radio-group [formControl]="planControl">',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as RADIO_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
