import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const TEXTAREA_SHOWCASE_SLUG = 'textarea';
export const TEXTAREA_TRANSLATION_PREFIX = 'textarea';

export const TEXTAREA_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.textarea' },
  ];

export const TEXTAREA_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.input',
  route: '/forms/input',
};

export const TEXTAREA_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.password-field',
  route: '/forms/password-field',
};

export const TEXTAREA_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'textarea.section.examples' },
  { anchor: 'form-field', labelKey: 'textarea.section.form-field' },
  { anchor: 'appearances', labelKey: 'textarea.section.appearances' },
  { anchor: 'size-density', labelKey: 'textarea.section.size-density' },
  { anchor: 'radius', labelKey: 'textarea.section.radius' },
  { anchor: 'states', labelKey: 'textarea.section.states' },
  { anchor: 'resize', labelKey: 'textarea.section.resize' },
  { anchor: 'rows', labelKey: 'textarea.section.rows' },
  { anchor: 'character-counter', labelKey: 'textarea.section.counter' },
  { anchor: 'form', labelKey: 'textarea.section.form' },
  { anchor: 'installation', labelKey: 'textarea.section.installation' },
  { anchor: 'props', labelKey: 'textarea.section.props' },
];

export const TEXTAREA_SHOWCASE_IMPORT_CODE =
  "import { SolarisTextareaDirective, SolarisFormFieldComponent } from '@solaris-ui/angular';";

export const TEXTAREA_SHOWCASE_BASIC_CODE = [
  '<textarea solaris-textarea placeholder="Observations"></textarea>',
].join('\n');

export const TEXTAREA_SHOWCASE_FORM_FIELD_CODE = [
  '<solaris-form-field label="Description" hint="Write an objective description.">',
  '  <textarea solaris-textarea placeholder="Observations"></textarea>',
  '</solaris-form-field>',
].join('\n');

function textareaAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-form-field label="${label}" appearance="${appearance}">`,
    `  <textarea solaris-textarea appearance="${appearance}" placeholder="${label}"></textarea>`,
    '</solaris-form-field>',
  ].join('\n');
}

export const TEXTAREA_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  textareaAppearanceCode('outline');
export const TEXTAREA_SHOWCASE_APPEARANCE_SURFACE_CODE =
  textareaAppearanceCode('surface');
export const TEXTAREA_SHOWCASE_APPEARANCE_FILLED_CODE =
  textareaAppearanceCode('filled');

function textareaRadiusCode(radius: string): string {
  const label = radius.charAt(0).toUpperCase() + radius.slice(1);
  return [
    `<solaris-form-field label="${label}" radius="${radius}">`,
    `  <textarea solaris-textarea radius="${radius}" placeholder="${label}"></textarea>`,
    '</solaris-form-field>',
  ].join('\n');
}

export const TEXTAREA_SHOWCASE_RADIUS_NONE_CODE = textareaRadiusCode('none');
export const TEXTAREA_SHOWCASE_RADIUS_SM_CODE = textareaRadiusCode('sm');
export const TEXTAREA_SHOWCASE_RADIUS_MD_CODE = textareaRadiusCode('md');
export const TEXTAREA_SHOWCASE_RADIUS_LG_CODE = textareaRadiusCode('lg');

export const TEXTAREA_SHOWCASE_STATES_CODE = [
  '<solaris-form-field label="Default">',
  '  <textarea solaris-textarea placeholder="Default"></textarea>',
  '</solaris-form-field>',
  '<solaris-form-field label="Invalid" [invalid]="true" error="This field has an error.">',
  '  <textarea solaris-textarea [invalid]="true" placeholder="Invalid"></textarea>',
  '</solaris-form-field>',
  '<solaris-form-field label="Disabled" [disabled]="true">',
  '  <textarea solaris-textarea disabled placeholder="Disabled"></textarea>',
  '</solaris-form-field>',
  '<solaris-form-field label="Readonly" [readonly]="true">',
  '  <textarea solaris-textarea readonly>Readonly text content</textarea>',
  '</solaris-form-field>',
].join('\n');

function textareaResizeCode(resize: string, placeholder: string): string {
  const label = resize.charAt(0).toUpperCase() + resize.slice(1);
  return [
    `<solaris-form-field label="${label}">`,
    `  <textarea solaris-textarea resize="${resize}" placeholder="${placeholder}"></textarea>`,
    '</solaris-form-field>',
  ].join('\n');
}

export const TEXTAREA_SHOWCASE_RESIZE_CODES = {
  none: textareaResizeCode('none', 'Not resizable'),
  vertical: textareaResizeCode('vertical', 'Resize vertically only'),
  horizontal: textareaResizeCode('horizontal', 'Resize horizontally only'),
  both: textareaResizeCode('both', 'Resize both directions'),
};

export const TEXTAREA_SHOWCASE_ROWS_CODE = [
  '<solaris-form-field label="With rows=4">',
  '  <textarea solaris-textarea rows="4" placeholder="This textarea has rows=4"></textarea>',
  '</solaris-form-field>',
].join('\n');

export const TEXTAREA_SHOWCASE_COUNTER_CODE = [
  '<solaris-form-field label="Limited to 100 characters">',
  '  <textarea solaris-textarea maxlength="100" placeholder="Type your message..."></textarea>',
  '</solaris-form-field>',
].join('\n');

export const TEXTAREA_SHOWCASE_REACTIVE_CODE = [
  '<solaris-form-field label="Notes" hint="Autosaved as draft.">',
  '  <textarea solaris-textarea [formControl]="notesControl" placeholder="Notes for the team"></textarea>',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as TEXTAREA_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
