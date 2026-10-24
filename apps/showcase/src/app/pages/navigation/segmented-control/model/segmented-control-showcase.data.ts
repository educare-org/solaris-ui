import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SEGMENTED_CONTROL_SHOWCASE_SLUG = 'segmented-control';
export const SEGMENTED_CONTROL_TRANSLATION_PREFIX = 'segmented-control';

export const SEGMENTED_CONTROL_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.segmented-control' },
  ];

export const SEGMENTED_CONTROL_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.stepper',
  route: '/navigation/stepper',
};

export const SEGMENTED_CONTROL_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.editable-tabs',
  route: '/navigation/editable-tabs',
};

export const SEGMENTED_CONTROL_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] =
  [
    { anchor: 'examples', labelKey: 'segmented-control.section.examples' },
    {
      anchor: 'appearances',
      labelKey: 'segmented-control.section.appearances',
    },
    {
      anchor: 'size-density',
      labelKey: 'segmented-control.section.size-density',
    },
    { anchor: 'radius', labelKey: 'segmented-control.section.radius' },
    {
      anchor: 'orientation',
      labelKey: 'segmented-control.section.orientation',
    },
    { anchor: 'layout', labelKey: 'segmented-control.section.layout' },
    { anchor: 'features', labelKey: 'segmented-control.section.features' },
    { anchor: 'states', labelKey: 'segmented-control.section.states' },
    { anchor: 'forms', labelKey: 'segmented-control.section.forms' },
    {
      anchor: 'installation',
      labelKey: 'segmented-control.section.installation',
    },
    { anchor: 'props', labelKey: 'segmented-control.section.props' },
  ];

export const SEGMENTED_CONTROL_SHOWCASE_IMPORT_CODE =
  "import { SolarisSegmentedControlComponent, SolarisSegmentedItemComponent } from '@solaris-ui/angular';";

