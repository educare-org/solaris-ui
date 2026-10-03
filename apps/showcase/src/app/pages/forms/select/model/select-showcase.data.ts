import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SELECT_SHOWCASE_SLUG = 'select';
export const SELECT_TRANSLATION_PREFIX = 'select';

export const SELECT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.select' },
];

export const SELECT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.option',
  route: '/forms/option',
};

export const SELECT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.multi-select',
  route: '/forms/multi-select',
};

export const SELECT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'select.section.examples' },
  { anchor: 'size-density', labelKey: 'select.section.size-density' },
  { anchor: 'appearance', labelKey: 'select.section.appearance' },
  { anchor: 'radius', labelKey: 'select.section.radius' },
  { anchor: 'states', labelKey: 'select.section.states' },
  { anchor: 'clearable', labelKey: 'select.section.clearable' },
  { anchor: 'affix', labelKey: 'select.section.affix' },
  { anchor: 'searchable', labelKey: 'select.section.searchable' },
  { anchor: 'installation', labelKey: 'select.section.installation' },
  { anchor: 'props', labelKey: 'select.section.props' },
];

export const SELECT_SHOWCASE_IMPORT_CODE =
  "import { SolarisSelectComponent, SolarisOptionComponent, SolarisOptionGroupComponent } from '@solaris-ui/angular';";

export const SELECT_SHOWCASE_BASIC_CODE = [
  '<solaris-select label="Role" placeholder="Select a role">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '  <solaris-option value="teacher">Teacher</solaris-option>',
  '  <solaris-option value="student">Student</solaris-option>',
  '</solaris-select>',
].join('\n');

function selectAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-select label="${label}" appearance="${appearance}" placeholder="${label}">`,
    '  <solaris-option value="admin">Administrator</solaris-option>',
    '  <solaris-option value="teacher">Teacher</solaris-option>',
    '</solaris-select>',
  ].join('\n');
}

export const SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  selectAppearanceCode('outline');
export const SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE =
  selectAppearanceCode('surface');
export const SELECT_SHOWCASE_APPEARANCE_FILLED_CODE =
  selectAppearanceCode('filled');

function selectRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-select label="${label}" radius="${radius}" placeholder="${label}">`,
    '  <solaris-option value="admin">Administrator</solaris-option>',
    '</solaris-select>',
  ].join('\n');
}

export const SELECT_SHOWCASE_RADIUS_NONE_CODE = selectRadiusCode('none');
export const SELECT_SHOWCASE_RADIUS_SM_CODE = selectRadiusCode('sm');
export const SELECT_SHOWCASE_RADIUS_MD_CODE = selectRadiusCode('md');
export const SELECT_SHOWCASE_RADIUS_LG_CODE = selectRadiusCode('lg');

export const SELECT_SHOWCASE_STATES_CODE = [
  '<solaris-select label="Default" placeholder="Default">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '</solaris-select>',
  '<solaris-select label="Invalid" [invalid]="true" error="This field has an error." placeholder="Invalid">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '</solaris-select>',
  '<solaris-select label="Disabled" [disabled]="true" placeholder="Disabled">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '</solaris-select>',
  '<solaris-select label="Readonly" [readonly]="true" placeholder="Readonly">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '</solaris-select>',
  '<solaris-select label="Loading" [loading]="true" placeholder="Loading">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_CLEARABLE_CODE = [
  '<solaris-select label="Status" clearable placeholder="Select a status" (cleared)="onCleared()">',
  '  <solaris-option value="active">Active</solaris-option>',
  '  <solaris-option value="inactive">Inactive</solaris-option>',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_PREFIX_CODE = [
  '<solaris-select label="Country" prefix="search" placeholder="Select a country">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_SUFFIX_CODE = [
  '<solaris-select label="Role" placeholder="Select a role">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '  <solaris-option value="teacher">Teacher</solaris-option>',
  '  <solaris-icon solaris-form-suffix name="info" [decorative]="true" />',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-select label="Role" placeholder="Select a role" [loading]="actionLoading()">',
  '  <solaris-option value="admin">Administrator</solaris-option>',
  '  <solaris-option value="teacher">Teacher</solaris-option>',
  '  <button solaris-form-suffix solaris-form-suffix-action type="button" (click)="toggleActionLoading()" aria-label="Toggle loading">',
  '    <solaris-icon name="info" [decorative]="true" />',
  '  </button>',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_SEARCHABLE_CODE = [
  '<solaris-select label="Country" searchable searchPlaceholder="Search country..." placeholder="Select a country">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-option value="pt">Portugal</solaris-option>',
  '</solaris-select>',
].join('\n');

export const SELECT_SHOWCASE_OBJECT_CODE = [
  '<solaris-select label="Plan" placeholder="Select a plan" [compareWith]="comparePlan" [displayWith]="displayPlan">',
  '  <solaris-option [value]="basicPlan" label="Basic"></solaris-option>',
  '  <solaris-option [value]="proPlan" label="Pro"></solaris-option>',
  '</solaris-select>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SELECT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
