import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SELECTION_CARD_SHOWCASE_SLUG = 'selection-card';
export const SELECTION_CARD_TRANSLATION_PREFIX = 'selection-card';

export const SELECTION_CARD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.selection-card' },
  ];

export const SELECTION_CARD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch-group',
  route: '/forms/switch-group',
};

export const SELECTION_CARD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.option',
  route: '/forms/option',
};

export const SELECTION_CARD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'selection-card.section.examples' },
  { anchor: 'cards-grid', labelKey: 'selection-card.section.cards-grid' },
  { anchor: 'size-density', labelKey: 'selection-card.section.size-density' },
  { anchor: 'appearances', labelKey: 'selection-card.section.appearances' },
  { anchor: 'color', labelKey: 'selection-card.section.color' },
  { anchor: 'selection', labelKey: 'selection-card.section.selection' },
  { anchor: 'media', labelKey: 'selection-card.section.media' },
  { anchor: 'states', labelKey: 'selection-card.section.states' },
  { anchor: 'form', labelKey: 'selection-card.section.form' },
  { anchor: 'installation', labelKey: 'selection-card.section.installation' },
  { anchor: 'props', labelKey: 'selection-card.section.props' },
];

export const SELECTION_CARD_SHOWCASE_IMPORT_CODE =
  "import { SolarisSelectionCardComponent, SolarisRadioGroupComponent } from '@solaris-ui/angular';";

export const SELECTION_CARD_SHOWCASE_BASIC_CODE = [
  '<solaris-selection-card value="express" color="primary">',
  '  <div solaris-selection-card-header>',
  '    <h3 solaris-selection-card-title>Express delivery</h3>',
  '    <p solaris-selection-card-description>Next business day.</p>',
  '  </div>',
  '  <div solaris-selection-card-content>Dispatch to delivery tracking.</div>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_CARDS_GRID_CODE = [
  '<solaris-radio-group [formControl]="planControl" layout="grid" columns="auto">',
  '  <solaris-selection-card value="basic">',
  '    <h3>Basic</h3>',
  '    <p>For small teams getting started.</p>',
  '  </solaris-selection-card>',
  '  <solaris-selection-card value="pro">',
  '    <h3>Pro</h3>',
  '    <p>For growing teams.</p>',
  '  </solaris-selection-card>',
  '  <solaris-selection-card value="enterprise">',
  '    <h3>Enterprise</h3>',
  '    <p>For large organizations.</p>',
  '  </solaris-selection-card>',
  '</solaris-radio-group>',
].join('\n');

function selectionCardAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return `<solaris-selection-card appearance="${appearance}" [checked]="true">\n  <h3>${label}</h3>\n</solaris-selection-card>`;
}

export const SELECTION_CARD_SHOWCASE_APPEARANCE_SURFACE_CODE =
  selectionCardAppearanceCode('surface');
export const SELECTION_CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  selectionCardAppearanceCode('outline');
export const SELECTION_CARD_SHOWCASE_APPEARANCE_TONAL_CODE =
  selectionCardAppearanceCode('tonal');
export const SELECTION_CARD_SHOWCASE_APPEARANCE_GLASS_CODE =
  selectionCardAppearanceCode('glass');

function selectionCardColorCode(color: string): string {
  const label = color.charAt(0).toUpperCase() + color.slice(1);
  return `<solaris-selection-card color="${color}" [checked]="true">\n  <h3>${label}</h3>\n</solaris-selection-card>`;
}

export const SELECTION_CARD_SHOWCASE_COLOR_NEUTRAL_CODE =
  selectionCardColorCode('neutral');
export const SELECTION_CARD_SHOWCASE_COLOR_PRIMARY_CODE =
  selectionCardColorCode('primary');
export const SELECTION_CARD_SHOWCASE_COLOR_SUCCESS_CODE =
  selectionCardColorCode('success');
export const SELECTION_CARD_SHOWCASE_COLOR_WARNING_CODE =
  selectionCardColorCode('warning');
export const SELECTION_CARD_SHOWCASE_COLOR_DANGER_CODE =
  selectionCardColorCode('danger');
export const SELECTION_CARD_SHOWCASE_COLOR_INFO_CODE =
  selectionCardColorCode('info');
export const SELECTION_CARD_SHOWCASE_COLOR_CUSTOM_CODE = [
  '<solaris-selection-card color="custom" [checked]="true">',
  '  <h3>Custom</h3>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_SELECTION_RADIO_CODE = [
  '<solaris-selection-card value="express" color="primary">',
  '  <div solaris-selection-card-header>',
  '    <h3 solaris-selection-card-title>Express delivery</h3>',
  '  </div>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_SELECTION_SWITCH_CODE = [
  '<solaris-selection-card selection="switch" [checked]="autoRenew">',
  '  <div solaris-selection-card-header>',
  '    <h3 solaris-selection-card-title>Auto-renew</h3>',
  '  </div>',
  '  <div solaris-selection-card-footer>Renews monthly</div>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_MEDIA_TOP_CODE = [
  '<solaris-selection-card value="standard">',
  '  <figure solaris-selection-card-media>',
  '    <img src="delivery.jpg" alt="Delivery vehicle" />',
  '  </figure>',
  '  <div solaris-selection-card-header>',
  '    <h3 solaris-selection-card-title>Standard</h3>',
  '  </div>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_MEDIA_START_CODE = [
  '<solaris-selection-card value="analytics" mediaPosition="start">',
  '  <figure solaris-selection-card-media>',
  '    <img src="analytics.png" alt="Analytics icon" />',
  '  </figure>',
  '  <div solaris-selection-card-header>',
  '    <h3 solaris-selection-card-title>Analytics</h3>',
  '  </div>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_STATES_CODE = [
  '<solaris-selection-card [checked]="true" [disabled]="true">',
  '  <h3>Disabled</h3>',
  '</solaris-selection-card>',
  '<solaris-selection-card [checked]="true" [readonly]="true">',
  '  <h3>Readonly</h3>',
  '</solaris-selection-card>',
  '<solaris-selection-card [checked]="true" [invalid]="true">',
  '  <h3>Invalid</h3>',
  '</solaris-selection-card>',
].join('\n');

export const SELECTION_CARD_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Plan" hint="Select a plan to continue.">',
  '  <solaris-radio-group [formControl]="planControl" layout="grid" columns="auto">',
  '    <solaris-selection-card value="basic">',
  '      <h3>Basic</h3>',
  '    </solaris-selection-card>',
  '    <solaris-selection-card value="pro">',
  '      <h3>Pro</h3>',
  '    </solaris-selection-card>',
  '  </solaris-radio-group>',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SELECTION_CARD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
