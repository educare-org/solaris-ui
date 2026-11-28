import {
  SOLARIS_RICH_TEXT_CODE_LANGUAGES,
  SOLARIS_RICH_TEXT_VERSION,
} from '../model/rich-text-editor.defaults';

import { normalizeCodeBlockLanguage } from '../../../data-display/code-block/runtime/code-block-highlighting';

import type {
  SolarisRichTextActiveMark,
  SolarisRichTextBlock,
  SolarisRichTextCodeLanguage,
  SolarisRichTextField,
  SolarisRichTextMention,
  SolarisRichTextValue,
} from '../model/rich-text-editor.types';

const BLOCK_ID_PREFIX = 'blk';

let blockSequence = 0;

function nextBlockId(): string {
  blockSequence += 1;
  return `${BLOCK_ID_PREFIX}-${blockSequence}`;
}

export function resetRichTextBlockSequence(): void {
  blockSequence = 0;
}

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function stripHtmlToText(html: string): string {
  const withoutTags = stripZeroWidthSpaces(html)
    .replace(/<(br|p|h1|h2|h3|blockquote|li|tr)[^<>]*>/gi, ' ')
    .replace(/<[^<>]*>/g, '');
  return withoutTags
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function trimTrailingWhitespace(line: string): string {
  let end = line.length;
  while (end > 0 && (line[end - 1] === ' ' || line[end - 1] === '\t')) {
    end -= 1;
  }
  return line.slice(0, end);
}

function stripTagPair(
  html: string,
  tag: 'script' | 'style' | 'iframe',
): string {
  const openTag = `<${tag}`;
  const closeTag = `</${tag}>`;
  let output = html;
  let start = output.toLowerCase().indexOf(openTag);
  while (start >= 0) {
    const end = output.toLowerCase().indexOf(closeTag, start + openTag.length);
    if (end < 0) break;
    output = output.slice(0, start) + output.slice(end + closeTag.length);
    start = output.toLowerCase().indexOf(openTag);
  }
  return output;
}

export function sanitizeRichTextHtml(html: string): string {
  let stripped = html;
  for (const tag of ['script', 'style', 'iframe'] as const) {
    stripped = stripTagPair(stripped, tag);
  }
  stripped = stripped
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  return wrapBareImages(upgradeLegacyTaskCheckboxes(stripped)).trim();
}

export function wrapBareImages(html: string): string {
  const segments = html.split(/(<figure\b[^<>]*>[\s\S]*?<\/figure>)/gi);
  return segments
    .map((segment, index) =>
      index % 2 === 1
        ? segment
        : segment.replace(/<img\b[^<>]*>/gi, wrapBareImageTag),
    )
    .join('');
}

function wrapBareImageTag(tag: string): string {
  const alt = readImageAttribute(tag, 'alt');
  if (alt.trim().length === 0) return '';
  const src = readImageAttribute(tag, 'src');
  if (src.trim().length === 0) return '';
  return `<figure data-image>${tag}</figure>`;
}

function readImageAttribute(tag: string, name: string): string {
  const quoted = new RegExp(
    String.raw`${name}\s*=\s*"([^"]*)"|${name}\s*=\s*'([^']*)'`,
    'i',
  ).exec(tag);
  if (quoted) return quoted[1] ?? quoted[2] ?? '';
  const unquoted = new RegExp(String.raw`${name}\s*=\s*([^\s>]+)`, 'i').exec(
    tag,
  );
  return unquoted?.[1] ?? '';
}

function upgradeLegacyTaskCheckboxes(html: string): string {
  return html.replace(
    /<input([^<>]*?)type="checkbox"([^<>]*?)>/gi,
    (_match: string, before: string, after: string) => {
      let tag = `<input${before}type="checkbox"${after}>`;
      tag = tag.replace(/\sdisabled(?:="[^"]*")?/gi, '');
      tag = tag.replace(/\scontenteditable(?:="[^"]*")?/gi, '');
      if (!/data-task-checkbox/i.test(tag)) {
        tag = tag.replace(/<input/i, '<input data-task-checkbox');
      }
      if (!/tabindex=/i.test(tag)) {
        tag = tag.replace(/<input/i, '<input tabindex="-1"');
      }
      return tag;
    },
  );
}

export function createEmptyValue(): SolarisRichTextValue {
  return {
    html: '',
    text: '',
    blocks: [{ id: nextBlockId(), blockType: 'paragraph', text: '' }],
    version: SOLARIS_RICH_TEXT_VERSION,
  };
}

export function fromPlainText(text: string): SolarisRichTextValue {
  const clean = stripZeroWidthSpaces(text).replace(/\r\n/g, '\n');
  const paragraphs = clean.split('\n\n');
  const blocks: SolarisRichTextBlock[] = paragraphs.map((part) => ({
    id: nextBlockId(),
    blockType: 'paragraph',
    text: part.replace(/\n/g, ' '),
  }));
  const html = paragraphs.map((part) => `<p>${escapeHtml(part)}</p>`).join('');
  return {
    html,
    text: clean.replace(/\s+/g, ' ').trim(),
    blocks,
    version: SOLARIS_RICH_TEXT_VERSION,
  };
}

export function normalizeEditorValue(
  input: SolarisRichTextValue | string | null | undefined,
): SolarisRichTextValue {
  if (input === null || input === undefined) return createEmptyValue();
  if (typeof input === 'string') {
    if (input.trim().length === 0) return createEmptyValue();
    const html = cleanCommittedHtml(input);
    return {
      html,
      text: stripHtmlToText(html),
      blocks: [
        {
          id: nextBlockId(),
          blockType: 'paragraph',
          text: stripHtmlToText(html),
        },
      ],
      version: SOLARIS_RICH_TEXT_VERSION,
    };
  }
  const html = cleanCommittedHtml(input.html);
  return {
    html,
    text: stripHtmlToText(html),
    blocks: input.blocks,
    version: 1,
  };
}

export function getCharCount(value: SolarisRichTextValue): number {
  return Array.from(value.text).length;
}

export function getWordCount(value: SolarisRichTextValue): number {
  const text = value.text.trim();
  if (text.length === 0) return 0;
  return text.split(/\s+/).length;
}

export function isEmptyValue(value: SolarisRichTextValue): boolean {
  return value.text.trim().length === 0;
}

export function toPlainText(value: SolarisRichTextValue): string {
  return value.text;
}

export function toMarkdown(value: SolarisRichTextValue): string {
  return stripZeroWidthSpaces(value.html)
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/gi, '_$1_')
    .replace(/<s>([\s\S]*?)<\/s>/gi, '~~$1~~')
    .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<h1>([\s\S]*?)<\/h1>/gi, '# $1')
    .replace(/<h2>([\s\S]*?)<\/h2>/gi, '## $1')
    .replace(/<h3>([\s\S]*?)<\/h3>/gi, '### $1')
    .replace(/<li>([\s\S]*?)<\/li>/gi, '- $1')
    .replace(/<[^<>]*>/g, '')
    .trim();
}

export function truncateToMaxLength(
  value: SolarisRichTextValue,
  maxLength: number,
): SolarisRichTextValue {
  const chars = Array.from(value.text);
  if (chars.length <= maxLength) return value;
  return fromPlainText(chars.slice(0, maxLength).join(''));
}

export type SolarisRgb = readonly [number, number, number];

export function parseCssRgb(css: string): SolarisRgb | null {
  const match = new RegExp(/rgba?\((\d+),\s*(\d+),\s*(\d+)/).exec(css);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function parseCssRgba(css: string): {
  color: SolarisRgb;
  alpha: number;
} | null {
  const match = new RegExp(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  ).exec(css);
  if (!match) return null;
  return {
    color: [Number(match[1]), Number(match[2]), Number(match[3])],
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  };
}

export function relativeLuminance([r, g, b]: SolarisRgb): number {
  const channel = (value: number): number => {
    const sRGB = value / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(first: SolarisRgb, second: SolarisRgb): number {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

export type SolarisRichTextHistoryKind = 'typing' | 'action';

export function shouldCoalesceHistory(
  lastAt: number | null,
  now: number,
  lastKind: SolarisRichTextHistoryKind | null,
  kind: SolarisRichTextHistoryKind,
  idleMs: number,
): boolean {
  if (lastAt === null || lastKind === null) return false;
  if (lastKind !== 'typing' || kind !== 'typing') return false;
  return now - lastAt < idleMs;
}

export function insertMention(
  blocks: readonly SolarisRichTextBlock[],
  mention: SolarisRichTextMention,
): readonly SolarisRichTextBlock[] {
  return [
    ...blocks,
    { id: nextBlockId(), blockType: 'mention', mention, text: mention.label },
  ];
}

export function filterFields(
  fields: readonly SolarisRichTextField[],
  query: string,
): readonly SolarisRichTextField[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return fields;
  return fields.filter(
    (field) =>
      field.label.toLowerCase().includes(q) ||
      field.key.toLowerCase().includes(q),
  );
}

export type SolarisRichTextImageError =
  | 'type-not-allowed'
  | 'max-size'
  | 'missing-alt';

export interface SolarisRichTextImageSelection {
  readonly name: string;
  readonly size: number;
  readonly mime: string;
}

function extensionOf(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

export function matchesImageAccept(
  accept: string | undefined,
  selection: SolarisRichTextImageSelection,
): boolean {
  if (!accept || accept.trim().length === 0) {
    return selection.mime.startsWith('image/');
  }
  const parts = accept.split(',').map((part) => part.trim().toLowerCase());
  return parts.some((part) => {
    if (part === 'image/*') return selection.mime.startsWith('image/');
    if (part.startsWith('.')) return extensionOf(selection.name) === part;
    if (part.endsWith('/*')) {
      return selection.mime.startsWith(part.slice(0, -1));
    }
    return selection.mime.toLowerCase() === part;
  });
}

export function validateImageSelection(
  options: { accept?: string; maxSizeBytes?: number },
  selection: SolarisRichTextImageSelection,
): SolarisRichTextImageError | null {
  if (!matchesImageAccept(options.accept, selection)) return 'type-not-allowed';
  if (
    options.maxSizeBytes !== undefined &&
    selection.size > options.maxSizeBytes
  ) {
    return 'max-size';
  }
  return null;
}

export function buildImageFigureHtml(options: {
  url: string;
  alt: string;
}): string {
  if (options.alt.trim().length === 0) return '';
  return `<figure data-image><img src="${escapeHtml(options.url)}" alt="${escapeHtml(options.alt)}" /></figure>`;
}

export function clampTableDimension(raw: number, fallback: number): number {
  if (!Number.isFinite(raw)) return fallback;
  return Math.min(5, Math.max(1, Math.floor(raw)));
}

export function buildTableHtml(options: {
  rows: number;
  cols: number;
  headerRow?: boolean;
}): string {
  const rows = clampTableDimension(options.rows, 3);
  const cols = clampTableDimension(options.cols, 3);
  const headerRow = options.headerRow ?? true;
  let html = '<table><tbody>';
  for (let r = 0; r < rows; r += 1) {
    html += '<tr>';
    for (let c = 0; c < cols; c += 1) {
      if (r === 0 && headerRow) {
        html += '<th scope="col"><br /></th>';
      } else {
        html += '<td><br /></td>';
      }
    }
    html += '</tr>';
  }
  html += '</tbody></table><p><br /></p>';
  return html;
}

export type SolarisRichTextBlockTag =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'blockquote'
  | 'pre';

export type SolarisRichTextAlign =
  | 'left'
  | 'center'
  | 'right'
  | 'justify'
  | 'start-wrap'
  | 'end-wrap';

export type SolarisRichTextColor =
  | 'default'
  | 'primary'
  | 'primaryLight'
  | 'primaryDark'
  | 'success'
  | 'successLight'
  | 'successDark'
  | 'warning'
  | 'warningLight'
  | 'warningDark'
  | 'danger'
  | 'dangerLight'
  | 'dangerDark'
  | 'info'
  | 'infoLight'
  | 'infoDark'
  | 'accent'
  | 'accentLight'
  | 'accentDark'
  | 'cyan'
  | 'cyanLight'
  | 'cyanDark'
  | 'pink'
  | 'pinkLight'
  | 'pinkDark'
  | 'violet'
  | 'violetLight'
  | 'violetDark'
  | 'muted'
  | 'neutralDark'
  | 'blue'
  | 'blueLight'
  | 'blueDark'
  | 'petrol'
  | 'petrolLight'
  | 'petrolDark'
  | 'green'
  | 'greenLight'
  | 'greenDark'
  | 'lime'
  | 'limeLight'
  | 'limeDark'
  | 'yellow'
  | 'yellowLight'
  | 'yellowDark'
  | 'orange'
  | 'orangeLight'
  | 'orangeDark'
  | 'red'
  | 'redLight'
  | 'redDark'
  | 'magenta'
  | 'magentaLight'
  | 'magentaDark'
  | 'purple'
  | 'purpleLight'
  | 'purpleDark';

export type SolarisRichTextHighlight =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent'
  | 'violet'
  | 'neutral'
  | 'blue'
  | 'petrol'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'purple';

export interface SolarisRichTextActiveScan {
  marks: Record<SolarisRichTextActiveMark, boolean>;
  block: SolarisRichTextBlockTag;
  align: SolarisRichTextAlign;
  color: SolarisRichTextColor;
  highlight: SolarisRichTextHighlight;
}

const ACTIVE_BLOCK_TAGS: ReadonlySet<string> = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'BLOCKQUOTE',
  'PRE',
]);

const ACTIVE_SPAN_COLORS: ReadonlySet<string> = new Set([
  'primary',
  'primaryLight',
  'primaryDark',
  'success',
  'successLight',
  'successDark',
  'warning',
  'warningLight',
  'warningDark',
  'danger',
  'dangerLight',
  'dangerDark',
  'info',
  'infoLight',
  'infoDark',
  'accent',
  'accentLight',
  'accentDark',
  'cyan',
  'cyanLight',
  'cyanDark',
  'pink',
  'pinkLight',
  'pinkDark',
  'violet',
  'violetLight',
  'violetDark',
  'muted',
  'neutralDark',
  'blue',
  'blueLight',
  'blueDark',
  'petrol',
  'petrolLight',
  'petrolDark',
  'green',
  'greenLight',
  'greenDark',
  'lime',
  'limeLight',
  'limeDark',
  'yellow',
  'yellowLight',
  'yellowDark',
  'orange',
  'orangeLight',
  'orangeDark',
  'red',
  'redLight',
  'redDark',
  'magenta',
  'magentaLight',
  'magentaDark',
  'purple',
  'purpleLight',
  'purpleDark',
]);

export function createActiveScan(): SolarisRichTextActiveScan {
  return {
    marks: {
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      link: false,
      bulletList: false,
      orderedList: false,
    },
    block: 'p',
    align: 'left',
    color: 'default',
    highlight: 'default',
  };
}

export function accumulateActiveElement(
  el: Element,
  scan: SolarisRichTextActiveScan,
): void {
  accumulateActiveMark(el.tagName, scan.marks);
  accumulateBlockState(el, scan);
  accumulateSpanState(el, scan);
}

function accumulateActiveMark(
  tag: string,
  marks: Record<SolarisRichTextActiveMark, boolean>,
): void {
  if (tag === 'STRONG' || tag === 'B') marks.bold = true;
  else if (tag === 'EM' || tag === 'I') marks.italic = true;
  else if (tag === 'U') marks.underline = true;
  else if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL')
    marks.strike = true;
  else if (tag === 'A') marks.link = true;
  else if (tag === 'UL') marks.bulletList = true;
  else if (tag === 'OL') marks.orderedList = true;
}

function accumulateBlockState(
  el: Element,
  scan: SolarisRichTextActiveScan,
): void {
  if (ACTIVE_BLOCK_TAGS.has(el.tagName)) {
    scan.block = el.tagName.toLowerCase() as SolarisRichTextBlockTag;
  }
  if (el.hasAttribute('data-align')) {
    const aligned = el.getAttribute('data-align');
    if (
      aligned === 'center' ||
      aligned === 'right' ||
      aligned === 'justify' ||
      aligned === 'start-wrap' ||
      aligned === 'end-wrap'
    ) {
      scan.align = aligned;
    }
  }
}

function accumulateSpanState(
  el: Element,
  scan: SolarisRichTextActiveScan,
): void {
  if (el.tagName !== 'SPAN') return;
  const color = el.getAttribute('data-color');
  if (color && ACTIVE_SPAN_COLORS.has(color)) {
    scan.color = color as SolarisRichTextColor;
  }
  const highlight = el.getAttribute('data-highlight');
  if (highlight && ACTIVE_SPAN_COLORS.has(highlight)) {
    scan.highlight = highlight as SolarisRichTextHighlight;
  }
}

export function isSafeHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^(https?:\/\/[^\s<>"]+)$/i.test(trimmed);
}

export function buildLinkHtml(url: string, text: string): string {
  if (!isSafeHttpUrl(url)) return escapeHtml(text);
  const label = text.trim().length > 0 ? text : url.trim();
  return `<a href="${escapeHtml(url.trim())}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
}

export function buildBlockHtml(
  tag: SolarisRichTextBlockTag,
  text: string,
): string {
  const content = text.trim().length > 0 ? escapeHtml(text) : '<br />';
  return `<${tag}>${content}</${tag}>`;
}

export function blockKindForTag(
  tag: SolarisRichTextBlockTag,
): SolarisRichTextBlock['blockType'] {
  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
      return 'heading';
    case 'blockquote':
      return 'quote';
    case 'pre':
      return 'code';
    default:
      return 'paragraph';
  }
}

const SUPPORTED_CODE_LANGUAGES = new Set<string>(
  SOLARIS_RICH_TEXT_CODE_LANGUAGES.map((language) => language.id),
);

export function normalizeCodeLanguage(
  value: string | null | undefined,
): SolarisRichTextCodeLanguage {
  const normalized = normalizeCodeBlockLanguage(
    (value ?? '').trim().toLowerCase(),
  );
  return (
    SUPPORTED_CODE_LANGUAGES.has(normalized) ? normalized : 'text'
  ) as SolarisRichTextCodeLanguage;
}

export function buildCodeBlockHtml(options: {
  language: string;
  lineNumbers: boolean;
  text: string;
}): string {
  const lines = options.text.length > 0 ? options.text.split('\n') : [''];
  const body = lines
    .map(
      (line) =>
        `<div class="solaris-rich-text-code-line">${line.length > 0 ? escapeHtml(line) : '<br />'}</div>`,
    )
    .join('');
  const numbers = options.lineNumbers ? ' data-line-numbers=""' : '';
  return `<pre data-language="${escapeHtml(normalizeCodeLanguage(options.language))}"${numbers}>${body}</pre>`;
}

export function buildListHtml(
  kind: 'ul' | 'ol',
  items: readonly string[],
): string {
  const safeItems = items.length > 0 ? items : [''];
  const lis = safeItems
    .map(
      (item) =>
        `<li>${item.trim().length > 0 ? escapeHtml(item) : '<br />'}</li>`,
    )
    .join('');
  return `<${kind}>${lis}</${kind}>`;
}

export function buildTaskItemHtml(text: string, checked = false): string {
  const body = text.trim().length > 0 ? escapeHtml(text) : '&nbsp;<br />';
  const state = checked ? ' checked' : '';
  return `<li><input type="checkbox" data-task-checkbox${state} tabindex="-1" />${body}</li>`;
}

export function buildTaskListHtml(items: readonly string[]): string {
  const safeItems = items.length > 0 ? items : [''];
  const lis = safeItems.map((item) => buildTaskItemHtml(item)).join('');
  return `<ul data-task-list>${lis}</ul>`;
}

export function buildColorSpanHtml(
  color: SolarisRichTextColor,
  text: string,
): string {
  if (color === 'default') return escapeHtml(text);
  return `<span data-color="${color}">${escapeHtml(text)}</span>`;
}

export function buildInlineCodeHtml(text: string): string {
  return `<code>${escapeHtml(text)}</code>`;
}

export function buildHighlightSpanHtml(
  color: SolarisRichTextHighlight,
  text: string,
): string {
  if (color === 'default') return escapeHtml(text);
  return `<span data-highlight="${color}">${escapeHtml(text)}</span>`;
}

export function buildDataSpanHtml(options: {
  color?: SolarisRichTextColor;
  highlight?: SolarisRichTextHighlight;
  text: string;
}): string {
  const color = options.color ?? 'default';
  const highlight = options.highlight ?? 'default';
  if (color === 'default' && highlight === 'default')
    return escapeHtml(options.text);
  const attrs =
    `${color !== 'default' ? ` data-color="${color}"` : ''}` +
    `${highlight !== 'default' ? ` data-highlight="${highlight}"` : ''}`;
  return `<span${attrs}>${escapeHtml(options.text)}</span>`;
}

export function unwrapInlineFormatting(html: string): string {
  const withoutPaired = html.replace(
    /<\/?(strong|em|u|s|code|sub|sup)(\s[^<>]*)?>/gi,
    '',
  );
  return stripDataSpans(withoutPaired, 'data-color');
}

export function removeHighlightSpans(html: string): string {
  return stripDataSpans(html, 'data-highlight');
}

function stripDataSpans(
  html: string,
  attr: 'data-color' | 'data-highlight',
): string {
  const tagPattern = /<\/?span[^<>]*>/gi;
  const marker = new RegExp(String.raw`${attr}(?==|\s|>)`, 'i');
  const otherAttr = attr === 'data-color' ? 'data-highlight' : 'data-color';
  const otherMarker = new RegExp(String.raw`${otherAttr}(?==|\s|>)`, 'i');
  let result = '';
  let rest = 0;
  const markedStack: boolean[] = [];
  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0];
    let drop = false;
    let rewrite: string | null = null;
    if (tag.startsWith('</')) {
      drop = markedStack.pop() ?? false;
    } else {
      const isMarked = marker.test(tag);
      if (isMarked) {
        if (otherMarker.test(tag)) {
          rewrite = tag.replace(
            new RegExp(
              String.raw`\s*${attr}(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?`,
              'i',
            ),
            '',
          );
        } else {
          drop = true;
        }
      }
      markedStack.push(drop);
    }
    result += html.slice(rest, match.index);
    if (!drop) result += rewrite ?? tag;
    rest = match.index + tag.length;
  }
  return result + html.slice(rest);
}

export function clampImageWidth(px: number, min: number, max: number): number {
  if (!Number.isFinite(px)) return min;
  const floor = Math.min(min, max);
  const ceiling = Math.max(min, max);
  return Math.min(Math.max(Math.floor(px), floor), ceiling);
}

export function snapImageWidth(
  px: number,
  max: number,
  step = 0.1,
  tolerancePx = 8,
): number {
  if (!Number.isFinite(px) || !Number.isFinite(max) || max <= 0) return px;
  const safeStep = step > 0 && step <= 1 ? step : 0.1;
  const steps = Math.round(1 / safeStep);
  for (let i = 1; i <= steps; i += 1) {
    const snap = Math.round(max * i * safeStep);
    if (Math.abs(px - snap) <= tolerancePx) return snap;
  }
  return Math.round(px);
}

export function insertBlockEntry(
  blocks: readonly SolarisRichTextBlock[],
  blockType: SolarisRichTextBlock['blockType'],
  text: string,
): readonly SolarisRichTextBlock[] {
  return [...blocks, { id: nextBlockId(), blockType, text }];
}

export const RICH_TEXT_ZERO_WIDTH_SPACE = String.fromCodePoint(8203);

export function stripZeroWidthSpaces(value: string): string {
  return value.split(RICH_TEXT_ZERO_WIDTH_SPACE).join('');
}

export function stripQuoteCloseMarks(html: string): string {
  return html.replace(
    /<span[^<>]*solaris-rich-text-quote-close[^<>]*>[\s\S]*?<\/span>/gi,
    '',
  );
}

export function cleanCommittedHtml(html: string): string {
  return sanitizeRichTextHtml(stripZeroWidthSpaces(stripQuoteCloseMarks(html)))
    .replace(/<(strong|em|u|s)(\s[^<>]*)?>(?:\s|<br\s*\/?>)*<\/\1>/gi, '')
    .replace(/<span(?=[^<>]*data-color)[^<>]*>(?:\s|<br\s*\/?>)*<\/span>/gi, '')
    .replace(
      /<span(?=[^<>]*data-highlight)[^<>]*>(?:\s|<br\s*\/?>)*<\/span>/gi,
      '',
    )
    .replace(/<span[^<>]*solaris-image-resize-handle[^<>]*><\/span>/gi, '')
    .replace(/<span[^<>]*solaris-block-grip[^<>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<div[^<>]*solaris-block-drop-line[^<>]*><\/div>/gi, '')
    .replace(/<span[^<>]*solaris-image-size-badge[^<>]*>.*?<\/span>/gi, '')
    .replace(/<div[^<>]*solaris-image-snap-guides[^<>]*>.*?<\/div>/gi, '')
    .replace(/\sdata-selected(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\sdata-hover(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\sdata-resizing(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\sdata-snapped(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\sdata-dragging(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
    .replace(/\sdata-hide-open(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi, '');
}

export function insertTableBlock(
  blocks: readonly SolarisRichTextBlock[],
  options: { rows: number; cols: number; headerRow?: boolean },
): readonly SolarisRichTextBlock[] {
  return insertBlockEntry(
    blocks,
    'table',
    `Table ${clampTableDimension(options.rows, 3)}x${clampTableDimension(options.cols, 3)}`,
  );
}
