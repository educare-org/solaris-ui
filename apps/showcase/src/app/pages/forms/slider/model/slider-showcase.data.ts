import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const SLIDER_SHOWCASE_SLUG = 'slider';
export const SLIDER_TRANSLATION_PREFIX = 'slider';

export const SLIDER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/introduction' },
  { labelKey: 'shell.sidebar.group.forms', route: '/introduction' },
  { labelKey: 'shell.sidebar.item.slider' },
];

export const SLIDER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch-group',
  route: '/forms/switch-group',
};

export const SLIDER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.range-slider',
  route: '/forms/range-slider',
};

export const SLIDER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'slider.section.examples' },
  { anchor: 'scale', labelKey: 'slider.section.scale' },
  { anchor: 'color-size', labelKey: 'slider.section.color-size' },
  { anchor: 'ticks', labelKey: 'slider.section.ticks' },
  { anchor: 'vertical', labelKey: 'slider.section.vertical' },
  { anchor: 'icons', labelKey: 'slider.section.icons' },
  { anchor: 'display', labelKey: 'slider.section.display' },
  { anchor: 'states', labelKey: 'slider.section.states' },
  { anchor: 'form', labelKey: 'slider.section.form' },
  { anchor: 'installation', labelKey: 'slider.section.installation' },
  { anchor: 'props', labelKey: 'slider.section.props' },
];

export const SLIDER_SHOWCASE_IMPORT_CODE =
  "import { SolarisSliderComponent } from '@solaris-ui/angular';";

export const SLIDER_SHOWCASE_BASIC_CODE = [
  '<solaris-slider label="Volume" [(value)]="volume" />',
].join('\n');

export const SLIDER_SHOWCASE_TICKS_CODE = [
  '<solaris-slider',
  '  label="Brightness"',
  '  [showTicks]="true"',
  '  [tickStep]="10"',
  '/>',
].join('\n');

export const SLIDER_SHOWCASE_MIN_MAX_CODE = [
  '<solaris-slider',
  '  label="Volume"',
  '  [(value)]="volume"',
  '  [showMinMax]="true"',
  '/>',
].join('\n');

export const SLIDER_SHOWCASE_VERTICAL_CODE = [
  '<solaris-slider label="Balance" orientation="vertical" [(value)]="balance" />',
].join('\n');

export const SLIDER_SHOWCASE_ICONS_CODE = [
  '<solaris-slider',
  '  label="Volume"',
  '  startIcon="minus"',
  '  endIcon="plus"',
  '  thumbIcon="grip-vertical"',
  '/>',
].join('\n');

export const SLIDER_SHOWCASE_TOOLTIP_CODE = [
  '<solaris-slider label="Opacity" valueDisplay="tooltip" />',
].join('\n');

export const SLIDER_SHOWCASE_THUMB_VALUE_CODE = [
  '<solaris-slider label="Opacity" valueDisplay="thumb" />',
].join('\n');

export const SLIDER_SHOWCASE_STATES_CODE = [
  '<solaris-slider label="Disabled" [disabled]="true" />',
  '<solaris-slider label="Readonly" [readonly]="true" />',
  '<solaris-slider label="Invalid" [invalid]="true" />',
].join('\n');

export const SLIDER_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Volume" hint="Affects your speakers." appearance="minimal">',
  '  <solaris-slider [formControl]="volumeControl" />',
  '</solaris-form-field>',
].join('\n');

export const SLIDER_SHOWCASE_REACTIVE_CODE = [
  '<solaris-slider label="Volume" [formControl]="volumeControl" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as SLIDER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
