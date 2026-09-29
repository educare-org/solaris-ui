import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

/**
 * Dados estáticos (readonly) da página showcase de Button Group.
 * O componente mantém apenas signals, computed dinâmicos e as
 * delegações para `createShowcasePageActions`.
 */

export const BUTTON_GROUP_SHOWCASE_SLUG = 'button-group';
export const BUTTON_GROUP_TRANSLATION_PREFIX = 'button-group';

export const BUTTON_GROUP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.actions', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.button-group' },
  ];

export const BUTTON_GROUP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.icon-button',
  route: '/actions/icon-button',
};

export const BUTTON_GROUP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.divider',
  route: '/content/divider',
};

export const BUTTON_GROUP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'basic', labelKey: 'button-group.section.basic' },
  { anchor: 'size-density', labelKey: 'button-group.section.size-density' },
  { anchor: 'orientation', labelKey: 'button-group.section.orientation' },
  { anchor: 'attached', labelKey: 'button-group.section.attached' },
  { anchor: 'mixed', labelKey: 'button-group.section.mixed' },
  { anchor: 'states', labelKey: 'button-group.section.states' },
  { anchor: 'full-width', labelKey: 'button-group.section.full-width' },
  { anchor: 'installation', labelKey: 'button-group.section.installation' },
  { anchor: 'props', labelKey: 'button-group.section.props' },
];

export const BUTTON_GROUP_SHOWCASE_IMPORT_CODE =
  "import { SolarisButtonGroupComponent } from '@solaris-ui/angular';";

export { SHOWCASE_INSTALL_COMMANDS as BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
