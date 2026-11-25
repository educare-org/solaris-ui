import { RICH_TEXT_ZERO_WIDTH_SPACE } from './rich-text-editor.utils';

import type { SolarisRichTextInlineTag } from '../model/rich-text-editor.types';

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

export function describeFigureWidth(
  figure: HTMLElement,
  width: number,
  max: number,
): void {
  const handle = figure.querySelector('.solaris-image-resize-handle');
  handle?.setAttribute('aria-valuemax', String(max));
  handle?.setAttribute('aria-valuenow', String(width));
  handle?.setAttribute('aria-valuetext', `${width} pixels`);
  handle?.setAttribute('title', `${width} px`);
}

export function expandRangeToInlineAncestors(
  range: Range,
  host: HTMLElement,
): void {
  const inlineTags = new Set(['STRONG', 'EM', 'U', 'S', 'CODE', 'SUB', 'SUP']);
  const isInline = (el: Element | null): boolean => {
    if (!el || el === host) return false;
    if (inlineTags.has(el.tagName)) return true;
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
