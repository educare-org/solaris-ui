import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const DROPDOWN_MENU_SHOWCASE_SLUG = 'dropdown-menu';
export const DROPDOWN_MENU_TRANSLATION_PREFIX = 'dropdown-menu';

export const DROPDOWN_MENU_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.dropdown-menu' },
  ];

export const DROPDOWN_MENU_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tooltip',
  route: '/interaction/tooltip',
};

export const DROPDOWN_MENU_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.collapsible',
  route: '/interaction/collapsible',
};

export const DROPDOWN_MENU_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'dropdown-menu.section.examples' },
  { anchor: 'content', labelKey: 'dropdown-menu.section.content' },
  { anchor: 'groups', labelKey: 'dropdown-menu.section.groups' },
  { anchor: 'states', labelKey: 'dropdown-menu.section.states' },
  { anchor: 'appearance', labelKey: 'dropdown-menu.section.appearance' },
  { anchor: 'submenus', labelKey: 'dropdown-menu.section.submenus' },
  { anchor: 'keyboard', labelKey: 'dropdown-menu.section.keyboard' },
  { anchor: 'installation', labelKey: 'dropdown-menu.section.installation' },
  { anchor: 'props', labelKey: 'dropdown-menu.section.props' },
];

export const DROPDOWN_MENU_SHOWCASE_IMPORT_CODE = [
  'import {',
  '  SolarisDividerComponent,',
  '  SolarisButtonDirective,',
  '  SolarisDropdownMenuComponent,',
  '  SolarisDropdownMenuTriggerDirective,',
  '  SolarisDropdownMenuItemComponent,',
  '  SolarisDropdownMenuGroupComponent,',
  '  SolarisDropdownMenuLabelComponent,',
  '  SolarisDropdownSubmenuComponent,',
  '  SolarisDropdownSubmenuTriggerComponent,',
  "} from '@solaris-ui/angular';",
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_BASIC_CODE = [
  '<button',
  '  solaris-button',
  '  solaris-dropdown-menu-trigger',
  '  [solarisDropdownMenuTriggerFor]="basicMenu"',
  '>',
  '  Open Menu',
  '</button>',
  '<solaris-dropdown-menu #basicMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" />',
  '  <solaris-dropdown-menu-item label="Delete" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_WITH_ICONS_CODE = [
  '<solaris-dropdown-menu #iconMenu>',
  '  <solaris-dropdown-menu-item label="Edit" icon="edit" />',
  '  <solaris-dropdown-menu-item label="Copy" icon="copy" />',
  '  <solaris-dropdown-menu-item label="Share" icon="share" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_SHORTCUTS_CODE = [
  '<solaris-dropdown-menu #shortcutMenu>',
  '  <solaris-dropdown-menu-item label="Edit" shortcut="Ctrl+E" />',
  '  <solaris-dropdown-menu-item label="Copy" shortcut="Ctrl+C" />',
  '  <solaris-dropdown-menu-item label="Paste" shortcut="Ctrl+V" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_DIVIDER_CODE = [
  '<solaris-dropdown-menu #dividerMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" />',
  '  <solaris-divider />',
  '  <solaris-dropdown-menu-item label="Delete" color="danger" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_GROUPS_CODE = [
  '<solaris-dropdown-menu #groupMenu>',
  '  <solaris-dropdown-menu-group>',
  '    <solaris-dropdown-menu-label label="View" />',
  '    <solaris-dropdown-menu-item label="Zoom In" />',
  '    <solaris-dropdown-menu-item label="Zoom Out" />',
  '  </solaris-dropdown-menu-group>',
  '  <solaris-dropdown-menu-group>',
  '    <solaris-dropdown-menu-label label="Edit" />',
  '    <solaris-dropdown-menu-item label="Cut" />',
  '    <solaris-dropdown-menu-item label="Copy" />',
  '  </solaris-dropdown-menu-group>',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_DANGEROUS_CODE = [
  '<solaris-dropdown-menu #dangerMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" />',
  '  <solaris-divider />',
  '  <solaris-dropdown-menu-item label="Delete" color="danger" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_DISABLED_CODE = [
  '<solaris-dropdown-menu #disabledMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" [disabled]="true" />',
  '  <solaris-dropdown-menu-item label="Delete" color="danger" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_CHECKBOX_CODE = [
  '<solaris-dropdown-menu #checkboxMenu>',
  '  <solaris-dropdown-menu-item',
  '    label="Show Toolbar"',
  '    type="checkbox"',
  '    [checked]="toolbarVisible"',
  '  />',
  '  <solaris-dropdown-menu-item',
  '    label="Show Sidebar"',
  '    type="checkbox"',
  '    [checked]="sidebarVisible"',
  '  />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_RADIO_CODE = [
  '<solaris-dropdown-menu #radioMenu>',
  '  <solaris-dropdown-menu-item',
  '    label="Sort by Name"',
  '    type="radio"',
  '    [checked]="sortBy === \'name\'"',
  '  />',
  '  <solaris-dropdown-menu-item',
  '    label="Sort by Date"',
  '    type="radio"',
  '    [checked]="sortBy === \'date\'"',
  '  />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<button',
  '  solaris-button',
  '  solaris-dropdown-menu-trigger',
  '  [solarisDropdownMenuAppearance]="\'surface\'"',
  '  [solarisDropdownMenuTriggerFor]="surfaceMenu"',
  '>',
  '  Surface',
  '</button>',
  '<solaris-dropdown-menu #surfaceMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" />',
  '  <solaris-dropdown-menu-item label="Delete" color="danger" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<button',
  '  solaris-button',
  '  solaris-dropdown-menu-trigger',
  '  [solarisDropdownMenuAppearance]="\'outline\'"',
  '  [solarisDropdownMenuTriggerFor]="outlineMenu"',
  '>',
  '  Outline',
  '</button>',
  '<solaris-dropdown-menu #outlineMenu>',
  '  <solaris-dropdown-menu-item label="Edit" />',
  '  <solaris-dropdown-menu-item label="Duplicate" />',
  '  <solaris-dropdown-menu-item label="Delete" color="danger" />',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_SUBMENU_BASIC_CODE = [
  '<solaris-dropdown-menu #submenuMenu>',
  '  <solaris-dropdown-menu-item label="Rename" icon="edit" />',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="download">',
  '      Export',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="PDF" />',
  '      <solaris-dropdown-menu-item label="CSV" />',
  '      <solaris-dropdown-menu-item label="XLSX" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '  <solaris-divider />',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="settings">',
  '      Advanced',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="Permissions" />',
  '      <solaris-dropdown-menu-item label="Audit Log" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_SUBMENU_NESTED_CODE = [
  '<solaris-dropdown-menu #nestedMenu>',
  '  <solaris-dropdown-menu-item label="Edit" icon="edit" />',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="move">',
  '      Move to',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="Archive" />',
  '      <solaris-dropdown-submenu>',
  '        <solaris-dropdown-submenu-trigger icon="trash">',
  '          Trash',
  '        </solaris-dropdown-submenu-trigger>',
  '        <solaris-dropdown-menu>',
  '          <solaris-dropdown-menu-item label="Soft Delete" />',
  '          <solaris-dropdown-menu-item label="Hard Delete" color="danger" />',
  '        </solaris-dropdown-menu>',
  '      </solaris-dropdown-submenu>',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_SUBMENU_ICONS_CODE = [
  '<solaris-dropdown-menu #submenuIconMenu>',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="download">',
  '      Export',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="PDF" icon="file-text" />',
  '      <solaris-dropdown-menu-item label="CSV" icon="file-text" />',
  '      <solaris-dropdown-menu-item label="XLSX" icon="file-text" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '  <solaris-divider />',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="eye">',
  '      View Density',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="Compact" />',
  '      <solaris-dropdown-menu-item label="Comfortable" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '</solaris-dropdown-menu>',
].join('\n');

export const DROPDOWN_MENU_SHOWCASE_SUBMENU_DISABLED_CODE = [
  '<solaris-dropdown-menu #submenuDisabledMenu>',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="download">',
  '      Export',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="PDF" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '  <solaris-dropdown-submenu>',
  '    <solaris-dropdown-submenu-trigger icon="settings" [disabled]="true">',
  '      Disabled Action',
  '    </solaris-dropdown-submenu-trigger>',
  '    <solaris-dropdown-menu>',
  '      <solaris-dropdown-menu-item label="Permissions" />',
  '    </solaris-dropdown-menu>',
  '  </solaris-dropdown-submenu>',
  '</solaris-dropdown-menu>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as DROPDOWN_MENU_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
