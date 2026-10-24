import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const OPTION_SHOWCASE_SLUG = 'option';
export const OPTION_TRANSLATION_PREFIX = 'option';

export const OPTION_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.option' },
];

export const OPTION_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch-group',
  route: '/forms/switch-group',
};

export const OPTION_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.select',
  route: '/forms/select',
};

export const OPTION_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'option.section.examples' },
  { anchor: 'selection-modes', labelKey: 'option.section.selection-modes' },
  { anchor: 'indicators', labelKey: 'option.section.indicators' },
  { anchor: 'size-density', labelKey: 'option.section.size-density' },
  { anchor: 'slots', labelKey: 'option.section.slots' },
  { anchor: 'states', labelKey: 'option.section.states' },
  { anchor: 'option-group', labelKey: 'option.section.option-group' },
  { anchor: 'installation', labelKey: 'option.section.installation' },
  { anchor: 'props', labelKey: 'option.section.props' },
];

export const OPTION_SHOWCASE_IMPORT_CODE =
  "import { SolarisOptionComponent, SolarisOptionGroupComponent } from '@solaris-ui/angular';";

export const OPTION_SHOWCASE_BASIC_CODE = [
  '<solaris-option value="admin" label="Administrator" description="Full system access." />',
  '<solaris-option value="teacher" label="Teacher" description="Manage classes and students." />',
  '<solaris-option value="student" label="Student" description="Access your own profile." />',
].join('\n');

function optionSelectionModeCode(mode: 'none' | 'single' | 'multiple'): string {
  if (mode === 'none') {
    return [
      '<solaris-option value="admin" label="Administrator" />',
      '<solaris-option value="teacher" label="Teacher" />',
      '<solaris-option value="student" label="Student" />',
    ].join('\n');
  }
  const teacherSelected = ' [selected]="true"';
  const studentSelected = mode === 'multiple' ? ' [selected]="true"' : '';
  return [
    `<solaris-option value="admin" label="Administrator" selectionMode="${mode}" [showSelectionIndicator]="true" />`,
    `<solaris-option value="teacher" label="Teacher" selectionMode="${mode}" [showSelectionIndicator]="true"${teacherSelected} />`,
    `<solaris-option value="student" label="Student" selectionMode="${mode}" [showSelectionIndicator]="true"${studentSelected} />`,
  ].join('\n');
}

export const OPTION_SHOWCASE_SELECTION_MODE_CODES = {
  none: optionSelectionModeCode('none'),
  single: optionSelectionModeCode('single'),
  multiple: optionSelectionModeCode('multiple'),
};

export const OPTION_SHOWCASE_INDICATOR_SHOWN_CODE = [
  '<solaris-option value="teacher" label="Teacher" selectionMode="single" [showSelectionIndicator]="true" [selected]="true" />',
].join('\n');

export const OPTION_SHOWCASE_INDICATOR_HIDDEN_CODE = [
  '<solaris-option value="teacher" label="Teacher" selectionMode="single" [selected]="true" />',
].join('\n');

export const OPTION_SHOWCASE_SLOTS_CODE = [
  '<solaris-option value="enterprise">',
  '  <solaris-icon solaris-option-leading name="briefcase" [decorative]="true" />',
  '  <span solaris-option-label>Enterprise plan</span>',
  '  <span solaris-option-description>For large teams</span>',
  '  <span solaris-option-meta>Annual</span>',
  '  <span solaris-option-trailing>',
  '    <solaris-badge color="primary" size="sm">Popular</solaris-badge>',
  '  </span>',
  '</solaris-option>',
].join('\n');

export const OPTION_SHOWCASE_STATES_CODE = [
  '<solaris-option value="available" label="Available" />',
  '<solaris-option value="unavailable" label="Unavailable" [disabled]="true" />',
  '<solaris-option value="another" label="Another option" />',
].join('\n');

export const OPTION_SHOWCASE_GROUP_CODE = [
  '<solaris-option-group label="Academic">',
  '  <solaris-option value="students" label="Students" />',
  '  <solaris-option value="classes" label="Classes" />',
  '  <solaris-option value="grades" label="Grades" />',
  '</solaris-option-group>',
  '<solaris-option-group label="Maintenance" [disabled]="true">',
  '  <!-- disabled propagates to every child option -->',
  '  <solaris-option value="item1" label="Item 1" />',
  '  <solaris-option value="item2" label="Item 2" />',
  '</solaris-option-group>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as OPTION_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
