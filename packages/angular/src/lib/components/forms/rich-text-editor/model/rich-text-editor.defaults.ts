import type {
  SolarisRichTextCodeLanguage,
  SolarisRichTextCodeLanguageOption,
  SolarisRichTextInlineTag,
} from './rich-text-editor.types';

import { getLanguageDisplayLabel } from '../../../data-display/code-block/runtime/code-block-highlighting';

export const SOLARIS_RICH_TEXT_VERSION = 1 as const;

export const SOLARIS_RICH_TEXT_DEFAULT_MAX_TABLE_ROWS = 5;

export const SOLARIS_RICH_TEXT_DEFAULT_MAX_TABLE_COLS = 5;

export const SOLARIS_RICH_TEXT_MAX_HISTORY = 50;

export const SOLARIS_RICH_TEXT_HISTORY_IDLE_MS = 1000;

export const SOLARIS_RICH_TEXT_FORMAT_SWITCH_DURATION_MS = 150;

export const SOLARIS_RICH_TEXT_FORMAT_SLIDE_DURATION_MS = 300;

export const SOLARIS_RICH_TEXT_FORMAT_SLIDE_STAGGER_MS = 20;

export const SOLARIS_RICH_TEXT_IMAGE_PRESET_WIDTHS: Record<
  'S' | 'M' | 'L',
  number
> = { S: 0.25, M: 0.5, L: 0.75 };

export const SOLARIS_RICH_TEXT_IMAGE_SNAP_STEP = 0.1;

export const SOLARIS_RICH_TEXT_IMAGE_SNAP_TOLERANCE_PX = 8;

export const SOLARIS_RICH_TEXT_INLINE_TAG_SHORTCUTS: Record<
  string,
  SolarisRichTextInlineTag
> = {
  b: 'strong',
  i: 'em',
  u: 'u',
  ',': 'sub',
  '.': 'sup',
};

export const SOLARIS_RICH_TEXT_FORMAT_SWITCH_EASING =
  'cubic-bezier(0.4, 0, 0.2, 1)';

export const SOLARIS_RICH_TEXT_CONTRAST_AA_RATIO = 4.5;
export const SOLARIS_RICH_TEXT_CONTRAST_AA_LARGE_RATIO = 3;

export const SOLARIS_RICH_TEXT_BLOCK_DRAG_ACTIVATE_PX = 5;

export const SOLARIS_RICH_TEXT_BLOCK_DRAG_OUTSIDE_TOLERANCE_PX = 4;

export const SOLARIS_RICH_TEXT_ALLOWED_TAGS: readonly string[] = [
  'p',
  'h1',
  'h2',
  'h3',
  'blockquote',
  'pre',
  'code',
  'strong',
  'em',
  'u',
  's',
  'sub',
  'sup',
  'a',
  'ul',
  'ol',
  'li',
  'br',
  'hr',
  'span',
  'figure',
  'img',
  'figcaption',
  'input',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'caption',
];

export const SOLARIS_RICH_TEXT_CODE_LINE_CLASS = 'solaris-rich-text-code-line';

export const SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS =
  'solaris-rich-text-quote-close';

const SOLARIS_RICH_TEXT_CODE_LANGUAGE_IDS: readonly Exclude<
  SolarisRichTextCodeLanguage,
  'auto'
>[] = [
  'text',
  'typescript',
  'javascript',
  'html',
  'scss',
  'css',
  'json',
  'shell',
  'bash',
  'powershell',
  'java',
  'angular',
];

export const SOLARIS_RICH_TEXT_CODE_LANGUAGES: readonly SolarisRichTextCodeLanguageOption[] =
  [
    { id: 'auto', name: 'Detect language' },
    ...SOLARIS_RICH_TEXT_CODE_LANGUAGE_IDS.map((id) => ({
      id,
      name: getLanguageDisplayLabel(id),
    })),
  ];

export const SOLARIS_RICH_TEXT_ALLOWED_ATTRIBUTES: readonly string[] = [
  'href',
  'target',
  'rel',
  'alt',
  'src',
  'scope',
  'colspan',
  'rowspan',
  'type',
  'checked',
  'disabled',
  'data-mention',
  'data-field-id',
  'data-image',
  'data-highlight',
  'data-task-list',
  'data-language',
  'data-line-numbers',
  'data-align',
  'data-bordered',
  'data-clear',
  'data-color',
  'style',
];
