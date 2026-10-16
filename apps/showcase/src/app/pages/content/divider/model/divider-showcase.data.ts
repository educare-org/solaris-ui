import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const DIVIDER_SHOWCASE_SLUG = 'divider';
export const DIVIDER_TRANSLATION_PREFIX = 'divider';

export const DIVIDER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.content', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.divider' },
];

export const DIVIDER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.week-view',
  route: '/scheduling/week-view',
};

export const DIVIDER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.avatar',
  route: '/data-display/avatar',
};

export const DIVIDER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'divider.section.examples' },
  { anchor: 'appearance', labelKey: 'divider.section.appearance' },
  { anchor: 'variant', labelKey: 'divider.section.variant' },
  { anchor: 'orientation', labelKey: 'divider.section.orientation' },
  { anchor: 'layout', labelKey: 'divider.section.layout' },
  { anchor: 'label', labelKey: 'divider.section.label' },
  { anchor: 'usage', labelKey: 'divider.section.usage' },
  { anchor: 'installation', labelKey: 'divider.section.installation' },
  { anchor: 'props', labelKey: 'divider.section.props' },
];

export const DIVIDER_SHOWCASE_IMPORT_CODE =
  "import { SolarisDividerComponent } from '@solaris-ui/angular';";

export const DIVIDER_SHOWCASE_BASIC_CODE = ['<solaris-divider />'].join('\n');

export const DIVIDER_SHOWCASE_APPEARANCE_SUBTLE_CODE = [
  '<solaris-divider appearance="subtle" />',
].join('\n');

export const DIVIDER_SHOWCASE_APPEARANCE_STRONG_CODE = [
  '<solaris-divider appearance="strong" />',
].join('\n');

export const DIVIDER_SHOWCASE_VARIANT_SOLID_CODE = [
  '<solaris-divider variant="solid" />',
].join('\n');

export const DIVIDER_SHOWCASE_VARIANT_DASHED_CODE = [
  '<solaris-divider variant="dashed" />',
].join('\n');

export const DIVIDER_SHOWCASE_VARIANT_DOTTED_CODE = [
  '<solaris-divider variant="dotted" />',
].join('\n');

export const DIVIDER_SHOWCASE_ORIENTATION_HORIZONTAL_CODE = [
  '<solaris-divider orientation="horizontal" />',
].join('\n');

export const DIVIDER_SHOWCASE_ORIENTATION_VERTICAL_CODE = [
  '<div style="display: flex; height: 100px">',
  '  <span>Item 1</span>',
  '  <solaris-divider orientation="vertical" />',
  '  <span>Item 2</span>',
  '</div>',
].join('\n');

export const DIVIDER_SHOWCASE_SPACING_CODE = [
  '<p>Content above</p>',
  '<solaris-divider spacing="none" />',
  '<p>Content below</p>',
  '<solaris-divider spacing="sm" />',
  '<p>Content above</p>',
  '<solaris-divider spacing="md" />',
  '<p>Content below</p>',
  '<solaris-divider spacing="lg" />',
  '<p>Content above</p>',
].join('\n');

export const DIVIDER_SHOWCASE_INSET_CODE = [
  '<p>Content above</p>',
  '<solaris-divider inset="none" />',
  '<p>Content below</p>',
  '<solaris-divider inset="start" />',
  '<p>Content above</p>',
  '<solaris-divider inset="end" />',
  '<p>Content below</p>',
  '<solaris-divider inset="both" />',
  '<p>Content above</p>',
].join('\n');

export const DIVIDER_SHOWCASE_LENGTH_CODE = [
  '<p>Content above</p>',
  '<solaris-divider width="12rem" />',
  '<p>Content below</p>',
  '<solaris-divider orientation="vertical" height="4rem" />',
].join('\n');

export const DIVIDER_SHOWCASE_LABEL_CENTER_CODE = [
  '<solaris-divider label="Section" textPosition="center" />',
].join('\n');

export const DIVIDER_SHOWCASE_LABEL_START_CODE = [
  '<solaris-divider label="Section" textPosition="start" />',
].join('\n');

export const DIVIDER_SHOWCASE_LABEL_END_CODE = [
  '<solaris-divider label="Section" textPosition="end" />',
].join('\n');

export const DIVIDER_SHOWCASE_DROPDOWN_CODE = [
  '<solaris-dropdown-menu>',
  '  <solaris-dropdown-menu-item>Edit</solaris-dropdown-menu-item>',
  '  <solaris-dropdown-menu-item>Duplicate</solaris-dropdown-menu-item>',
  '  <solaris-divider />',
  '  <solaris-dropdown-menu-item color="danger">Delete</solaris-dropdown-menu-item>',
  '</solaris-dropdown-menu>',
].join('\n');

export const DIVIDER_SHOWCASE_SEMANTIC_CODE = [
  '<solaris-divider [decorative]="false" aria-label="Section separator" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as DIVIDER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
