import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const MULTI_SELECT_SHOWCASE_SLUG = 'multi-select';
export const MULTI_SELECT_TRANSLATION_PREFIX = 'multiSelect';

export const MULTI_SELECT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.multi-select' },
  ];

export const MULTI_SELECT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.select',
  route: '/forms/select',
};

export const MULTI_SELECT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.date-picker',
  route: '/forms/date-picker',
};

export const MULTI_SELECT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'multiSelect.section.examples' },
  { anchor: 'size-density', labelKey: 'multiSelect.section.size-density' },
  { anchor: 'appearance', labelKey: 'multiSelect.section.appearance' },
  { anchor: 'radius', labelKey: 'multiSelect.section.radius' },
  { anchor: 'states', labelKey: 'multiSelect.section.states' },
  { anchor: 'clearable', labelKey: 'multiSelect.section.clearable' },
  { anchor: 'affix', labelKey: 'multiSelect.section.affix' },
  { anchor: 'searchable', labelKey: 'multiSelect.section.searchable' },
  { anchor: 'installation', labelKey: 'multiSelect.section.installation' },
  { anchor: 'props', labelKey: 'multiSelect.section.props' },
];

export const MULTI_SELECT_SHOWCASE_IMPORT_CODE =
  "import { SolarisMultiSelectComponent, SolarisOptionComponent, SolarisOptionGroupComponent } from '@solaris-ui/angular';";

export const MULTI_SELECT_SHOWCASE_BASIC_CODE = [
  '<solaris-multi-select label="Countries" placeholder="Select countries">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-option value="pt">Portugal</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

function multiSelectAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-multi-select label="${label}" appearance="${appearance}" placeholder="${label}">`,
    '  <solaris-option value="br">Brazil</solaris-option>',
    '  <solaris-option value="us">United States</solaris-option>',
    '</solaris-multi-select>',
  ].join('\n');
}

export const MULTI_SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  multiSelectAppearanceCode('outline');
export const MULTI_SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE =
  multiSelectAppearanceCode('surface');
export const MULTI_SELECT_SHOWCASE_APPEARANCE_FILLED_CODE =
  multiSelectAppearanceCode('filled');

function multiSelectRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-multi-select label="${label}" radius="${radius}" placeholder="${label}">`,
    '  <solaris-option value="br">Brazil</solaris-option>',
    '</solaris-multi-select>',
  ].join('\n');
}

export const MULTI_SELECT_SHOWCASE_RADIUS_NONE_CODE =
  multiSelectRadiusCode('none');
export const MULTI_SELECT_SHOWCASE_RADIUS_SM_CODE = multiSelectRadiusCode('sm');
export const MULTI_SELECT_SHOWCASE_RADIUS_MD_CODE = multiSelectRadiusCode('md');
export const MULTI_SELECT_SHOWCASE_RADIUS_LG_CODE = multiSelectRadiusCode('lg');

export const MULTI_SELECT_SHOWCASE_STATES_CODE = [
  '<solaris-multi-select label="Default" placeholder="Default">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '</solaris-multi-select>',
  '<solaris-multi-select label="Invalid" [invalid]="true" error="This field has an error." placeholder="Invalid">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '</solaris-multi-select>',
  '<solaris-multi-select label="Disabled" [disabled]="true" placeholder="Disabled">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '</solaris-multi-select>',
  '<solaris-multi-select label="Readonly" [readonly]="true" placeholder="Readonly">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '</solaris-multi-select>',
  '<solaris-multi-select label="Loading" [loading]="true" placeholder="Loading">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_CLEARABLE_CODE = [
  '<solaris-multi-select label="Countries" clearable placeholder="Select countries" (cleared)="onCleared()">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-option value="pt">Portugal</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_PREFIX_CODE = [
  '<solaris-multi-select label="Countries" prefix="search" placeholder="Select countries">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_SUFFIX_CODE = [
  '<solaris-multi-select label="Countries" placeholder="Select countries">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-icon solaris-form-suffix name="info" [decorative]="true" />',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-multi-select label="Countries" placeholder="Select countries" [loading]="actionLoading()">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <button solaris-form-suffix solaris-form-suffix-action type="button" (click)="toggleActionLoading()" aria-label="Toggle loading">',
  '    <solaris-icon name="info" [decorative]="true" />',
  '  </button>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_SEARCHABLE_CODE = [
  '<solaris-multi-select label="Countries" searchable searchPlaceholder="Search countries..." placeholder="Select countries">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-option value="pt">Portugal</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_SELECT_ALL_CODE = [
  '<solaris-multi-select label="Fruits" searchable selectAll placeholder="Select fruits">',
  '  <solaris-option value="apple">Apple</solaris-option>',
  '  <solaris-option value="banana">Banana</solaris-option>',
  '  <solaris-option value="orange">Orange</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export const MULTI_SELECT_SHOWCASE_CHIPS_CODE = [
  '<solaris-multi-select label="Countries" displayMode="chips" [maxVisibleChips]="2" placeholder="Select countries">',
  '  <solaris-option value="br">Brazil</solaris-option>',
  '  <solaris-option value="us">United States</solaris-option>',
  '  <solaris-option value="pt">Portugal</solaris-option>',
  '</solaris-multi-select>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as MULTI_SELECT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
