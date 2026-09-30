import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import type {
  SolarisBadgeAppearance,
  SolarisBadgeColor,
} from '@solaris-ui/angular';

/**
 * Dados estáticos (readonly) da página showcase de Badge.
 * O componente mantém apenas signals, os computed dinâmicos das
 * variações com tabs e as delegações para `createShowcasePageActions`.
 */

export const BADGE_SHOWCASE_SLUG = 'badge';
export const BADGE_TRANSLATION_PREFIX = 'badge';

export const BADGE_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.badge' },
];

export const BADGE_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.divider',
  route: '/content/divider',
};

export const BADGE_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.card',
  route: '/data-display/card',
};

export const BADGE_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'badge.section.examples' },
  { anchor: 'appearances', labelKey: 'badge.section.appearances' },
  { anchor: 'size-density', labelKey: 'badge.section.size-density' },
  { anchor: 'count', labelKey: 'badge.section.count' },
  { anchor: 'dot', labelKey: 'badge.section.dot' },
  { anchor: 'icons', labelKey: 'badge.section.icons' },
  { anchor: 'placement', labelKey: 'badge.section.placement' },
  { anchor: 'installation', labelKey: 'badge.section.installation' },
  { anchor: 'props', labelKey: 'badge.section.props' },
];

export const BADGE_SHOWCASE_APPEARANCES: readonly SolarisBadgeAppearance[] = [
  'solid',
  'tonal',
  'outline',
  'ghost',
];

export const BADGE_SHOWCASE_COLORS: readonly SolarisBadgeColor[] = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];

export const BADGE_SHOWCASE_IMPORT_CODE =
  "import { SolarisBadgeComponent, SolarisBadgeIconDirective } from '@solaris-ui/angular';";

export const BADGE_SHOWCASE_BASIC_CODE = [
  '<solaris-badge>Badge</solaris-badge>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as BADGE_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
