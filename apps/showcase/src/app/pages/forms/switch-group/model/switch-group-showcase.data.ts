import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SWITCH_GROUP_SHOWCASE_SLUG = 'switch-group';
export const SWITCH_GROUP_TRANSLATION_PREFIX = 'switch-group';

export const SWITCH_GROUP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.switch-group' },
  ];

export const SWITCH_GROUP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch',
  route: '/forms/switch',
};

export const SWITCH_GROUP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.selection-card',
  route: '/forms/selection-card',
};

export const SWITCH_GROUP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'switch-group.section.examples' },
  { anchor: 'size-density', labelKey: 'switch-group.section.size-density' },
  { anchor: 'layouts', labelKey: 'switch-group.section.layouts' },
  { anchor: 'states', labelKey: 'switch-group.section.states' },
  { anchor: 'validation', labelKey: 'switch-group.section.validation' },
  { anchor: 'form', labelKey: 'switch-group.section.form' },
  { anchor: 'installation', labelKey: 'switch-group.section.installation' },
  { anchor: 'props', labelKey: 'switch-group.section.props' },
];

export const SWITCH_GROUP_SHOWCASE_IMPORT_CODE =
  "import { SolarisSwitchGroupComponent, SolarisSwitchComponent } from '@solaris-ui/angular';";

export const SWITCH_GROUP_SHOWCASE_BASIC_CODE = [
  '<solaris-switch-group label="Channels" [formControl]="channelsControl">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '  <solaris-switch value="push">Push</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE = [
  '<solaris-switch-group orientation="vertical" label="Channels">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '  <solaris-switch value="push">Push</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE = [
  '<solaris-switch-group orientation="horizontal" label="Channels">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '  <solaris-switch value="push">Push</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_LAYOUT_GRID_CODE = [
  '<solaris-switch-group layout="grid" [columns]="2" label="Channels">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '  <solaris-switch value="push">Push</solaris-switch>',
  '  <solaris-switch value="newsletter">Newsletter</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_STATES_CODE = [
  '<solaris-switch-group label="Disabled" [disabled]="true">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '</solaris-switch-group>',
  '<solaris-switch-group label="Readonly" [readonly]="true">',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_VALIDATION_CODE = [
  '<solaris-switch-group',
  '  label="Channels"',
  '  [formControl]="channelsControl"',
  '  [minEnabled]="1"',
  '  [maxEnabled]="2"',
  '  error="Select one or two channels."',
  '>',
  '  <solaris-switch value="email">Email</solaris-switch>',
  '  <solaris-switch value="sms">SMS</solaris-switch>',
  '  <solaris-switch value="push">Push</solaris-switch>',
  '</solaris-switch-group>',
].join('\n');

export const SWITCH_GROUP_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Channels" hint="Affects your account.">',
  '  <solaris-switch-group [formControl]="channelsControl">',
  '    <solaris-switch value="email">Email</solaris-switch>',
  '    <solaris-switch value="sms">SMS</solaris-switch>',
  '  </solaris-switch-group>',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SWITCH_GROUP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
