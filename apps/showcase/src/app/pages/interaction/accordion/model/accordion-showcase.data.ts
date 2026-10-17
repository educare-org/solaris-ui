import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const ACCORDION_SHOWCASE_SLUG = 'accordion';
export const ACCORDION_TRANSLATION_PREFIX = 'accordion';

export const ACCORDION_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.accordion' },
  ];

export const ACCORDION_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.collapsible',
  route: '/interaction/collapsible',
};

export const ACCORDION_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tabs',
  route: '/navigation/tabs',
};

export const ACCORDION_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'accordion.section.examples' },
  { anchor: 'modes', labelKey: 'accordion.section.modes' },
  { anchor: 'appearance', labelKey: 'accordion.section.appearance' },
  { anchor: 'size-density', labelKey: 'accordion.section.size-density' },
  { anchor: 'behavior', labelKey: 'accordion.section.behavior' },
  { anchor: 'leading-icon', labelKey: 'accordion.section.leading-icon' },
  { anchor: 'installation', labelKey: 'accordion.section.installation' },
  { anchor: 'props', labelKey: 'accordion.section.props' },
];

export const ACCORDION_SHOWCASE_IMPORT_CODE = `import {
  SolarisAccordionComponent,
  SolarisCollapsibleComponent
} from '@solaris-ui/angular';`;

export const ACCORDION_SHOWCASE_BASIC_CODE = [
  '<solaris-accordion [(value)]="openValue">',
  '  <solaris-collapsible value="a" label="Section A">',
  '    <p>Content A.</p>',
  '  </solaris-collapsible>',
  '  <solaris-collapsible value="b" label="Section B">',
  '    <p>Content B.</p>',
  '  </solaris-collapsible>',
  '</solaris-accordion>',
].join('\n');

export const ACCORDION_SHOWCASE_MULTIPLE_CODE = [
  '<solaris-accordion type="multiple" [(value)]="openValues">',
  '  <solaris-collapsible value="a" label="Billing">',
  '    <p>View invoices here.</p>',
  '  </solaris-collapsible>',
  '  <solaris-collapsible value="b" label="Teams">',
  '    <p>Invite members here.</p>',
  '  </solaris-collapsible>',
  '</solaris-accordion>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as ACCORDION_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
