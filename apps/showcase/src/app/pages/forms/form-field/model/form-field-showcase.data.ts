import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const FORM_FIELD_SHOWCASE_SLUG = 'form-field';
export const FORM_FIELD_TRANSLATION_PREFIX = 'form-field';

export const FORM_FIELD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.form-field' },
  ];

export const FORM_FIELD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.loading-text',
  route: '/feedback/loading/loading-text',
};

export const FORM_FIELD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.input',
  route: '/forms/input',
};

export const FORM_FIELD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'form-field.section.examples' },
  { anchor: 'label', labelKey: 'form-field.section.label' },
  { anchor: 'hint', labelKey: 'form-field.section.hint' },
  { anchor: 'error', labelKey: 'form-field.section.error' },
  { anchor: 'validation', labelKey: 'form-field.section.validation' },
  { anchor: 'optional', labelKey: 'form-field.section.optional' },
  { anchor: 'prefix-suffix', labelKey: 'form-field.section.prefix-suffix' },
  { anchor: 'appearances', labelKey: 'form-field.section.appearances' },
  { anchor: 'size-density', labelKey: 'form-field.section.size-density' },
  { anchor: 'radius', labelKey: 'form-field.section.radius' },
  { anchor: 'states', labelKey: 'form-field.section.states' },
  { anchor: 'counter', labelKey: 'form-field.section.counter' },
  { anchor: 'loading', labelKey: 'form-field.section.loading' },
  { anchor: 'installation', labelKey: 'form-field.section.installation' },
  { anchor: 'props', labelKey: 'form-field.section.props' },
];

export const FORM_FIELD_SHOWCASE_IMPORT_CODE =
  "import { SolarisFormFieldComponent, SolarisInputDirective } from '@solaris-ui/angular';";

export const FORM_FIELD_SHOWCASE_BASIC_CODE = [
  '<solaris-form-field label="Name">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_LABEL_INPUT_CODE = [
  '<solaris-form-field label="Email">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_LABEL_PROJECTED_CODE = [
  '<solaris-form-field>',
  '  <solaris-form-label>Custom Label</solaris-form-label>',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_HINT_INPUT_CODE = [
  '<solaris-form-field label="Password" hint="Use at least 8 characters.">',
  '  <input solaris-input type="password" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_HINT_PROJECTED_CODE = [
  '<solaris-form-field label="Password">',
  '  <input solaris-input type="password" />',
  '  <solaris-form-hint>Projected: use at least 8 characters.</solaris-form-hint>',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_ERROR_INPUT_CODE = [
  '<solaris-form-field label="Email" error="Enter a valid email." [invalid]="true">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_ERROR_PROJECTED_CODE = [
  '<solaris-form-field label="Email" [invalid]="true">',
  '  <input solaris-input />',
  '  <solaris-form-error>Projected: enter a valid email.</solaris-form-error>',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_AUTO_INVALID_CODE = [
  '<solaris-form-field label="Required Email">',
  '  <input solaris-input [formControl]="emailControl" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_MANUAL_INVALID_CODE = [
  '<solaris-form-field label="Custom Error" error="This field has a custom error." [invalid]="true">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_OPTIONAL_CODE = [
  '<solaris-form-field label="Nickname" [optional]="true">',
  '  <input solaris-input />',
  '</solaris-form-field>',
  '<solaris-form-field label="Phone" [optional]="true" optionalLabel="(optional)">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_REQUIRED_CODE = [
  '<solaris-form-field label="Password" [required]="true">',
  '  <input solaris-input type="password" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_AFFIX_CODE = [
  '<solaris-form-field label="Price">',
  '  <span solaris-form-prefix>$</span>',
  '  <input solaris-input />',
  '  <span solaris-form-suffix>USD</span>',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_PREFIX_ICON_CODE = [
  '<solaris-form-field label="Search">',
  '  <solaris-icon solaris-form-prefix name="search" [decorative]="true" />',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_AFFIX_ICONS_CODE = [
  '<solaris-form-field label="Search">',
  '  <solaris-icon solaris-form-prefix name="search" [decorative]="true" />',
  '  <input solaris-input />',
  '  <solaris-icon solaris-form-suffix name="info" [decorative]="true" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_PREFIX_INPUT_CODE = [
  '<solaris-form-field label="Email" prefix="mail">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-form-field label="Email">',
  '  <input solaris-input />',
  '  <button solaris-button solaris-form-suffix-action size="sm">Register</button>',
  '</solaris-form-field>',
].join('\n');

function formFieldAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-form-field label="${label}" appearance="${appearance}">`,
    '  <input solaris-input />',
    '</solaris-form-field>',
  ].join('\n');
}

export const FORM_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  formFieldAppearanceCode('outline');
export const FORM_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE =
  formFieldAppearanceCode('surface');
export const FORM_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE =
  formFieldAppearanceCode('filled');

function formFieldRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-form-field label="${label}" radius="${radius}" prefix="search">`,
    '  <input solaris-input />',
    '</solaris-form-field>',
  ].join('\n');
}

export const FORM_FIELD_SHOWCASE_RADIUS_NONE_CODE = formFieldRadiusCode('none');
export const FORM_FIELD_SHOWCASE_RADIUS_SM_CODE = formFieldRadiusCode('sm');
export const FORM_FIELD_SHOWCASE_RADIUS_MD_CODE = formFieldRadiusCode('md');
export const FORM_FIELD_SHOWCASE_RADIUS_LG_CODE = formFieldRadiusCode('lg');
export const FORM_FIELD_SHOWCASE_RADIUS_XL_CODE = formFieldRadiusCode('xl');

export const FORM_FIELD_SHOWCASE_STATES_CODE = [
  '<solaris-form-field label="Disabled Field" [disabled]="true">',
  '  <input solaris-input value="Cannot edit" />',
  '</solaris-form-field>',
  '<solaris-form-field label="Readonly Field" [readonly]="true">',
  '  <input solaris-input value="Read only value" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_COUNTER_CODE = [
  '<solaris-form-field label="Limited to 20 characters">',
  '  <input solaris-input maxlength="20" />',
  '</solaris-form-field>',
].join('\n');

export const FORM_FIELD_SHOWCASE_LOADING_CODE = [
  '<solaris-form-field label="Postal code" [loading]="true">',
  '  <input solaris-input />',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as FORM_FIELD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
