import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

import { SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';

export const DIALOG_SHOWCASE_SLUG = 'dialog';
export const DIALOG_TRANSLATION_PREFIX = 'dialog';

export const DIALOG_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.overlay', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.dialog' },
];

export const DIALOG_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.pagination',
  route: '/navigation/pagination',
};

export const DIALOG_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.configuration',
  route: '/configuration',
};

export const DIALOG_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'dialog.section.examples' },
  { anchor: 'variants', labelKey: 'dialog.section.variants' },
  { anchor: 'appearance', labelKey: 'dialog.section.appearance' },
  { anchor: 'density', labelKey: 'dialog.section.density' },
  { anchor: 'placement', labelKey: 'dialog.section.placement' },
  { anchor: 'sheet', labelKey: 'dialog.section.sheet' },
  { anchor: 'nested', labelKey: 'dialog.section.nested' },
  { anchor: 'actions', labelKey: 'dialog.section.actions' },
  { anchor: 'behavior', labelKey: 'dialog.section.behavior' },
  { anchor: 'component', labelKey: 'dialog.section.component' },
  { anchor: 'flow', labelKey: 'dialog.section.flow' },
  { anchor: 'installation', labelKey: 'dialog.section.installation' },
  { anchor: 'props', labelKey: 'dialog.section.props' },
];

export const DIALOG_SHOWCASE_INSTALL_COMMANDS = SHOWCASE_INSTALL_COMMANDS;

export const DIALOG_SHOWCASE_IMPORT_CODE =
  "import { SolarisDialogService, provideSolarisDialog } from '@solaris-ui/angular';";

export const DIALOG_SHOWCASE_BASIC_CODE = [
  'this.dialog.open({',
  "  title: 'Dialog Title',",
  "  description: 'This is a basic dialog.',",
  '  actions: [',
  "    { label: 'Cancel', appearance: 'ghost', close: true },",
  "    { label: 'Confirm', color: 'primary', close: true },",
  '  ],',
  '});',
].join('\n');

export const DIALOG_SHOWCASE_SHEET_CODE = [
  'this.dialog.open({',
  "  title: 'Filters',",
  "  description: 'Refine the list below.',",
  "  placement: 'bottom',",
  '  sheet: true,',
  '  actions: [',
  "    { label: 'Apply', color: 'primary', close: true },",
  '  ],',
  '});',
].join('\n');

export const DIALOG_SHOWCASE_NESTED_CODE = [
  '// Outer component dialog:',
  'this.dialog.openComponent(OuterSettingsComponent, {',
  "  title: 'Settings',",
  "  width: '500px',",
  '});',
  '',
  '// …inside OuterSettingsComponent:',
  'this.dialog.open({',
  "  title: 'Discard changes?',",
  "  variant: 'warning',",
  "  role: 'alertdialog',",
  '  actions: [',
  "    { label: 'Keep editing', appearance: 'ghost', close: true },",
  "    { label: 'Discard', color: 'danger', close: true, result: 'discard' },",
  '  ],',
  '});',
].join('\n');

export const DIALOG_SHOWCASE_COMPONENT_CODE = [
  'const ref = this.dialog.openComponent(UserProfileComponent, {',
  "  width: '500px',",
  '  data: { userId: 42 },',
  '});',
  '',
  'ref.afterClosed().subscribe((result) => {',
  "  console.log('Closed with:', result);",
  '});',
].join('\n');

export const DIALOG_SHOWCASE_COMPONENT_CHROME_CODE = [
  'const ref = this.dialog.openComponent(UserFormComponent, {',
  "  title: 'Edit user',",
  "  description: 'Changes are saved immediately.',",
  "  variant: 'info',",
  "  width: '500px',",
  '  actions: [',
  "    { label: 'Cancel', appearance: 'ghost', close: true },",
  "    { label: 'Save', color: 'primary', close: true, result: 'saved' },",
  '  ],',
  '});',
].join('\n');

export const DIALOG_SHOWCASE_FLOW_CODE = [
  'this.dialog.openComponent(DialogFlowExampleComponent, {',
  "  width: '600px',",
  "  minHeight: '300px',",
  '});',
].join('\n');

export const DIALOG_SHOWCASE_VALIDATED_FLOW_CODE = [
  '<solaris-dialog-flow [(activeIndex)]="activeStep">',
  '  <solaris-dialog-step>',
  '    <label>Name',
  '      <input [(ngModel)]="name" required />',
  '    </label>',
  '  </solaris-dialog-step>',
  '',
  '  <solaris-dialog-step [disabled]="!name().trim()">',
  '    <p>Review {{ name() }} before finishing.</p>',
  '  </solaris-dialog-step>',
  '',
  '  <div solaris-dialog-flow-footer>',
  '    <button type="button" solaris-button (click)="flow().previous()">',
  '      Back',
  '    </button>',
  '    <button type="button" solaris-button (click)="flow().next()">',
  '      Next',
  '    </button>',
  '  </div>',
  '</solaris-dialog-flow>',
].join('\n');
