import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const INPUT_SHOWCASE_SLUG = 'input';
export const INPUT_TRANSLATION_PREFIX = 'input';

export const INPUT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.input' },
];

export const INPUT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.form-field',
  route: '/forms/form-field',
};

export const INPUT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.textarea',
  route: '/forms/textarea',
};

export const INPUT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'input.section.examples' },
  { anchor: 'form-field', labelKey: 'input.section.form-field' },
  { anchor: 'appearances', labelKey: 'input.section.appearances' },
  { anchor: 'size-density', labelKey: 'input.section.size-density' },
  { anchor: 'radius', labelKey: 'input.section.radius' },
  { anchor: 'states', labelKey: 'input.section.states' },
  { anchor: 'types', labelKey: 'input.section.types' },
  { anchor: 'prefix-suffix', labelKey: 'input.section.prefix-suffix' },
  { anchor: 'form', labelKey: 'input.section.form' },
  { anchor: 'installation', labelKey: 'input.section.installation' },
  { anchor: 'props', labelKey: 'input.section.props' },
];

export const INPUT_SHOWCASE_IMPORT_CODE =
  "import { SolarisInputDirective, SolarisFormFieldComponent } from '@solaris-ui/angular';";

export const INPUT_SHOWCASE_BASIC_CODE = [
  '<input solaris-input placeholder="Your name" />',
].join('\n');

export const INPUT_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Name" hint="Enter your full name.">',
  '  <input solaris-input placeholder="Your name" />',
  '</solaris-form-field>',
].join('\n');

function inputAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-form-field label="${label}" appearance="${appearance}">`,
    `  <input solaris-input appearance="${appearance}" placeholder="${label}" />`,
    '</solaris-form-field>',
  ].join('\n');
}

export const INPUT_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  inputAppearanceCode('outline');
export const INPUT_SHOWCASE_APPEARANCE_SURFACE_CODE =
  inputAppearanceCode('surface');
export const INPUT_SHOWCASE_APPEARANCE_FILLED_CODE =
  inputAppearanceCode('filled');

function inputRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-form-field label="${label}" radius="${radius}">`,
    `  <input solaris-input radius="${radius}" placeholder="${label}" />`,
    '</solaris-form-field>',
  ].join('\n');
}

export const INPUT_SHOWCASE_RADIUS_NONE_CODE = inputRadiusCode('none');
export const INPUT_SHOWCASE_RADIUS_SM_CODE = inputRadiusCode('sm');
export const INPUT_SHOWCASE_RADIUS_MD_CODE = inputRadiusCode('md');
export const INPUT_SHOWCASE_RADIUS_LG_CODE = inputRadiusCode('lg');
export const INPUT_SHOWCASE_RADIUS_XL_CODE = inputRadiusCode('xl');

export const INPUT_SHOWCASE_STATES_CODE = [
  '<solaris-form-field label="Default">',
  '  <input solaris-input placeholder="Default" />',
  '</solaris-form-field>',
  '<solaris-form-field label="Invalid" [invalid]="true" error="This field has an error.">',
  '  <input solaris-input [invalid]="true" placeholder="Invalid" />',
  '</solaris-form-field>',
  '<solaris-form-field label="Disabled" [disabled]="true">',
  '  <input solaris-input disabled placeholder="Disabled" />',
  '</solaris-form-field>',
  '<solaris-form-field label="Readonly" [readonly]="true">',
  '  <input solaris-input readonly value="Readonly value" />',
  '</solaris-form-field>',
].join('\n');

export function inputTypeCode(type: string, placeholder: string): string {
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return [
    `<solaris-form-field label="${label}">`,
    `  <input solaris-input type="${type}" placeholder="${placeholder}" />`,
    '</solaris-form-field>',
  ].join('\n');
}

export const INPUT_SHOWCASE_TYPE_CODES = {
  text: inputTypeCode('text', 'Text'),
  email: inputTypeCode('email', 'name@company.com'),
  password: inputTypeCode('password', 'Password'),
  search: inputTypeCode('search', 'Search...'),
  tel: inputTypeCode('tel', '(555) 123-4567'),
  url: inputTypeCode('url', 'https://example.com'),
  number: inputTypeCode('number', '42'),
  date: inputTypeCode('date', 'Date'),
  time: inputTypeCode('time', 'Time'),
};

export const INPUT_SHOWCASE_PREFIX_CODE = [
  '<solaris-form-field label="Search">',
  '  <solaris-icon solaris-form-prefix name="search" [decorative]="true" />',
  '  <input solaris-input type="search" placeholder="Search..." />',
  '</solaris-form-field>',
].join('\n');

export const INPUT_SHOWCASE_AFFIX_CODE = [
  '<solaris-form-field label="Price">',
  '  <span solaris-form-prefix>$</span>',
  '  <input solaris-input type="number" placeholder="0.00" />',
  '  <span solaris-form-suffix>USD</span>',
  '</solaris-form-field>',
].join('\n');

export const INPUT_SHOWCASE_PASSWORD_CODE = [
  '<solaris-form-field label="Password">',
  '  <input solaris-input [type]="passwordVisible() ? \'text\' : \'password\'" value="secret123" />',
  '  <button solaris-form-suffix type="button" (click)="togglePassword()">',
  '    <solaris-icon [name]="passwordVisible() ? \'eye-off\' : \'eye\'" [decorative]="true" />',
  '  </button>',
  '</solaris-form-field>',
].join('\n');

export const INPUT_SHOWCASE_REACTIVE_CODE = [
  '<solaris-form-field label="Required Email" [error]="emailError">',
  '  <input solaris-input type="email" [formControl]="emailControl" placeholder="name@company.com" />',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as INPUT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
