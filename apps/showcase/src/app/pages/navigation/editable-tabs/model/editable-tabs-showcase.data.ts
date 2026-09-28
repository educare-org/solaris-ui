import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const EDITABLE_TABS_SHOWCASE_SLUG = 'editable-tabs';
export const EDITABLE_TABS_TRANSLATION_PREFIX = 'editableTabs';

export const EDITABLE_TABS_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.editable-tabs' },
  ];

export const EDITABLE_TABS_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tabs',
  route: '/navigation/tabs',
};

export const EDITABLE_TABS_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.breadcrumb',
  route: '/navigation/breadcrumb',
};

export const EDITABLE_TABS_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'editableTabs.section.examples' },
  { anchor: 'management', labelKey: 'editableTabs.section.management' },
  { anchor: 'features', labelKey: 'editableTabs.section.features' },
  { anchor: 'layout', labelKey: 'editableTabs.section.layout' },
  { anchor: 'installation', labelKey: 'editableTabs.section.installation' },
  { anchor: 'props', labelKey: 'editableTabs.section.props' },
];

export const EDITABLE_TABS_SHOWCASE_IMPORT_CODE =
  "import { SolarisEditableTabsComponent } from '@solaris-ui/angular';";

export const EDITABLE_TABS_SHOWCASE_BASIC_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  (tabRename)="onRename($event)"',
  '  (tabRemove)="onRemove($event)"',
  '  (tabMove)="onMove($event)"',
  '  (defaultTabChange)="onDefaultChange($event)"',
  '/>',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_ICONS_BADGES_CODE = [
  '<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" />',
  '',
  "// tabs: [{ value: 'code', label: 'Code', icon: 'code', badge: 12 }, ...]",
].join('\n');

export const EDITABLE_TABS_SHOWCASE_LOCKED_CODE = [
  '<solaris-editable-tabs [tabs]="tabs" [(value)]="activeTab" />',
  '',
  "// tabs: [{ value: 'general', label: 'General', locked: true }, ...]",
].join('\n');

export const EDITABLE_TABS_SHOWCASE_RENAME_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [renamable]="true"',
  '  (tabRename)="onRename($event)"',
  '/>',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_REMOVE_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [minTabs]="1"',
  '  (tabRemove)="onRemove($event)"',
  '/>',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_MOVE_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [dragToReorder]="true"',
  '  (tabMove)="onMove($event)"',
  '/>',
  '',
  '// tabMove fires for both the action-menu move and drag and drop.',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_DEFAULT_EVENT_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [defaultValue]="defaultTab"',
  '  (defaultTabChange)="onDefaultChange($event)"',
  '/>',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_CUSTOM_ACTIONS_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  (tabAction)="onAction($event)"',
  '/>',
  '',
  '// tab: { value, label, customActions: [{ id, label, icon }] }',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_VERTICAL_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [orientation]="\'vertical\'"',
  '/>',
].join('\n');

export const EDITABLE_TABS_SHOWCASE_COMPACT_CODE = [
  '<solaris-editable-tabs',
  '  [tabs]="tabs"',
  '  [(value)]="activeTab"',
  '  [density]="\'compact\'"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as EDITABLE_TABS_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
