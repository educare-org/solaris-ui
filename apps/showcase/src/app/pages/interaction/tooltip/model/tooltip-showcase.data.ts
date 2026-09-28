import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

/**
 * Dados estáticos (readonly) da página showcase de Tooltip.
 * O componente mantém apenas signals e as delegações para
 * `createShowcasePageActions` (não há computed dinâmico aqui).
 */

export const TOOLTIP_SHOWCASE_SLUG = 'tooltip';
export const TOOLTIP_TRANSLATION_PREFIX = 'tooltip';

export const TOOLTIP_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.tooltip' },
];

export const TOOLTIP_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.popover',
  route: '/interaction/popover',
};

export const TOOLTIP_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.dropdown-menu',
  route: '/interaction/dropdown-menu',
};

export const TOOLTIP_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'tooltip.section.examples' },
  { anchor: 'triggers', labelKey: 'tooltip.section.triggers' },
  { anchor: 'content', labelKey: 'tooltip.section.content' },
  { anchor: 'appearance', labelKey: 'tooltip.section.appearance' },
  { anchor: 'sizes', labelKey: 'tooltip.section.sizes' },
  { anchor: 'radius', labelKey: 'tooltip.section.radius' },
  { anchor: 'placement', labelKey: 'tooltip.section.placement' },
  { anchor: 'delays', labelKey: 'tooltip.section.delays' },
  { anchor: 'states', labelKey: 'tooltip.section.states' },
  { anchor: 'installation', labelKey: 'tooltip.section.installation' },
  { anchor: 'props', labelKey: 'tooltip.section.props' },
];

export const TOOLTIP_SHOWCASE_IMPORT_CODE =
  "import { SolarisTooltipDirective } from '@solaris-ui/angular';";

export const TOOLTIP_SHOWCASE_BASIC_CODE = [
  '<button [solarisTooltip]="\'Edit item\'" solaris-button>',
  '  Edit',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_TRIGGER_HOVER_CODE = [
  '<button [solarisTooltip]="\'Edit item\'" solaris-button>',
  '  Edit',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_TRIGGER_CLICK_CODE = [
  '<button [solarisTooltip]="\'Persists on click\'" solarisTooltipTrigger="click" solaris-button>',
  '  Help',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_TRIGGER_CLOSEABLE_CODE = [
  '<button [solarisTooltip]="\'Has a close button\'" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true" solaris-button>',
  '  Info',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_TRIGGER_MANUAL_CODE = [
  '<button [solarisTooltip]="\'Controlled\'" solarisTooltipTrigger="manual" [solarisTooltipOpen]="isOpen" solaris-button>',
  '  Controlled',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_CONTENT_TITLE_BODY_CODE = [
  '<button [solarisTooltip]="\'Available after payment confirmation.\'" [solarisTooltipTitle]="\'Pending access\'" solaris-button>',
  '  Status',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_CONTENT_ICON_CODE = [
  '<button [solarisTooltip]="\'This metric considers the last 30 days.\'" solarisTooltipIcon="info" solaris-button>',
  '  Help',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_CONTENT_TEMPLATE_CODE = [
  '<button [solarisTooltipFor]="paymentTooltip" solarisTooltipTrigger="click" [solarisTooltipCloseable]="true" solaris-button>',
  '  Learn more',
  '</button>',
  '',
  '<ng-template #paymentTooltip>',
  '  Payment can take up to 48 hours to be confirmed.',
  '</ng-template>',
].join('\n');

export const TOOLTIP_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<button [solarisTooltip]="\'Outline\'" solarisTooltipAppearance="outline" solarisTooltipTrigger="click" solaris-button>',
  '  Outline',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<button [solarisTooltip]="\'Surface\'" solarisTooltipAppearance="surface" solarisTooltipTrigger="click" solaris-button>',
  '  Surface',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_APPEARANCE_INVERSE_CODE = [
  '<button [solarisTooltip]="\'Inverse\'" solarisTooltipAppearance="inverse" solarisTooltipTrigger="click" solaris-button>',
  '  Inverse',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_SIZE_SM_CODE = [
  '<button [solarisTooltip]="\'Small\'" solarisTooltipSize="sm" solarisTooltipTrigger="click" solaris-button>',
  '  sm',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_SIZE_MD_CODE = [
  '<button [solarisTooltip]="\'Medium\'" solarisTooltipSize="md" solarisTooltipTrigger="click" solaris-button>',
  '  md',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_SIZE_LG_CODE = [
  '<button [solarisTooltip]="\'Large\'" solarisTooltipSize="lg" solarisTooltipTrigger="click" solaris-button>',
  '  lg',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_RADIUS_SM_CODE = [
  '<button [solarisTooltip]="\'Radius sm\'" solarisTooltipRadius="sm" solarisTooltipTrigger="click" solaris-button>',
  '  sm',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_RADIUS_MD_CODE = [
  '<button [solarisTooltip]="\'Radius md\'" solarisTooltipRadius="md" solarisTooltipTrigger="click" solaris-button>',
  '  md',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_RADIUS_LG_CODE = [
  '<button [solarisTooltip]="\'Radius lg\'" solarisTooltipRadius="lg" solarisTooltipTrigger="click" solaris-button>',
  '  lg',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_PLACEMENT_TOP_CODE = [
  '<button [solarisTooltip]="\'Top\'" solarisTooltipPlacement="top" solarisTooltipTrigger="click" solaris-button>',
  '  Top',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_PLACEMENT_BOTTOM_CODE = [
  '<button [solarisTooltip]="\'Bottom\'" solarisTooltipPlacement="bottom" solarisTooltipTrigger="click" solaris-button>',
  '  Bottom',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_PLACEMENT_RIGHT_CODE = [
  '<button [solarisTooltip]="\'Right\'" solarisTooltipPlacement="right" solarisTooltipTrigger="click" solaris-button>',
  '  Right',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_PLACEMENT_LEFT_CODE = [
  '<button [solarisTooltip]="\'Left\'" solarisTooltipPlacement="left" solarisTooltipTrigger="click" solaris-button>',
  '  Left',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_DELAYS_CODE = [
  '<button [solarisTooltip]="\'Skips the wait on quick re-hover\'" [solarisTooltipShowDelay]="300" [solarisTooltipHideDelay]="100" [solarisTooltipSkipDelay]="300" solaris-button>',
  '  Hover me, leave, hover again',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_DISABLED_CODE = [
  '<button [solarisTooltip]="\'Never appears\'" [solarisTooltipDisabled]="true" solaris-button>',
  '  Disabled',
  '</button>',
].join('\n');

export const TOOLTIP_SHOWCASE_DISABLED_WRAPPER_CODE = [
  '<span solaris-tooltip="Why is this disabled?">',
  '  <button solaris-button [disabled]="true">Edit</button>',
  '</span>',
].join('\n');

export const TOOLTIP_SHOWCASE_MAX_WIDTH_CODE = [
  '<button [solarisTooltip]="\'Very long text wraps…\'" [solarisTooltipMaxWidth]="\'256px\'" solarisTooltipTrigger="click" solaris-button>',
  '  Max width',
  '</button>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as TOOLTIP_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
