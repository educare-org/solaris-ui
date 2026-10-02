import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const CHECKBOX_GROUP_SHOWCASE_SLUG = 'checkbox-group';
export const CHECKBOX_GROUP_TRANSLATION_PREFIX = 'checkbox-group';

export const CHECKBOX_GROUP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.checkbox-group' },
  ];

export const CHECKBOX_GROUP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.checkbox',
  route: '/forms/checkbox',
};

export const CHECKBOX_GROUP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radio',
  route: '/forms/radio',
};

export const CHECKBOX_GROUP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'checkbox-group.section.examples' },
  { anchor: 'select-all', labelKey: 'checkbox-group.section.select-all' },
  { anchor: 'size-density', labelKey: 'checkbox-group.section.size-density' },
  { anchor: 'layouts', labelKey: 'checkbox-group.section.layouts' },
  { anchor: 'states', labelKey: 'checkbox-group.section.states' },
  { anchor: 'validation', labelKey: 'checkbox-group.section.validation' },
  { anchor: 'form', labelKey: 'checkbox-group.section.form' },
  { anchor: 'installation', labelKey: 'checkbox-group.section.installation' },
  { anchor: 'props', labelKey: 'checkbox-group.section.props' },
];

export const CHECKBOX_GROUP_SHOWCASE_IMPORT_CODE =
  "import { SolarisCheckboxComponent, SolarisCheckboxGroupComponent } from '@solaris-ui/angular';";

export const CHECKBOX_GROUP_SHOWCASE_BASIC_CODE = [
  '<solaris-checkbox-group label="Interests" [formControl]="interestsControl">',
  '  <solaris-checkbox value="sports">Sports</solaris-checkbox>',
  '  <solaris-checkbox value="finance">Finance</solaris-checkbox>',
  '  <solaris-checkbox value="technology">Technology</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_SELECT_ALL_CODE = [
  '<solaris-checkbox-group label="Permissions" [selectAll]="true">',
  '  <solaris-checkbox value="read">Read</solaris-checkbox>',
  '  <solaris-checkbox value="write">Write</solaris-checkbox>',
  '  <solaris-checkbox value="delete">Delete</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE = [
  '<solaris-checkbox-group orientation="vertical" label="Interests">',
  '  <solaris-checkbox value="sports">Sports</solaris-checkbox>',
  '  <solaris-checkbox value="finance">Finance</solaris-checkbox>',
  '  <solaris-checkbox value="technology">Technology</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE = [
  '<solaris-checkbox-group orientation="horizontal" label="Filter">',
  '  <solaris-checkbox value="active">Active</solaris-checkbox>',
  '  <solaris-checkbox value="pending">Pending</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_LAYOUT_GRID_CODE = [
  '<solaris-checkbox-group layout="grid" [columns]="2" label="Modules">',
  '  <solaris-checkbox value="academic">Academic</solaris-checkbox>',
  '  <solaris-checkbox value="finance">Finance</solaris-checkbox>',
  '  <solaris-checkbox value="reports">Reports</solaris-checkbox>',
  '  <solaris-checkbox value="content">Content</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_STATES_CODE = [
  '<solaris-checkbox-group label="Disabled" [disabled]="true">',
  '  <solaris-checkbox value="read">Read</solaris-checkbox>',
  '  <solaris-checkbox value="write">Write</solaris-checkbox>',
  '</solaris-checkbox-group>',
  '<solaris-checkbox-group label="Readonly" [readonly]="true">',
  '  <solaris-checkbox value="read">Read</solaris-checkbox>',
  '  <solaris-checkbox value="write">Write</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_VALIDATION_CODE = [
  '<solaris-checkbox-group',
  '  label="Interests"',
  '  [formControl]="interestsControl"',
  '  [minSelected]="1"',
  '  [maxSelected]="2"',
  '  error="Select one or two interests."',
  '>',
  '  <solaris-checkbox value="sports">Sports</solaris-checkbox>',
  '  <solaris-checkbox value="finance">Finance</solaris-checkbox>',
  '  <solaris-checkbox value="technology">Technology</solaris-checkbox>',
  '</solaris-checkbox-group>',
].join('\n');

export const CHECKBOX_GROUP_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Interests" hint="Select at least one option.">',
  '  <solaris-checkbox-group [formControl]="interestsControl">',
  '    <solaris-checkbox value="sports">Sports</solaris-checkbox>',
  '    <solaris-checkbox value="finance">Finance</solaris-checkbox>',
  '  </solaris-checkbox-group>',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as CHECKBOX_GROUP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
