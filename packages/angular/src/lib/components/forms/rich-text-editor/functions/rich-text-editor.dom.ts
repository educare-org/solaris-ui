import { RICH_TEXT_ZERO_WIDTH_SPACE } from './rich-text-editor.utils';

import type { SolarisRichTextInlineTag } from '../model/rich-text-editor.types';
import { SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS } from '../model/rich-text-editor.defaults';

export const SOLARIS_RICH_TEXT_INLINE_TAG_NAMES: ReadonlySet<string> = new Set([
  'STRONG',
  'EM',
  'U',
  'S',
  'CODE',
  'SUB',
  'SUP',
]);

export const SOLARIS_RICH_TEXT_BLOCK_BOUNDARY_TAG_NAMES: ReadonlySet<string> =
  new Set([
    'P',
    'H1',
    'H2',
    'H3',
    'BLOCKQUOTE',
    'UL',
    'OL',
    'LI',
    'PRE',
    'FIGURE',
    'TABLE',
    'TBODY',
    'THEAD',
    'TR',
    'TD',
    'TH',
    'DIV',
  ]);

export function closestTag(
  node: Node | null,
  upperTag: string,
  host: HTMLElement | null,
): Element | null {
  let el = node instanceof Element ? node : (node?.parentElement ?? null);
  while (el && el !== host) {
    if (el.tagName === upperTag) return el;
    el = el.parentElement;
  }
  return null;
}

export function sharedInlineAncestor(
  start: Node | null,
  end: Node | null,
  tag: SolarisRichTextInlineTag,
  host: HTMLElement | null,
): Element | null {
  const upper = tag.toUpperCase();
  const startEl = closestTag(start, upper, host);
  const endEl = closestTag(end, upper, host);
  return startEl && startEl === endEl ? startEl : null;
}

export function isEmptyMarker(el: Element): boolean {
  const text = (el.textContent ?? '')
    .split(RICH_TEXT_ZERO_WIDTH_SPACE)
    .join('');
  if (text.trim().length > 0) return false;
  return el.querySelector('img, table, figure') === null;
}

export function anchorOf(node: Node | null): HTMLAnchorElement | null {
  const el = node instanceof Element ? node : (node?.parentElement ?? null);
  return el?.closest('a') ?? null;
}

const QUOTE_EDGE_WRAPPER_TAG_NAMES: ReadonlySet<string> = new Set([
  'DIV',
  'P',
  'LI',
  'H1',
  'H2',
  'H3',
  'UL',
  'OL',
  'PRE',
  'FIGURE',
  'FIGCAPTION',
  'TABLE',
  'TBODY',
  'THEAD',
  'TR',
  'TD',
  'TH',
  'BLOCKQUOTE',
]);

/**
 * Reports whether the first (or last) rendered line of a quote is empty.
 * Structural CSS (`:first-child`/`:last-child`) cannot answer this: those
 * selectors ignore text nodes, so a bare `<br>` looks like an only child
 * next to real text. Walk the nodes instead: a `<br>` reached before any
 * visible content (skipping drag grips and blank text) means an empty edge
 * line. Bare wrapper blocks are inspected one level deep.
 */
export function isQuoteEdgeLineEmpty(
  quote: Element,
  fromStart: boolean,
): boolean {
  return isQuoteEdgeLineEmptyInNodes(Array.from(quote.childNodes), fromStart);
}

function isQuoteEdgeLineEmptyInNodes(
  nodes: Node[],
  fromStart: boolean,
): boolean {
  const seq = fromStart ? nodes : [...nodes].reverse();
  for (const node of seq) {
    if (node.nodeName === 'BR') return true;
    if (node.nodeType === Node.TEXT_NODE) {
      if (
        (node.textContent ?? '').replace(/[\u200b\u00a0\s]/g, '').length > 0
      ) {
        return false;
      }
      continue;
    }
    if (node instanceof Element) {
      if (node.classList.contains('solaris-block-grip')) continue;
      if (node.classList.contains(SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS)) {
        continue;
      }
      if (QUOTE_EDGE_WRAPPER_TAG_NAMES.has(node.tagName)) {
        if (
          isQuoteEdgeLineEmptyInNodes(Array.from(node.childNodes), fromStart)
        ) {
          return true;
        }
        return false;
      }
      return false;
    }
  }
  return true;
}

/**
 * Finds where the closing quote mark belongs: hugging the last content of
 * the quote, before any trailing blank line. Structural CSS cannot do this
 * (`:last-child` ignores text nodes, so a trailing `<br>` looks like an
 * only child next to real text). Returns `insert: false` when the quote has
 * no content at all — no dangling mark on empty quotes.
 */
export function quoteCloseMarkReference(quote: Element): {
  insert: boolean;
  before: Node | null;
} {
  const kids = Array.from(quote.childNodes);
  let ref: Node | null = null;
  for (let i = kids.length - 1; i >= 0; i -= 1) {
    const node = kids[i];
    if (isQuoteTrailingFiller(node)) {
      ref = node;
      continue;
    }
    return { insert: true, before: ref };
  }
  return { insert: false, before: null };
}

function isQuoteTrailingFiller(node: Node): boolean {
  if (node.nodeName === 'BR') return true;
  if (node.nodeType === Node.TEXT_NODE) {
    return (
      (node.textContent ?? '').replace(/[\u200b\u00a0\s]/g, '').length === 0
    );
  }
  if (node instanceof Element) {
    if (
      node.classList.contains('solaris-block-grip') ||
      node.classList.contains(SOLARIS_RICH_TEXT_QUOTE_CLOSE_MARK_CLASS)
    ) {
      return true;
    }
    if (QUOTE_EDGE_WRAPPER_TAG_NAMES.has(node.tagName)) {
      return isQuoteEdgeLineEmptyInNodes(Array.from(node.childNodes), false);
    }
  }
  return false;
}

export function describeFigureWidth(
  figure: HTMLElement,
  width: number,
  max: number,
): void {
  const handles = figure.querySelectorAll('.solaris-image-resize-handle');
  for (const handle of Array.from(handles)) {
    handle.setAttribute('aria-valuemax', String(max));
    handle.setAttribute('aria-valuenow', String(width));
    handle.setAttribute('aria-valuetext', `${width} pixels`);
    handle.setAttribute('title', `${width} px`);
  }
}

export function expandRangeToInlineAncestors(
  range: Range,
  host: HTMLElement,
): void {
  const isInline = (el: Element | null): boolean => {
    if (!el || el === host) return false;
    if (SOLARIS_RICH_TEXT_INLINE_TAG_NAMES.has(el.tagName)) return true;
    return (
      el.tagName === 'SPAN' &&
      (el.hasAttribute('data-color') || el.hasAttribute('data-highlight'))
    );
  };
  const topmost = (node: Node | null): Element | null => {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    if (!el || !host.contains(el)) return null;
    while (el.parentElement && isInline(el.parentElement)) {
      el = el.parentElement;
    }
    return isInline(el) ? el : null;
  };
  const startTop = topmost(range.startContainer);
  if (startTop) range.setStartBefore(startTop);
  const endTop = topmost(range.endContainer);
  if (endTop) range.setEndAfter(endTop);
}
