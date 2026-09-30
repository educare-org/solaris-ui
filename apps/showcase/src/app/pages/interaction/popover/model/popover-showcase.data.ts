import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const POPOVER_SHOWCASE_SLUG = 'popover';
export const POPOVER_TRANSLATION_PREFIX = 'popover';

export const POPOVER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.popover' },
];

export const POPOVER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.multi-select',
  route: '/forms/multi-select',
};

export const POPOVER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tooltip',
  route: '/interaction/tooltip',
};

export const POPOVER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'popover.section.examples' },
  { anchor: 'placements', labelKey: 'popover.section.placements' },
  { anchor: 'align', labelKey: 'popover.section.align' },
  { anchor: 'appearance', labelKey: 'popover.section.appearance' },
  { anchor: 'padding', labelKey: 'popover.section.padding' },
  { anchor: 'radius', labelKey: 'popover.section.radius' },
  { anchor: 'sizing', labelKey: 'popover.section.sizing' },
  { anchor: 'behaviors', labelKey: 'popover.section.behaviors' },
  { anchor: 'accessibility', labelKey: 'popover.section.accessibility' },
  { anchor: 'installation', labelKey: 'popover.section.installation' },
  { anchor: 'props', labelKey: 'popover.section.props' },
];

export const POPOVER_SHOWCASE_IMPORT_CODE =
  "import { SolarisPopoverDirective, SolarisPopoverTriggerDirective } from '@solaris-ui/angular';";

export const POPOVER_SHOWCASE_BASIC_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="helpPopover" solarisPopoverPadding="md">',
  '  Help',
  '</button>',
  '',
  '<ng-template #helpPopover solaris-popover>',
  '  <p>This panel can contain structured, interactive content.</p>',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PLACEMENT_TOP_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="topPopover" solarisPopoverPlacement="top" solarisPopoverPadding="md">',
  '  Top',
  '</button>',
  '',
  '<ng-template #topPopover solaris-popover>',
  '  Popover content on top.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PLACEMENT_RIGHT_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="rightPopover" solarisPopoverPlacement="right" solarisPopoverPadding="md">',
  '  Right',
  '</button>',
  '',
  '<ng-template #rightPopover solaris-popover>',
  '  Popover content on the right.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PLACEMENT_BOTTOM_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="bottomPopover" solarisPopoverPlacement="bottom" solarisPopoverPadding="md">',
  '  Bottom',
  '</button>',
  '',
  '<ng-template #bottomPopover solaris-popover>',
  '  Popover content at the bottom.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PLACEMENT_LEFT_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="leftPopover" solarisPopoverPlacement="left" solarisPopoverPadding="md">',
  '  Left',
  '</button>',
  '',
  '<ng-template #leftPopover solaris-popover>',
  '  Popover content on the left.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_ALIGN_START_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="startPopover" solarisPopoverAlign="start" solarisPopoverPadding="md">',
  '  Start',
  '</button>',
  '',
  '<ng-template #startPopover solaris-popover>',
  '  Aligned to the start edge.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_ALIGN_CENTER_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="centerPopover" solarisPopoverAlign="center" solarisPopoverPadding="md">',
  '  Center',
  '</button>',
  '',
  '<ng-template #centerPopover solaris-popover>',
  '  Centered below the trigger.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_ALIGN_END_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="endPopover" solarisPopoverAlign="end" solarisPopoverPadding="md">',
  '  End',
  '</button>',
  '',
  '<ng-template #endPopover solaris-popover>',
  '  Aligned to the end edge.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="surfacePopover" solarisPopoverAppearance="surface" solarisPopoverPadding="md">',
  '  Surface',
  '</button>',
  '',
  '<ng-template #surfacePopover solaris-popover>',
  '  Surface appearance with shadow background.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="outlinePopover" solarisPopoverAppearance="outline" solarisPopoverPadding="md">',
  '  Outline',
  '</button>',
  '',
  '<ng-template #outlinePopover solaris-popover>',
  '  Outline appearance with visible border.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PADDING_NONE_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingNonePopover" solarisPopoverPadding="none">',
  '  None',
  '</button>',
  '',
  '<ng-template #paddingNonePopover solaris-popover>',
  '  No padding inside the panel.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PADDING_SM_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingSmPopover" solarisPopoverPadding="sm">',
  '  Small',
  '</button>',
  '',
  '<ng-template #paddingSmPopover solaris-popover>',
  '  Small padding inside the panel.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PADDING_MD_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingMdPopover" solarisPopoverPadding="md">',
  '  Medium',
  '</button>',
  '',
  '<ng-template #paddingMdPopover solaris-popover>',
  '  Medium padding inside the panel.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_PADDING_LG_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="paddingLgPopover" solarisPopoverPadding="lg">',
  '  Large',
  '</button>',
  '',
  '<ng-template #paddingLgPopover solaris-popover>',
  '  Large padding inside the panel.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_RADIUS_NONE_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusNonePopover" solarisPopoverRadius="none" solarisPopoverPadding="md">',
  '  None',
  '</button>',
  '',
  '<ng-template #radiusNonePopover solaris-popover>',
  '  No border radius.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_RADIUS_SM_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusSmPopover" solarisPopoverRadius="sm" solarisPopoverPadding="md">',
  '  Small',
  '</button>',
  '',
  '<ng-template #radiusSmPopover solaris-popover>',
  '  Small border radius.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_RADIUS_MD_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusMdPopover" solarisPopoverRadius="md" solarisPopoverPadding="md">',
  '  Medium',
  '</button>',
  '',
  '<ng-template #radiusMdPopover solaris-popover>',
  '  Medium border radius.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_RADIUS_LG_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusLgPopover" solarisPopoverRadius="lg" solarisPopoverPadding="md">',
  '  Large',
  '</button>',
  '',
  '<ng-template #radiusLgPopover solaris-popover>',
  '  Large border radius.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_RADIUS_XL_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="radiusXlPopover" solarisPopoverRadius="xl" solarisPopoverPadding="md">',
  '  Extra large',
  '</button>',
  '',
  '<ng-template #radiusXlPopover solaris-popover>',
  '  Extra large border radius.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_MATCH_WIDTH_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="matchWidthPopover" [solarisPopoverMatchTriggerWidth]="true" solarisPopoverPadding="md">',
  '  Wide Trigger',
  '</button>',
  '',
  '<ng-template #matchWidthPopover solaris-popover>',
  '  This panel has the same width as the trigger button.',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_MIN_MAX_WIDTH_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="minWidthPopover" [solarisPopoverMinWidth]="\'300px\'" solarisPopoverPadding="md">',
  '  Min Width 300px',
  '</button>',
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="maxWidthPopover" [solarisPopoverMaxWidth]="\'200px\'" solarisPopoverPadding="md">',
  '  Max Width 200px',
  '</button>',
].join('\n');