export const SEGMENTED_CONTROL_SHOWCASE_BASIC_CODE = [
  '<solaris-segmented-control [(value)]="billingCycle" aria-label="Billing cycle">',
  '  <solaris-segmented-item value="monthly">Monthly</solaris-segmented-item>',
  '  <solaris-segmented-item value="yearly">Yearly</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<solaris-segmented-control appearance="surface" defaultValue="a" aria-label="Surface">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<solaris-segmented-control appearance="outline" defaultValue="x" aria-label="Outline">',
  '  <solaris-segmented-item value="x">Option X</solaris-segmented-item>',
  '  <solaris-segmented-item value="y">Option Y</solaris-segmented-item>',
  '  <solaris-segmented-item value="z">Option Z</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_RADIUS_SM_CODE = [
  '<solaris-segmented-control radius="sm" defaultValue="a" aria-label="Radius small">',
  '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Radius MD</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_RADIUS_MD_CODE = [
  '<solaris-segmented-control radius="md" defaultValue="a" aria-label="Radius medium">',
  '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Radius MD</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_RADIUS_LG_CODE = [
  '<solaris-segmented-control radius="lg" defaultValue="a" aria-label="Radius large">',
  '  <solaris-segmented-item value="a">Radius LG</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Radius Full</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_RADIUS_FULL_CODE = [
  '<solaris-segmented-control radius="full" defaultValue="a" aria-label="Radius full">',
  '  <solaris-segmented-item value="a">Radius SM</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Radius Full</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_VERTICAL_CODE = [
  '<solaris-segmented-control orientation="vertical" [(value)]="section" aria-label="Section">',
  '  <solaris-segmented-item value="general">General</solaris-segmented-item>',
  '  <solaris-segmented-item value="security">Security</solaris-segmented-item>',
  '  <solaris-segmented-item value="notifications">Notifications</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_FULL_WIDTH_CODE = [
  '<solaris-segmented-control [fullWidth]="true" [(value)]="option" aria-label="Option">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_EQUAL_WIDTH_CODE = [
  '<solaris-segmented-control [equalWidth]="true" [(value)]="size" aria-label="Size">',
  '  <solaris-segmented-item value="short">Short</solaris-segmented-item>',
  '  <solaris-segmented-item value="medium">Medium</solaris-segmented-item>',
  '  <solaris-segmented-item value="long">Long</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_MANY_OPTIONS_CODE = [
  '<solaris-segmented-control [(value)]="priority" aria-label="Priority">',
  '  <solaris-segmented-item value="critical">Critical</solaris-segmented-item>',
  '  <solaris-segmented-item value="high">High</solaris-segmented-item>',
  '  <solaris-segmented-item value="medium">Medium</solaris-segmented-item>',
  '  <solaris-segmented-item value="low">Low</solaris-segmented-item>',
  '  <solaris-segmented-item value="none">None</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_LONG_LABELS_CODE = [
  '<solaris-segmented-control [equalWidth]="true" [(value)]="setting" aria-label="Setting">',
  '  <solaris-segmented-item value="a">User Settings</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">System Preferences</solaris-segmented-item>',
  '  <solaris-segmented-item value="c">Notifications & Alerts</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_WITH_ICONS_CODE = [
  '<solaris-segmented-control [(value)]="viewMode" aria-label="View mode">',
  '  <solaris-segmented-item value="list" icon="list">List</solaris-segmented-item>',
  '  <solaris-segmented-item value="grid" icon="grid">Grid</solaris-segmented-item>',
  '  <solaris-segmented-item value="kanban" icon="columns">Kanban</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_WITH_BADGE_CODE = [
  '<solaris-segmented-control [(value)]="filter" aria-label="Filter">',
  '  <solaris-segmented-item value="all">All</solaris-segmented-item>',
  '  <solaris-segmented-item value="issues">',
  '    Issues',
  '    <solaris-badge size="sm" color="neutral">30</solaris-badge>',
  '  </solaris-segmented-item>',
  '  <solaris-segmented-item value="prs">',
  '    Pull Requests',
  '    <solaris-badge size="sm" color="neutral">12</solaris-badge>',
  '  </solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_ICON_ONLY_CODE = [
  '<solaris-segmented-control [(value)]="view" aria-label="View mode">',
  '  <solaris-segmented-item value="list" icon="list" aria-label="List view" />',
  '  <solaris-segmented-item value="grid" icon="grid" aria-label="Grid view" />',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_NO_INDICATOR_CODE = [
  '<solaris-segmented-control [indicator]="false" [(value)]="option" aria-label="Option">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_DISABLED_GROUP_CODE = [
  '<solaris-segmented-control [disabled]="true" [(value)]="option" aria-label="Option">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '  <solaris-segmented-item value="c">Option C</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_DISABLED_ITEM_CODE = [
  '<solaris-segmented-control [(value)]="option" aria-label="Option">',
  '  <solaris-segmented-item value="a">Enabled</solaris-segmented-item>',
  '  <solaris-segmented-item value="b" [disabled]="true">Disabled</solaris-segmented-item>',
  '  <solaris-segmented-item value="c">Enabled</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_READONLY_CODE = [
  '<solaris-segmented-control [readonly]="true" [(value)]="option" aria-label="Option">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_INVALID_CODE = [
  '<solaris-segmented-control [required]="true" [invalid]="showError" aria-label="Plan">',
  '  <solaris-segmented-item value="a">Option A</solaris-segmented-item>',
  '  <solaris-segmented-item value="b">Option B</solaris-segmented-item>',
  '</solaris-segmented-control>',
  '<button solaris-button type="button" (click)="validate()">Validate</button>',
  '@if (showError) {',
  '  <p role="alert">Select an option to continue.</p>',
  '}',
].join('\n');

export const SEGMENTED_CONTROL_SHOWCASE_REACTIVE_FORMS_CODE = [
  '<solaris-segmented-control [formControl]="themeControl" aria-label="Theme">',
  '  <solaris-segmented-item value="light">Light</solaris-segmented-item>',
  '  <solaris-segmented-item value="dark">Dark</solaris-segmented-item>',
  '  <solaris-segmented-item value="system">System</solaris-segmented-item>',
  '</solaris-segmented-control>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SEGMENTED_CONTROL_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
