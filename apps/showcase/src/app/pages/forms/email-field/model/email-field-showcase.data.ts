import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const EMAIL_FIELD_SHOWCASE_SLUG = 'email-field';
export const EMAIL_FIELD_TRANSLATION_PREFIX = 'email-field';

export const EMAIL_FIELD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.email-field' },
  ];

export const EMAIL_FIELD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.password-field',
  route: '/forms/password-field',
};

export const EMAIL_FIELD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.phone-field',
  route: '/forms/phone-field',
};

export const EMAIL_FIELD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'email-field.section.examples' },
  { anchor: 'size-density', labelKey: 'email-field.section.size-density' },
  { anchor: 'appearances', labelKey: 'email-field.section.appearances' },
  { anchor: 'radius', labelKey: 'email-field.section.radius' },
  { anchor: 'states', labelKey: 'email-field.section.states' },
  { anchor: 'clearable', labelKey: 'email-field.section.clearable' },
  { anchor: 'affix', labelKey: 'email-field.section.affix' },
  { anchor: 'validation', labelKey: 'email-field.section.validation' },
  { anchor: 'form', labelKey: 'email-field.section.form' },
  { anchor: 'installation', labelKey: 'email-field.section.installation' },
  { anchor: 'props', labelKey: 'email-field.section.props' },
];

export const EMAIL_FIELD_SHOWCASE_IMPORT_CODE =
  "import { SolarisEmailFieldComponent } from '@solaris-ui/angular';";

export const EMAIL_FIELD_SHOWCASE_BASIC_CODE = [
  '<solaris-email-field label="E-mail" placeholder="name@company.com" />',
].join('\n');

function emailFieldAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-email-field label="${label}" appearance="${appearance}" placeholder="${label}" />`,
  ].join('\n');
}

export const EMAIL_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  emailFieldAppearanceCode('outline');
export const EMAIL_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE =
  emailFieldAppearanceCode('surface');
export const EMAIL_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE =
  emailFieldAppearanceCode('filled');

function emailFieldRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-email-field label="${label}" radius="${radius}" placeholder="${label}" />`,
  ].join('\n');
}

export const EMAIL_FIELD_SHOWCASE_RADIUS_NONE_CODE =
  emailFieldRadiusCode('none');
export const EMAIL_FIELD_SHOWCASE_RADIUS_SM_CODE = emailFieldRadiusCode('sm');
export const EMAIL_FIELD_SHOWCASE_RADIUS_MD_CODE = emailFieldRadiusCode('md');
export const EMAIL_FIELD_SHOWCASE_RADIUS_LG_CODE = emailFieldRadiusCode('lg');
export const EMAIL_FIELD_SHOWCASE_RADIUS_XL_CODE = emailFieldRadiusCode('xl');

export const EMAIL_FIELD_SHOWCASE_STATES_CODE = [
  '<solaris-email-field label="Default" placeholder="Default" />',
  '<solaris-email-field label="Invalid" [invalid]="true" error="This field has an error." placeholder="Invalid" />',
  '<solaris-email-field label="Disabled" [disabled]="true" value="user@company.com" />',
  '<solaris-email-field label="Readonly" [readonly]="true" value="user@company.com" />',
  '<solaris-email-field label="Loading" [loading]="true" value="user@company.com" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_CLEARABLE_CODE = [
  '<solaris-email-field label="E-mail" value="user@company.com" [clearable]="true" (cleared)="onCleared()" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_PREFIX_CODE = [
  '<solaris-email-field label="E-mail with icons" prefix="search" suffix="info" placeholder="name@company.com" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_PROJECTED_PREFIX_CODE = [
  '<solaris-email-field label="E-mail with projected prefix" placeholder="name@company.com">',
  '  <solaris-icon solaris-form-prefix name="search" [decorative]="true" />',
  '</solaris-email-field>',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-email-field label="E-mail with action" prefix="search" placeholder="name@company.com">',
  '  <button type="button" solaris-form-suffix solaris-form-suffix-action aria-label="Check">',
  '    Check',
  '  </button>',
  '</solaris-email-field>',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_ALLOWED_DOMAINS_CODE = [
  '<solaris-email-field label="Corporate e-mail" hint="Use your institutional e-mail." [allowedDomains]="[\'empresa.com.br\']" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_BLOCKED_DOMAINS_CODE = [
  '<solaris-email-field label="E-mail" hint="Use your institutional e-mail." [blockedDomains]="[\'tempmail.com\', \'mailinator.com\']" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_NORMALIZE_CODE = [
  '<solaris-email-field label="E-mail (lowercase)" [normalizeLowercase]="true" />',
].join('\n');

export const EMAIL_FIELD_SHOWCASE_REACTIVE_CODE = [
  '<solaris-email-field label="Required e-mail" hint="Enter your e-mail address." [formControl]="emailControl" [error]="emailError" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as EMAIL_FIELD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
