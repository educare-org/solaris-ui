import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const MEGA_MENU_SHOWCASE_SLUG = 'mega-menu';
export const MEGA_MENU_TRANSLATION_PREFIX = 'mega-menu';

export const MEGA_MENU_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.mega-menu' },
  ];

export const MEGA_MENU_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.breadcrumb',
  route: '/navigation/breadcrumb',
};

export const MEGA_MENU_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.stepper',
  route: '/navigation/stepper',
};

export const MEGA_MENU_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'mega-menu.section.examples' },
  { anchor: 'appearance', labelKey: 'mega-menu.section.appearance' },
  { anchor: 'width', labelKey: 'mega-menu.section.width' },
  { anchor: 'behavior', labelKey: 'mega-menu.section.behavior' },
  { anchor: 'controlled', labelKey: 'mega-menu.section.controlled' },
  { anchor: 'keyboard', labelKey: 'mega-menu.section.keyboard' },
  { anchor: 'responsive', labelKey: 'mega-menu.section.responsive' },
  { anchor: 'installation', labelKey: 'mega-menu.section.installation' },
  { anchor: 'props', labelKey: 'mega-menu.section.props' },
];

export const MEGA_MENU_SHOWCASE_IMPORT_CODE = `import {
      SolarisMegaMenuComponent,
      SolarisMegaMenuTriggerDirective,
      SolarisMegaMenuPanelDirective,
      SolarisMegaMenuAnchorDirective
    }
  from '@solaris-ui/angular';`;

export const MEGA_MENU_SHOWCASE_BASIC_CODE = [
  '<nav solaris-mega-menu-anchor solaris-mega-menu-group>',
  '  <solaris-mega-menu panelWidth="anchor" [backdrop]="true">',
  '    <button solaris-mega-menu-trigger>Products</button>',
  '    <ng-template solaris-mega-menu-panel>',
  '      <a href="/forms">Forms</a>',
  '      <a href="/navigation">Navigation</a>',
  '    </ng-template>',
  '  </solaris-mega-menu>',
  '</nav>',
].join('\n');

export const MEGA_MENU_SHOWCASE_APPEARANCE_UNDERLINE_CODE = [
  '<solaris-mega-menu panelWidth="anchor" appearance="underline">',
  '  <button solaris-mega-menu-trigger>Underline</button>',
  '  <ng-template solaris-mega-menu-panel>Panel content</ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_APPEARANCE_TEXT_CODE = [
  '<solaris-mega-menu panelWidth="anchor" appearance="text">',
  '  <button solaris-mega-menu-trigger>Text</button>',
  '  <ng-template solaris-mega-menu-panel>Panel content</ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_WIDTH_TRIGGER_CODE = [
  '<solaris-mega-menu panelWidth="trigger">',
  '  <button solaris-mega-menu-trigger>Trigger width</button>',
  '  <ng-template solaris-mega-menu-panel>',
  '    This panel matches the trigger width.',
  '  </ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_WIDTH_ANCHOR_CODE = [
  '<solaris-mega-menu panelWidth="anchor">',
  '  <button solaris-mega-menu-trigger>Anchor width</button>',
  '  <ng-template solaris-mega-menu-panel>',
  '    This panel matches the header width.',
  '  </ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_WIDTH_VIEWPORT_CODE = [
  '<solaris-mega-menu panelWidth="viewport">',
  '  <button solaris-mega-menu-trigger>Viewport width</button>',
  '  <ng-template solaris-mega-menu-panel>',
  '    This panel spans the viewport.',
  '  </ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_PERSISTENT_CODE = [
  '<solaris-mega-menu panelWidth="anchor" [persistentOnClick]="true">',
  '  <button solaris-mega-menu-trigger>Keep open</button>',
  '  <ng-template solaris-mega-menu-panel>',
  '    Click the trigger again or click outside to close.',
  '  </ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_HOVER_DELAY_CODE = [
  '<solaris-mega-menu',
  '  panelWidth="anchor"',
  '  [hoverOpenDelay]="400"',
  '  [hoverCloseDelay]="400"',
  '>',
  '  <button solaris-mega-menu-trigger>Delayed trigger</button>',
  '  <ng-template solaris-mega-menu-panel>Delayed panel content</ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_CONTROLLED_CODE = [
  '<solaris-mega-menu',
  '  panelWidth="anchor"',
  '  [(open)]="controlledOpen"',
  '  (opened)="onMenuOpened()"',
  '  (closed)="onMenuClosed()"',
  '  [persistentOnClick]="true"',
  '>',
  '  <button solaris-mega-menu-trigger>Controlled trigger</button>',
  '  <ng-template solaris-mega-menu-panel>',
  '    This panel is bound with two-way open state.',
  '  </ng-template>',
  '</solaris-mega-menu>',
].join('\n');

export const MEGA_MENU_SHOWCASE_KEYBOARD_CODE = [
  '<nav solaris-mega-menu-anchor solaris-mega-menu-group>',
  '  <solaris-mega-menu panelWidth="anchor">',
  '    <button solaris-mega-menu-trigger>Products</button>',
  '    <ng-template solaris-mega-menu-panel>...</ng-template>',
  '  </solaris-mega-menu>',
  '  <solaris-mega-menu panelWidth="anchor">',
  '    <button solaris-mega-menu-trigger>Resources</button>',
  '    <ng-template solaris-mega-menu-panel>...</ng-template>',
  '  </solaris-mega-menu>',
  '</nav>',
  '<!-- ArrowLeft/ArrowRight moves between triggers, -->',
  '<!-- ArrowDown opens and focuses the panel, Escape closes. -->',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as MEGA_MENU_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
