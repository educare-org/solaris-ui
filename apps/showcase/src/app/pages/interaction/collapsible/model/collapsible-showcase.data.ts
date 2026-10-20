import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const COLLAPSIBLE_SHOWCASE_SLUG = 'collapsible';
export const COLLAPSIBLE_TRANSLATION_PREFIX = 'collapsible';

export const COLLAPSIBLE_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.collapsible' },
  ];

export const COLLAPSIBLE_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.dropdown-menu',
  route: '/interaction/dropdown-menu',
};

export const COLLAPSIBLE_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.accordion',
  route: '/interaction/accordion',
};

export const COLLAPSIBLE_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'collapsible.section.examples' },
  { anchor: 'appearance', labelKey: 'collapsible.section.appearance' },
  { anchor: 'size-density', labelKey: 'collapsible.section.size-density' },
  { anchor: 'controlled', labelKey: 'collapsible.section.controlled' },
  { anchor: 'states', labelKey: 'collapsible.section.states' },
  { anchor: 'leading-icon', labelKey: 'collapsible.section.leading-icon' },
  { anchor: 'add-item', labelKey: 'collapsible.section.add-item' },
  { anchor: 'installation', labelKey: 'collapsible.section.installation' },
  { anchor: 'props', labelKey: 'collapsible.section.props' },
];

export const COLLAPSIBLE_SHOWCASE_IMPORT_CODE = `import { SolarisCollapsibleComponent } from '@solaris-ui/angular';`;

export const COLLAPSIBLE_SHOWCASE_BASIC_CODE = [
  '<solaris-collapsible label="Account settings">',
  '  <p>Manage your personal information here.</p>',
  '</solaris-collapsible>',
].join('\n');

export const COLLAPSIBLE_SHOWCASE_CONTROLLED_CODE = [
  '<solaris-collapsible [(open)]="isOpen" label="Controlled collapsible">',
  '  <p>This panel is controlled by the host component.</p>',
  '</solaris-collapsible>',
].join('\n');

export const COLLAPSIBLE_SHOWCASE_ADD_CODE = [
  '<solaris-collapsible',
  '  label="Profile"',
  '  leadingIcon="user"',
  '  [showAddAction]="true"',
  '  addActionLabel="Add section"',
  `  (addSubmitted)="onAdd($event)"`,
  '>',
  '  <p>Profile content.</p>',
  '</solaris-collapsible>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as COLLAPSIBLE_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
