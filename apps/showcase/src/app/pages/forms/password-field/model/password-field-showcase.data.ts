import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PASSWORD_FIELD_SHOWCASE_SLUG = 'password-field';
export const PASSWORD_FIELD_TRANSLATION_PREFIX = 'password-field';

export const PASSWORD_FIELD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.password-field' },
  ];

export const PASSWORD_FIELD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.textarea',
  route: '/forms/textarea',
};

export const PASSWORD_FIELD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.email-field',
  route: '/forms/email-field',
};

export const PASSWORD_FIELD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'password-field.section.examples' },
  { anchor: 'size-density', labelKey: 'password-field.section.size-density' },
  { anchor: 'appearances', labelKey: 'password-field.section.appearances' },
  { anchor: 'radius', labelKey: 'password-field.section.radius' },
  { anchor: 'states', labelKey: 'password-field.section.states' },
  { anchor: 'affix', labelKey: 'password-field.section.affix' },
  { anchor: 'toggle', labelKey: 'password-field.section.toggle' },
  { anchor: 'requirements', labelKey: 'password-field.section.requirements' },
  { anchor: 'installation', labelKey: 'password-field.section.installation' },
  { anchor: 'props', labelKey: 'password-field.section.props' },
];

export const PASSWORD_FIELD_SHOWCASE_IMPORT_CODE =
  "import { SolarisPasswordFieldComponent } from '@solaris-ui/angular';";

export const PASSWORD_FIELD_SHOWCASE_BASIC_CODE = [
  '<solaris-password-field label="Password" autocomplete="current-password" />',
].join('\n');

function passwordFieldAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-password-field label="${label}" appearance="${appearance}" placeholder="${label}" />`,
  ].join('\n');
}

export const PASSWORD_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  passwordFieldAppearanceCode('outline');
export const PASSWORD_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE =
  passwordFieldAppearanceCode('surface');
export const PASSWORD_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE =
  passwordFieldAppearanceCode('filled');

function passwordFieldRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-password-field label="${label}" radius="${radius}" placeholder="${label}" />`,
  ].join('\n');
}

export const PASSWORD_FIELD_SHOWCASE_RADIUS_NONE_CODE =
  passwordFieldRadiusCode('none');
export const PASSWORD_FIELD_SHOWCASE_RADIUS_SM_CODE =
  passwordFieldRadiusCode('sm');
export const PASSWORD_FIELD_SHOWCASE_RADIUS_MD_CODE =
  passwordFieldRadiusCode('md');
export const PASSWORD_FIELD_SHOWCASE_RADIUS_LG_CODE =
  passwordFieldRadiusCode('lg');

export const PASSWORD_FIELD_SHOWCASE_STATES_CODE = [
  '<solaris-password-field label="Default" placeholder="Default" />',
  '<solaris-password-field label="Invalid" [invalid]="true" error="This field has an error." placeholder="Invalid" />',
  '<solaris-password-field label="Disabled" [disabled]="true" value="secret123" />',
  '<solaris-password-field label="Readonly" [readonly]="true" value="secret123" />',
  '<solaris-password-field label="Loading" [loading]="true" value="secret123" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_PREFIX_CODE = [
  '<solaris-password-field label="Password with prefix" prefix="lock" placeholder="Enter your password" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-password-field label="Password with action" prefix="lock" [showToggle]="false" placeholder="Enter your password">',
  '  <button type="button" solaris-form-suffix solaris-form-suffix-action aria-label="Generate">',
  '    Generate',
  '  </button>',
  '</solaris-password-field>',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_TOGGLE_CODE = [
  '<solaris-password-field label="Password" autocomplete="current-password" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_NO_TOGGLE_CODE = [
  '<solaris-password-field label="Password without toggle" [showToggle]="false" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_REQUIREMENTS_CODE = [
  '<solaris-password-field label="New password" autocomplete="new-password" [showRequirements]="true" [policy]="passwordPolicy" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_STRENGTH_CODE = [
  '<solaris-password-field label="New password" autocomplete="new-password" [showStrength]="true" [minLength]="12" />',
].join('\n');

export const PASSWORD_FIELD_SHOWCASE_REACTIVE_CODE = [
  '<solaris-password-field label="New password" autocomplete="new-password" hint="Minimum 8 characters with letters, numbers and symbols." [formControl]="passwordControl" [showRequirements]="true" [showStrength]="true" [policy]="passwordPolicy" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as PASSWORD_FIELD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
