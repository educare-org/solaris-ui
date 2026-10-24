import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const DATE_PICKER_SHOWCASE_SLUG = 'date-picker';
export const DATE_PICKER_TRANSLATION_PREFIX = 'date-picker';

export const DATE_PICKER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.date-picker' },
  ];

export const DATE_PICKER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.selection-card',
  route: '/forms/selection-card',
};

export const DATE_PICKER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.switch',
  route: '/forms/switch',
};

export const DATE_PICKER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'date-picker.section.examples' },
  { anchor: 'size-density', labelKey: 'date-picker.section.size-density' },
  { anchor: 'appearance', labelKey: 'date-picker.section.appearance' },
  { anchor: 'states', labelKey: 'date-picker.section.states' },
  { anchor: 'clearable', labelKey: 'date-picker.section.clearable' },
  { anchor: 'affix-action', labelKey: 'date-picker.section.affix-action' },
  { anchor: 'locale-bounds', labelKey: 'date-picker.section.locale-bounds' },
  {
    anchor: 'calendar-options',
    labelKey: 'date-picker.section.calendar-options',
  },
  { anchor: 'date-range', labelKey: 'date-picker.section.date-range' },
  { anchor: 'installation', labelKey: 'date-picker.section.installation' },
  { anchor: 'props', labelKey: 'date-picker.section.props' },
];

export const DATE_PICKER_SHOWCASE_IMPORT_CODE =
  "import { SolarisDatePickerComponent, SolarisDateRangePickerComponent } from '@solaris-ui/angular';";

export const DATE_PICKER_SHOWCASE_BASIC_CODE = [
  '<solaris-date-picker',
  '  label="Invoice date"',
  '  hint="Type a date or open the calendar."',
  '  locale="pt-BR"',
  '  [formControl]="dateControl"',
  '/>',
].join('\n');

export const DATE_PICKER_SHOWCASE_STATES_CODE = [
  '<solaris-date-picker label="Unavailable date" [disabled]="true" />',
  '<solaris-date-picker label="Required date" [invalid]="true" error="Complete this field to continue." />',
  '<solaris-date-picker label="Loading date" [loading]="true" />',
].join('\n');

export const DATE_PICKER_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-date-picker label="Invoice date" [formControl]="dateControl">',
  '  <button',
  '    type="button"',
  '    solaris-icon-button',
  '    solaris-form-suffix-action',
  '    aria-label="Clear date"',
  '    (click)="clearDate()"',
  '  >',
  '    <solaris-icon name="x" [decorative]="true" />',
  '  </button>',
  '</solaris-date-picker>',
].join('\n');

export const DATE_PICKER_SHOWCASE_BOUNDS_CODE = [
  '<solaris-date-picker',
  '  label="Delivery date"',
  '  hint="Choose a date within the permitted period."',
  '  locale="pt-BR"',
  '  density="compact"',
  '  [min]="minSelectableDate"',
  '  [max]="maxSelectableDate"',
  '  [disabledDates]="unavailableDates"',
  '  [formControl]="limitedDateControl"',
  '/>',
].join('\n');

export const DATE_PICKER_SHOWCASE_CLEARABLE_CODE = [
  '<solaris-date-picker',
  '  label="Invoice date"',
  '  locale="pt-BR"',
  '  [clearable]="true"',
  '  [formControl]="dateControl"',
  '/>',
].join('\n');

export const DATE_PICKER_SHOWCASE_CALENDAR_OPTIONS_CODE = [
  '<solaris-date-picker',
  '  label="Start date"',
  '  locale="pt-BR"',
  '  [weekStartsOn]="1"',
  '  [disablePast]="true"',
  '  dateFormat="numeric"',
  '  [formControl]="dateControl"',
  '/>',
].join('\n');

export const DATE_PICKER_SHOWCASE_RANGE_CODE = [
  '<solaris-date-range-picker',
  '  label="Reporting period"',
  '  hint="Choose start and end dates, then apply."',
  '  locale="pt-BR"',
  '  [presets]="presets"',
  '  [formControl]="rangeControl"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as DATE_PICKER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
