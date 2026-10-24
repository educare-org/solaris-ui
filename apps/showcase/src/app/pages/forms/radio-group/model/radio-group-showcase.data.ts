import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const RADIO_GROUP_SHOWCASE_SLUG = 'radio-group';
export const RADIO_GROUP_TRANSLATION_PREFIX = 'radio-group';

export const RADIO_GROUP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.radio-group' },
  ];

export const RADIO_GROUP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.radio',
  route: '/forms/radio',
};

export const RADIO_GROUP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch',
  route: '/forms/switch',
};

export const RADIO_GROUP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'radio-group.section.examples' },
  { anchor: 'size-density', labelKey: 'radio-group.section.size-density' },
  { anchor: 'layouts', labelKey: 'radio-group.section.layouts' },
  { anchor: 'states', labelKey: 'radio-group.section.states' },
  { anchor: 'validation', labelKey: 'radio-group.section.validation' },
  { anchor: 'form', labelKey: 'radio-group.section.form' },
  { anchor: 'installation', labelKey: 'radio-group.section.installation' },
  { anchor: 'props', labelKey: 'radio-group.section.props' },
];

export const RADIO_GROUP_SHOWCASE_IMPORT_CODE =
  "import { SolarisRadioComponent, SolarisRadioGroupComponent } from '@solaris-ui/angular';";

export const RADIO_GROUP_SHOWCASE_BASIC_CODE = [
  '<solaris-radio-group label="Plan" [formControl]="planControl">',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '  <solaris-radio value="enterprise">Enterprise</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE = [
  '<solaris-radio-group orientation="vertical" label="Plan">',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '  <solaris-radio value="enterprise">Enterprise</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE = [
  '<solaris-radio-group orientation="horizontal" label="Plan">',
  '  <solaris-radio value="yes">Yes</solaris-radio>',
  '  <solaris-radio value="no">No</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_LAYOUT_GRID_CODE = [
  '<solaris-radio-group layout="grid" [columns]="2" label="Plan">',
  '  <solaris-radio value="a">Option A</solaris-radio>',
  '  <solaris-radio value="b">Option B</solaris-radio>',
  '  <solaris-radio value="c">Option C</solaris-radio>',
  '  <solaris-radio value="d">Option D</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_STATES_CODE = [
  '<solaris-radio-group label="Disabled" [disabled]="true">',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '</solaris-radio-group>',
  '<solaris-radio-group label="Readonly" [readonly]="true">',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_VALIDATION_CODE = [
  '<solaris-radio-group',
  '  label="Plan"',
  '  [formControl]="planControl"',
  '  [required]="true"',
  '  [invalid]="planControl.invalid && planControl.touched"',
  '  error="Selection is required."',
  '>',
  '  <solaris-radio value="basic">Basic</solaris-radio>',
  '  <solaris-radio value="pro">Pro</solaris-radio>',
  '</solaris-radio-group>',
].join('\n');

export const RADIO_GROUP_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Plan" hint="Select a plan to continue.">',
  '  <solaris-radio-group [formControl]="planControl">',
  '    <solaris-radio value="basic">Basic</solaris-radio>',
  '    <solaris-radio value="pro">Pro</solaris-radio>',
  '  </solaris-radio-group>',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as RADIO_GROUP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
