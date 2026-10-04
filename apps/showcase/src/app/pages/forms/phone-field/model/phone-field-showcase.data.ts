import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const PHONE_FIELD_SHOWCASE_SLUG = 'phone-field';
export const PHONE_FIELD_TRANSLATION_PREFIX = 'phone-field';

export const PHONE_FIELD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.phone-field' },
  ];

export const PHONE_FIELD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.email-field',
  route: '/forms/email-field',
};

export const PHONE_FIELD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.otp-input',
  route: '/forms/otp-input',
};

export const PHONE_FIELD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'phone-field.section.examples' },
  { anchor: 'size-density', labelKey: 'phone-field.section.size-density' },
  { anchor: 'appearances', labelKey: 'phone-field.section.appearances' },
  { anchor: 'radius', labelKey: 'phone-field.section.radius' },
  { anchor: 'states', labelKey: 'phone-field.section.states' },
  { anchor: 'clearable', labelKey: 'phone-field.section.clearable' },
  { anchor: 'affix', labelKey: 'phone-field.section.affix' },
  { anchor: 'countries', labelKey: 'phone-field.section.countries' },
  { anchor: 'form', labelKey: 'phone-field.section.form' },
  { anchor: 'installation', labelKey: 'phone-field.section.installation' },
  { anchor: 'props', labelKey: 'phone-field.section.props' },
];

export const PHONE_FIELD_SHOWCASE_IMPORT_CODE =
  "import { SolarisPhoneFieldComponent } from '@solaris-ui/angular';";

export const PHONE_FIELD_SHOWCASE_BASIC_CODE = [
  '<solaris-phone-field label="Phone" defaultCountry="BR" />',
].join('\n');

function phoneFieldAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-phone-field label="${label}" appearance="${appearance}" defaultCountry="BR" />`,
  ].join('\n');
}

export const PHONE_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  phoneFieldAppearanceCode('outline');
export const PHONE_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE =
  phoneFieldAppearanceCode('surface');
export const PHONE_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE =
  phoneFieldAppearanceCode('filled');

function phoneFieldRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-phone-field label="${label}" radius="${radius}" defaultCountry="BR" />`,
  ].join('\n');
}

export const PHONE_FIELD_SHOWCASE_RADIUS_NONE_CODE =
  phoneFieldRadiusCode('none');
export const PHONE_FIELD_SHOWCASE_RADIUS_SM_CODE = phoneFieldRadiusCode('sm');
export const PHONE_FIELD_SHOWCASE_RADIUS_MD_CODE = phoneFieldRadiusCode('md');
export const PHONE_FIELD_SHOWCASE_RADIUS_LG_CODE = phoneFieldRadiusCode('lg');
export const PHONE_FIELD_SHOWCASE_RADIUS_XL_CODE = phoneFieldRadiusCode('xl');

export const PHONE_FIELD_SHOWCASE_CLEARABLE_CODE = [
  '<solaris-phone-field label="Phone" defaultCountry="BR" value="+5511987654321" [clearable]="true" (cleared)="onCleared()" />',
].join('\n');

export const PHONE_FIELD_SHOWCASE_STATES_CODE = [
  '<solaris-phone-field label="Default" defaultCountry="BR" />',
  '<solaris-phone-field label="Invalid" [invalid]="true" error="This field has an error." defaultCountry="BR" />',
  '<solaris-phone-field label="Disabled" [disabled]="true" value="+5511999998888" defaultCountry="BR" />',
  '<solaris-phone-field label="Readonly" [readonly]="true" value="+5511999998888" defaultCountry="BR" />',
  '<solaris-phone-field label="Loading" [loading]="true" value="+5511999998888" defaultCountry="BR" />',
].join('\n');

export const PHONE_FIELD_SHOWCASE_SUFFIX_CODE = [
  '<solaris-phone-field label="Phone with suffix" suffix="info" defaultCountry="BR" />',
].join('\n');

export const PHONE_FIELD_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-phone-field label="Phone with action" defaultCountry="BR">',
  '  <button type="button" solaris-form-suffix solaris-form-suffix-action aria-label="Verify">',
  '    Verify',
  '  </button>',
  '</solaris-phone-field>',
].join('\n');

export const PHONE_FIELD_SHOWCASE_COUNTRIES_CODE = [
  "<solaris-phone-field label=\"Phone\" [countryList]=\"['US', 'GB', 'BR', 'PT']\" defaultCountry=\"BR\" />",
].join('\n');

export const PHONE_FIELD_SHOWCASE_SEARCHABLE_CODE = [
  '<solaris-phone-field label="Phone without search" [searchable]="false" defaultCountry="BR" />',
].join('\n');

export const PHONE_FIELD_SHOWCASE_REACTIVE_CODE = [
  '<solaris-phone-field label="Phone" [formControl]="phoneControl" [required]="true" defaultCountry="BR" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as PHONE_FIELD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
