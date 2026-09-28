import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

/**
 * Dados estáticos (readonly) da página showcase de Tabs.
 * O componente mantém apenas signals, o computed dinâmico de
 * size/density/appearance e as delegações para `createShowcasePageActions`.
 */

export const TABS_SHOWCASE_SLUG = 'tabs';
export const TABS_TRANSLATION_PREFIX = 'tabs';

export const TABS_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.tabs' },
];

export const TABS_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.accordion',
  route: '/interaction/accordion',
};

export const TABS_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.breadcrumb',
  route: '/navigation/breadcrumb',
};

export const TABS_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'tabs.section.examples' },
  { anchor: 'appearances', labelKey: 'tabs.section.appearances' },
  { anchor: 'size-density', labelKey: 'tabs.section.size-density' },
  { anchor: 'color', labelKey: 'tabs.section.color' },
  { anchor: 'orientation', labelKey: 'tabs.section.orientation' },
  { anchor: 'layout', labelKey: 'tabs.section.layout' },
  { anchor: 'features', labelKey: 'tabs.section.features' },
  { anchor: 'states', labelKey: 'tabs.section.states' },
  { anchor: 'transitions', labelKey: 'tabs.section.transitions' },
  { anchor: 'installation', labelKey: 'tabs.section.installation' },
  { anchor: 'props', labelKey: 'tabs.section.props' },
];

export const TABS_SHOWCASE_IMPORT_CODE =
  "import { SolarisTabsComponent, SolarisTabComponent, SolarisTabPanelComponent } from '@solaris-ui/angular';";

export const TABS_SHOWCASE_BASIC_CODE = [
  '<solaris-tabs [(value)]="activeTab">',
  '  <solaris-tab value="code">Code</solaris-tab>',
  '  <solaris-tab value="issues">Issues</solaris-tab>',
  '  <solaris-tab value="pull-requests">Pull requests</solaris-tab>',
  '  <solaris-tab value="actions">Actions</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_APPEARANCE_UNDERLINE_CODE = [
  '<solaris-tabs appearance="underline" [(value)]="activeTab">',
  '  <solaris-tab value="code">Code</solaris-tab>',
  '  <solaris-tab value="issues">Issues</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_APPEARANCE_PILLS_CODE = [
  '<solaris-tabs appearance="pills" [(value)]="activeTab">',
  '  <solaris-tab value="drafts">Drafts</solaris-tab>',
  '  <solaris-tab value="active">Active</solaris-tab>',
  '  <solaris-tab value="archived">Archived</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_APPEARANCE_ENCLOSED_CODE = [
  '<solaris-tabs appearance="enclosed" [(value)]="activeTab">',
  '  <solaris-tab value="details">Details</solaris-tab>',
  '  <solaris-tab value="activity">Activity</solaris-tab>',
  '  <solaris-tab value="settings">Settings</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_COLOR_PRIMARY_CODE = [
  '<solaris-tabs color="primary" defaultValue="a" aria-label="Primary">',
  '  <solaris-tab value="a">Option A</solaris-tab>',
  '  <solaris-tab value="b">Option B</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_COLOR_NEUTRAL_CODE = [
  '<solaris-tabs color="neutral" defaultValue="a" aria-label="Neutral">',
  '  <solaris-tab value="a">Option A</solaris-tab>',
  '  <solaris-tab value="b">Option B</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_VERTICAL_CODE = [
  '<solaris-tabs orientation="vertical" [(value)]="activeTab">',
  '  <solaris-tab value="general">General</solaris-tab>',
  '  <solaris-tab value="security">Security</solaris-tab>',
  '  <solaris-tab value="notifications">Notifications</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_FULL_WIDTH_CODE = [
  '<solaris-tabs [fullWidth]="true" [(value)]="activeTab">',
  '  <solaris-tab value="overview">Overview</solaris-tab>',
  '  <solaris-tab value="analytics">Analytics</solaris-tab>',
  '  <solaris-tab value="reports">Reports</solaris-tab>',
  '  <solaris-tab value="export">Export</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_SCROLLABLE_CODE = [
  '<solaris-tabs [(value)]="activeTab">',
  '  <solaris-tab value="tab-1">Tab 1</solaris-tab>',
  '  <solaris-tab value="tab-2">Tab 2</solaris-tab>',
  '  <!-- ... more tabs scroll horizontally -->',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_SHAPE_CODE = [
  '<solaris-tabs appearance="pills" shape="wide" [(value)]="activeTab">',
  '  <solaris-tab value="drafts">Drafts</solaris-tab>',
  '  <solaris-tab value="active">Active</solaris-tab>',
  '  <solaris-tab value="archived">Archived</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_WITH_PANELS_CODE = [
  '<solaris-tabs [(value)]="activeTab">',
  '  <solaris-tab value="code" icon="code">Code</solaris-tab>',
  '  <solaris-tab value="issues" icon="issue" [badge]="30">Issues</solaris-tab>',
  '',
  '  <solaris-tab-panel value="code">Code content</solaris-tab-panel>',
  '  <solaris-tab-panel value="issues">Issues content</solaris-tab-panel>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_ICONS_BADGES_CODE = [
  '<solaris-tabs [(value)]="activeTab">',
  '  <solaris-tab value="code" icon="code">Code</solaris-tab>',
  '  <solaris-tab value="issues" icon="issue" [badge]="30">Issues</solaris-tab>',
  '  <solaris-tab value="pull-requests" icon="pull-request" [badge]="5">Pull requests</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_DISABLED_CODE = [
  '<solaris-tabs [(value)]="activeTab">',
  '  <solaris-tab value="enabled-1">Enabled 1</solaris-tab>',
  '  <solaris-tab value="disabled-1" [disabled]="true">Disabled tab</solaris-tab>',
  '  <solaris-tab value="enabled-2">Enabled 2</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_MANUAL_ACTIVATION_CODE = [
  '<solaris-tabs activationMode="manual" [(value)]="activeTab">',
  '  <solaris-tab value="step-1">Step 1</solaris-tab>',
  '  <solaris-tab value="step-2">Step 2</solaris-tab>',
  '  <solaris-tab value="step-3">Step 3</solaris-tab>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_TRANSITION_FADE_CODE = [
  '<solaris-tabs contentTransition="fade" [(value)]="activeTab">',
  '  <solaris-tab value="a">Section A</solaris-tab>',
  '  <solaris-tab value="b">Section B</solaris-tab>',
  '',
  '  <solaris-tab-panel value="a">Section A content</solaris-tab-panel>',
  '  <solaris-tab-panel value="b">Section B content</solaris-tab-panel>',
  '</solaris-tabs>',
].join('\n');

export const TABS_SHOWCASE_TRANSITION_SLIDE_CODE = [
  '<solaris-tabs contentTransition="slide" [(value)]="activeTab">',
  '  <solaris-tab value="first">First</solaris-tab>',
  '  <solaris-tab value="second">Second</solaris-tab>',
  '',
  '  <solaris-tab-panel value="first">First panel</solaris-tab-panel>',
  '  <solaris-tab-panel value="second">Second panel</solaris-tab-panel>',
  '</solaris-tabs>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as TABS_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
