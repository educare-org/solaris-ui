import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const RANGE_SLIDER_SHOWCASE_SLUG = 'range-slider';
export const RANGE_SLIDER_TRANSLATION_PREFIX = 'range-slider';

export const RANGE_SLIDER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/introduction' },
    { labelKey: 'shell.sidebar.group.forms', route: '/introduction' },
    { labelKey: 'shell.sidebar.item.range-slider' },
  ];

export const RANGE_SLIDER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.slider',
  route: '/forms/slider',
};

export const RANGE_SLIDER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.selection-card',
  route: '/forms/selection-card',
};

export const RANGE_SLIDER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'range-slider.section.examples' },
  { anchor: 'types', labelKey: 'range-slider.section.types' },
  { anchor: 'thumbs', labelKey: 'range-slider.section.thumbs' },
  { anchor: 'vertical', labelKey: 'range-slider.section.vertical' },
  { anchor: 'ticks', labelKey: 'range-slider.section.ticks' },
  { anchor: 'states', labelKey: 'range-slider.section.states' },
  { anchor: 'form', labelKey: 'range-slider.section.form' },
  { anchor: 'installation', labelKey: 'range-slider.section.installation' },
  { anchor: 'props', labelKey: 'range-slider.section.props' },
];

export const RANGE_SLIDER_SHOWCASE_IMPORT_CODE =
  "import { SolarisRangeSliderComponent } from '@solaris-ui/angular';";

export const RANGE_SLIDER_SHOWCASE_MIN_MAX_CODE = [
  '<solaris-range-slider',
  '  label="Range"',
  '  [(values)]="prices"',
  '  [showMinMax]="true"',
  '/>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_CURRENCY_CODE = [
  '<solaris-range-slider',
  '  label="Budget"',
  '  [(values)]="budget"',
  '  [min]="0"',
  '  [max]="5000"',
  '  [step]="50"',
  '  [formatValue]="formatBRL"',
  '/>',
  '',
  '// formatBRL = (v: number): string =>',
  "//   new Intl.NumberFormat('pt-BR', { style: 'currency',",
  "//     currency: 'BRL', maximumFractionDigits: 0 }).format(v);",
].join('\n');

export const RANGE_SLIDER_SHOWCASE_THREE_CODE = [
  '<solaris-range-slider label="Segments" [values]="[10, 50, 90]" />',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_FIVE_CODE = [
  '<solaris-range-slider label="Stops" [values]="[5, 25, 50, 75, 95]" />',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_GAP_CODE = [
  '<solaris-range-slider',
  '  label="Gap"',
  '  [values]="[20, 80]"',
  '  [minStepsBetweenThumbs]="10"',
  '/>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_NEGATIVE_CODE = [
  '<solaris-range-slider',
  '  label="Temperature"',
  '  [min]="-30"',
  '  [max]="30"',
  '  [values]="[-10, 20]"',
  '  unit="°C"',
  '/>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_VERTICAL_CODE = [
  '<solaris-range-slider',
  '  label="Range"',
  '  orientation="vertical"',
  '  [(values)]="balance"',
  '/>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_TICKS_CODE = [
  '<solaris-range-slider',
  '  label="Brightness range"',
  '  [showTicks]="true"',
  '  [tickStep]="10"',
  '/>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_STATES_CODE = [
  '<solaris-range-slider label="Disabled" [disabled]="true" />',
  '<solaris-range-slider label="Readonly" [readonly]="true" />',
  '<solaris-range-slider label="Invalid" [invalid]="true" />',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Price" hint="Affects your search." appearance="minimal">',
  '  <solaris-range-slider [formControl]="pricesControl" />',
  '</solaris-form-field>',
].join('\n');

export const RANGE_SLIDER_SHOWCASE_REACTIVE_CODE = [
  '<solaris-range-slider label="Price" [formControl]="pricesControl" />',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as RANGE_SLIDER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
