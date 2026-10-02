import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const CHECKBOX_SHOWCASE_SLUG = 'checkbox';
export const CHECKBOX_TRANSLATION_PREFIX = 'checkbox';

export const CHECKBOX_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.checkbox' },
  ];

export const CHECKBOX_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.otp-input',
  route: '/forms/otp-input',
};

export const CHECKBOX_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.checkbox-group',
  route: '/forms/checkbox-group',
};

export const CHECKBOX_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'checkbox.section.examples' },
  { anchor: 'indeterminate', labelKey: 'checkbox.section.indeterminate' },
  { anchor: 'appearances', labelKey: 'checkbox.section.appearances' },
  { anchor: 'size-density', labelKey: 'checkbox.section.size-density' },
  { anchor: 'color', labelKey: 'checkbox.section.color' },
  { anchor: 'radius', labelKey: 'checkbox.section.radius' },
  { anchor: 'states', labelKey: 'checkbox.section.states' },
  { anchor: 'form', labelKey: 'checkbox.section.form' },
  { anchor: 'installation', labelKey: 'checkbox.section.installation' },
  { anchor: 'props', labelKey: 'checkbox.section.props' },
];

export const CHECKBOX_SHOWCASE_IMPORT_CODE =
  "import { SolarisCheckboxComponent } from '@solaris-ui/angular';";

export const CHECKBOX_SHOWCASE_BASIC_CODE = [
  '<solaris-checkbox>Unchecked</solaris-checkbox>',
  '<solaris-checkbox [checked]="true">Checked</solaris-checkbox>',
].join('\n');

export const CHECKBOX_SHOWCASE_INDETERMINATE_CODE = [
  '<solaris-checkbox',
  '  [checked]="allSelected()"',
  '  [indeterminate]="someSelected()"',
  '  (checkedChange)="toggleAllSelected()"',
  '>',
  '  Select all',
  '</solaris-checkbox>',
].join('\n');

export const CHECKBOX_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<solaris-checkbox appearance="surface">Surface</solaris-checkbox>',
].join('\n');

export const CHECKBOX_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<solaris-checkbox appearance="outline">Outline</solaris-checkbox>',
].join('\n');

function checkboxColorCode(color: string): string {
  const label = color.charAt(0).toUpperCase() + color.slice(1);
  return `<solaris-checkbox color="${color}">${label}</solaris-checkbox>`;
}

export const CHECKBOX_SHOWCASE_COLOR_NEUTRAL_CODE =
  checkboxColorCode('neutral');
export const CHECKBOX_SHOWCASE_COLOR_PRIMARY_CODE =
  checkboxColorCode('primary');
export const CHECKBOX_SHOWCASE_COLOR_SUCCESS_CODE =
  checkboxColorCode('success');
export const CHECKBOX_SHOWCASE_COLOR_WARNING_CODE =
  checkboxColorCode('warning');
export const CHECKBOX_SHOWCASE_COLOR_DANGER_CODE = checkboxColorCode('danger');
export const CHECKBOX_SHOWCASE_COLOR_INFO_CODE = checkboxColorCode('info');
export const CHECKBOX_SHOWCASE_COLOR_CUSTOM_CODE = [
  '<solaris-checkbox color="custom" [checked]="true">Custom</solaris-checkbox>',
].join('\n');

function checkboxRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return `<solaris-checkbox radius="${radius}">${label}</solaris-checkbox>`;
}

export const CHECKBOX_SHOWCASE_RADIUS_SM_CODE = checkboxRadiusCode('sm');
export const CHECKBOX_SHOWCASE_RADIUS_MD_CODE = checkboxRadiusCode('md');
export const CHECKBOX_SHOWCASE_RADIUS_LG_CODE = checkboxRadiusCode('lg');
export const CHECKBOX_SHOWCASE_RADIUS_FULL_CODE = checkboxRadiusCode('full');

export const CHECKBOX_SHOWCASE_STATES_CODE = [
  '<solaris-checkbox [disabled]="true">Disabled</solaris-checkbox>',
  '<solaris-checkbox [checked]="true" [disabled]="true">',
  '  Disabled checked',
  '</solaris-checkbox>',
  '<solaris-checkbox [readonly]="true">Readonly</solaris-checkbox>',
  '<solaris-checkbox [invalid]="true">Invalid</solaris-checkbox>',
  '<solaris-checkbox [required]="true">Required</solaris-checkbox>',
].join('\n');

export const CHECKBOX_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Accept terms" hint="You must accept the terms.">',
  '  <solaris-checkbox formControlName="terms" [required]="true">',
  '    Accept terms of use',
  '  </solaris-checkbox>',
  '</solaris-form-field>',
].join('\n');

export const CHECKBOX_SHOWCASE_REACTIVE_CODE = [
  '<solaris-checkbox [formControl]="acceptControl">',
  '  Accept',
  '</solaris-checkbox>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as CHECKBOX_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
