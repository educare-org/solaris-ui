import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const RICH_TEXT_EDITOR_SHOWCASE_SLUG = 'rich-text-editor';
export const RICH_TEXT_EDITOR_TRANSLATION_PREFIX = 'rich-text-editor';

export const RICH_TEXT_EDITOR_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/introduction' },
    { labelKey: 'shell.sidebar.group.forms', route: '/introduction' },
    { labelKey: 'shell.sidebar.item.rich-text-editor' },
  ];

export const RICH_TEXT_EDITOR_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.textarea',
  route: '/forms/textarea',
};

export const RICH_TEXT_EDITOR_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.password-field',
  route: '/forms/password-field',
};

export const RICH_TEXT_EDITOR_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'document', labelKey: 'rich-text-editor.section.document' },
  { anchor: 'fields', labelKey: 'rich-text-editor.section.fields' },
  { anchor: 'appearances', labelKey: 'rich-text-editor.section.appearances' },
  { anchor: 'composer', labelKey: 'rich-text-editor.section.composer' },
  { anchor: 'states', labelKey: 'rich-text-editor.section.states' },
  { anchor: 'form', labelKey: 'rich-text-editor.section.form' },
  { anchor: 'installation', labelKey: 'rich-text-editor.section.installation' },
];

export const RICH_TEXT_EDITOR_SHOWCASE_IMPORT_CODE =
  "import { SolarisRichTextEditorComponent, SolarisFormFieldComponent } from '@solaris-ui/angular';";

export const RICH_TEXT_EDITOR_SHOWCASE_BASIC_CODE = [
  '<solaris-rich-text-editor placeholder="Description" [maxLength]="300" />',
].join('\n');

export const RICH_TEXT_EDITOR_SHOWCASE_FIELDS_CODE = [
  '<solaris-form-field label="Receipt">',
  '  <solaris-rich-text-editor [fields]="fields" [maxLength]="300" [toolbarDisplay]="fieldFormattingVisible() ? undefined : \'hidden\'" />',
  '</solaris-form-field>',
  '<button solaris-button (click)="fieldFormattingVisible.set(!fieldFormattingVisible())">Toggle formatting</button>',
].join('\n');

export const RICH_TEXT_EDITOR_SHOWCASE_COMPOSER_CODE = [
  '<div class="composer-box">',
  '  <solaris-rich-text-editor #composer variant="composer" [toolbarDisplay]="formattingVisible() ? undefined : \'hidden\'" (submitted)="send($event)" />',
  '  <button solaris-button class="composer-box__format" (click)="formattingVisible.set(!formattingVisible())">Toggle formatting</button>',
  '  <button solaris-button class="composer-box__send" (click)="composer.submit()">Send</button>',
  '</div>',
  '<p class="composer-box__hint">Shift + Enter for a new line. Enter sends.</p>',
].join('\n');

function richTextEditorAppearanceCode(appearance: string): string {
  const label = appearance.charAt(0).toUpperCase() + appearance.slice(1);
  return [
    `<solaris-form-field label="${label}" appearance="${appearance}">`,
    `  <solaris-rich-text-editor placeholder="${label}" />`,
    '</solaris-form-field>',
  ].join('\n');
}

export const RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_OUTLINE_CODE =
  richTextEditorAppearanceCode('outline');
export const RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_SURFACE_CODE =
  richTextEditorAppearanceCode('surface');
export const RICH_TEXT_EDITOR_SHOWCASE_APPEARANCE_FILLED_CODE =
  richTextEditorAppearanceCode('filled');

export const RICH_TEXT_EDITOR_SHOWCASE_STATES_CODE = [
  '<solaris-rich-text-editor [invalid]="true" placeholder="Invalid" />',
  '<solaris-rich-text-editor disabled placeholder="Disabled" />',
  '<solaris-rich-text-editor readonly placeholder="Readonly" />',
].join('\n');

export const RICH_TEXT_EDITOR_SHOWCASE_REACTIVE_CODE = [
  '<solaris-form-field label="Notes">',
  '  <solaris-rich-text-editor [formControl]="notesControl" placeholder="Notes" />',
  '</solaris-form-field>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as RICH_TEXT_EDITOR_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