export const POPOVER_SHOWCASE_MAX_HEIGHT_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="tallPopover" [solarisPopoverMaxHeight]="240" solarisPopoverPadding="md">',
  '  Max height 240px',
  '</button>',
  '',
  '<ng-template #tallPopover solaris-popover>',
  '  <!-- long content scrolls inside the panel -->',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_CLOSE_BEHAVIOR_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="outsideClickPopover" [solarisPopoverCloseOnOutsideClick]="true" [solarisPopoverCloseOnEscape]="false" solarisPopoverPadding="md">',
  '  Outside Click',
  '</button>',
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="escapePopover" [solarisPopoverCloseOnOutsideClick]="false" [solarisPopoverCloseOnEscape]="true" solarisPopoverPadding="md">',
  '  Escape',
  '</button>',
].join('\n');

export const POPOVER_SHOWCASE_INTERACTIVE_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="actionsPopover" solarisPopoverPadding="md">',
  '  Filters',
  '</button>',
  '',
  '<ng-template #actionsPopover solaris-popover>',
  '  <button solaris-button appearance="solid">Apply</button>',
  '  <button solaris-button appearance="ghost">Clear</button>',
  '</ng-template>',
].join('\n');

export const POPOVER_SHOWCASE_REACTIVE_CODE = [
  "import { CdkScrollable } from '@angular/cdk/scrolling';",
  '',
  '<div class="scroll-area" cdkScrollable>',
  '  <button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="reactivePopover" solarisPopoverPadding="md">',
  '    Scroll Test',
  '  </button>',
  '',
  '  <ng-template #reactivePopover solaris-popover>',
  '    This popover repositions automatically when you scroll.',
  '  </ng-template>',
  '</div>',
].join('\n');

export const POPOVER_SHOWCASE_ACCESSIBILITY_CODE = [
  '<button solaris-button solaris-popover-trigger [solarisPopoverTriggerFor]="a11yPopover" solarisPopoverPanelRole="region" solarisPopoverAriaHasPopup="true" solarisPopoverPadding="md">',
  '  A11y Popover',
  '</button>',
  '',
  '<ng-template #a11yPopover solaris-popover>',
  '  This popover has role="region" and aria-haspopup="true".',
  '</ng-template>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as POPOVER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
