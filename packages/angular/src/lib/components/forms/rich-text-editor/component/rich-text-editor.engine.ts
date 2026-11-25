import { isDevMode } from '@angular/core';

import {
  anchorOf,
  describeFigureWidth,
} from '../functions/rich-text-editor.dom';
import {
  RICH_TEXT_ZERO_WIDTH_SPACE,
  clampImageWidth,
  stripHtmlToText,
} from '../functions/rich-text-editor.utils';
import { SOLARIS_RICH_TEXT_CODE_LINE_CLASS } from '../model/rich-text-editor.defaults';

const CODE_BLOCK_TAG_NAMES: ReadonlySet<string> = new Set([
  'DIV',
  'P',
  'LI',
  'BLOCKQUOTE',
  'PRE',
  'H1',
  'H2',
  'H3',
]);

export class SolarisRichTextEditingEngine {
  private editor: HTMLElement | null = null;
  private lastRange: Range | null = null;

  bind(editor: HTMLElement | null): void {
    this.editor = editor;
  }

  selectionInEditor(): {
    range: Range;
    selection: Selection;
  } | null {
    if (typeof document === 'undefined') return null;
    const editor = this.editor;
    if (!editor) return null;
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return null;
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) return null;
      return { range, selection };
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Selection read failed.');
      return null;
    }
  }

  rememberSelection(): void {
    if (typeof document === 'undefined') return;
    const found = this.selectionInEditor();
    if (!found) return;
    try {
      this.lastRange = found.range.cloneRange();
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Selection remember failed.');
    }
  }

  restoreSelection(): boolean {
    if (typeof document === 'undefined') return false;
    try {
      if (this.selectionInEditor()) return true;
      const editor = this.editor;
      const selection = document.getSelection();
      if (
        selection &&
        editor &&
        this.lastRange &&
        editor.contains(this.lastRange.commonAncestorContainer)
      ) {
        editor.focus({ preventScroll: true });
        selection.removeAllRanges();
        selection.addRange(this.lastRange.cloneRange());
        return true;
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Selection restore failed.');
    }
    return false;
  }

  selectionAnchorElement(): Element | null {
    const found = this.selectionInEditor();
    if (!found) return null;
    const node = found.range.commonAncestorContainer;
    return node instanceof Element ? node : node.parentElement;
  }

  findLinkAtCaret(): { href: string; text: string } | null {
    const range = this.editorRangeForLink();
    if (!range) return null;
    const editor = this.editor;
    if (!editor) return null;
    const anchor =
      anchorOf(range.startContainer) ?? anchorOf(range.endContainer);
    if (!anchor || !editor.contains(anchor)) return null;
    return {
      href: anchor.getAttribute('href') ?? '',
      text: anchor.textContent ?? '',
    };
  }

  readSelectedText(): string {
    const range = this.editorRangeForLink();
    if (!range || range.collapsed) return '';
    return stripHtmlToText(range.toString());
  }

  private editorRangeForLink(): Range | null {
    if (typeof document === 'undefined') return null;
    try {
      const selection = document.getSelection();
      const editor = this.editor;
      if (!editor) return null;
      if (
        selection &&
        selection.rangeCount > 0 &&
        editor.contains(selection.getRangeAt(0).commonAncestorContainer)
      ) {
        return selection.getRangeAt(0);
      }
      if (
        this.lastRange &&
        editor.contains(this.lastRange.commonAncestorContainer)
      ) {
        return this.lastRange.cloneRange();
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Link range read failed.');
    }
    return null;
  }

  collapseAfter(node: Node): void {
    const selection = document.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  restoreCaretToNode(node: Node, offset: number): void {
    try {
      const selection = document.getSelection();
      if (!selection) return;
      const max =
        node instanceof Element
          ? node.childNodes.length
          : (node.textContent?.length ?? 0);
      const next = document.createRange();
      next.setStart(node, Math.min(offset, max));
      next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret restore failed.');
    }
  }

  exitElement(el: Element): void {
    const after = document.createTextNode(RICH_TEXT_ZERO_WIDTH_SPACE);
    el.parentNode?.insertBefore(after, el.nextSibling);
    this.collapseAfter(after);
  }

  insertCaretMarker(html: string): boolean {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return false;
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      try {
        if (this.placeMarkerAtRange(selection.getRangeAt(0), selection, html))
          return true;
      } catch {
        if (isDevMode())
          console.warn('[SolarisRichText] Caret marker insert failed.');
      }
    }
    if (this.insertHtmlAtCaret(html)) {
      this.updateCaretToMarker();
      return true;
    }
    return false;
  }

  private placeMarkerAtRange(
    range: Range,
    selection: Selection,
    html: string,
  ): boolean {
    const editor = this.editor;
    if (!editor?.contains(range.commonAncestorContainer)) return false;
    range.deleteContents();
    const wrapper = document.createElement('div');
    // SECURITY_EXCEPTION: caret marker is a builder-known tag wrapping a zero-width space; no consumer HTML.
    wrapper.innerHTML = html;
    const node = wrapper.firstChild;
    if (!node) return false;
    const marker = node.firstChild;
    range.insertNode(node);
    const inner = document.createRange();
    if (marker) {
      inner.setStartAfter(marker);
    } else {
      inner.selectNodeContents(node);
    }
    inner.collapse(true);
    selection.removeAllRanges();
    selection.addRange(inner);
    editor.focus();
    return true;
  }

  private updateCaretToMarker(): void {
    const editor = this.editor;
    if (!editor) return;
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) return;
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      let last: Text | null = null;
      let current = walker.nextNode() as Text | null;
      while (current) {
        if (current.nodeValue?.includes(RICH_TEXT_ZERO_WIDTH_SPACE))
          last = current;
        current = walker.nextNode() as Text | null;
      }
      if (last) {
        range.setStart(
          last,
          last.nodeValue?.indexOf(RICH_TEXT_ZERO_WIDTH_SPACE) ?? 0,
        );
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret restore failed.');
    }
  }

  insertHtmlAtCaret(html: string): boolean {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
        editor.innerHTML += html;
        return true;
      }
      const range = selection.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
        editor.innerHTML += html;
        return true;
      }
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      const last = fragment.lastChild;
      range.insertNode(fragment);
      if (last) {
        range.setStartAfter(last);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editor.focus();
      return true;
    } catch {
      if (isDevMode())
        console.warn(
          '[SolarisRichText] Caret insert failed; appended instead.',
        );
      try {
        // SECURITY_EXCEPTION: fallback caret insert appends sanitized editor HTML; same sanitized sources as above, no raw consumer HTML.
        editor.innerHTML += html;
        return true;
      } catch {
        return false;
      }
    }
  }

  private isCodeLineDiv(node: Node): node is HTMLElement {
    return (
      node instanceof Element &&
      (node as HTMLElement).classList.contains(
        SOLARIS_RICH_TEXT_CODE_LINE_CLASS,
      )
    );
  }

  codeTextContent(root: Node): string {
    const kids = Array.from(root.childNodes);
    if (kids.length > 0 && kids.every((child) => this.isCodeLineDiv(child))) {
      return kids.map((kid) => kid.textContent ?? '').join('\n');
    }
    const parts: string[] = [];
    const walk = (node: Node, top: boolean): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        parts.push(node.nodeValue ?? '');
        return;
      }
      if (node.nodeName === 'BR') {
        parts.push('\n');
        return;
      }
      const tag = (node as Element).tagName;
      const isBlock = CODE_BLOCK_TAG_NAMES.has(tag);
      if (isBlock && !top) parts.push('\n');
      node.childNodes.forEach((child) => walk(child, false));
      if (isBlock && !top) parts.push('\n');
    };
    let first = true;
    root.childNodes.forEach((child) => {
      walk(child, first);
      first = false;
    });
    const text = parts.join('');
    let end = text.length;
    while (end > 0 && text[end - 1] === '\n') end -= 1;
    return text.slice(0, end);
  }

  codeCaretOffset(pre: HTMLElement, range: Range): number {
    const before = document.createRange();
    before.selectNodeContents(pre);
    before.setEnd(range.startContainer, range.startOffset);
    return this.codeTextContent(before.cloneContents()).length;
  }

  writeCodeLines(
    pre: HTMLElement,
    lines: readonly string[],
    caretOffset: number | null,
  ): void {
    while (pre.firstChild) pre.firstChild.remove();
    const safe = lines.length > 0 ? lines : [''];
    for (const line of safe) {
      const div = document.createElement('div');
      div.className = SOLARIS_RICH_TEXT_CODE_LINE_CLASS;
      if (line.length > 0) {
        div.textContent = line;
      } else {
        div.append(document.createElement('br'));
      }
      pre.append(div);
    }
    if (caretOffset !== null) this.setCodeCaretByOffset(pre, caretOffset);
  }

  isCodeBlockClean(pre: HTMLElement): boolean {
    return (
      pre.childNodes.length > 0 &&
      Array.from(pre.childNodes).every((child) => this.isCodeLineDiv(child))
    );
  }

  setCodeCaretByOffset(pre: HTMLElement, offset: number): void {
    const selection = document.getSelection();
    if (!selection) return;
    const lines = Array.from(pre.children);
    let remaining = Math.max(0, offset);
    for (const line of lines) {
      const length = line.textContent?.length ?? 0;
      if (remaining <= length) {
        this.collapseCodeCaret(
          selection,
          line.firstChild ?? line,
          line.firstChild ? remaining : 0,
        );
        return;
      }
      remaining -= length + 1;
    }
    const last = lines.at(-1);
    const node = last?.firstChild ?? last ?? pre;
    this.collapseCodeCaret(selection, node, last?.textContent?.length ?? 0);
  }

  private collapseCodeCaret(
    selection: Selection,
    node: Node,
    offset: number,
  ): void {
    try {
      const max =
        node instanceof Element
          ? node.childNodes.length
          : (node.textContent?.length ?? 0);
      const next = document.createRange();
      next.setStart(node, Math.min(offset, max));
      next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);
      this.editor?.focus({ preventScroll: true });
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Caret restore failed.');
    }
  }

  selectedFigure(): HTMLElement | null {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return null;
    return editor.querySelector('figure[data-image][data-selected]');
  }

  private findFigureFromSelection(): HTMLElement | null {
    const editor = this.editor;
    if (!editor) return null;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const anchor = selection.anchorNode;
    const el =
      anchor instanceof Element ? anchor : (anchor?.parentElement ?? null);
    const figure = el?.closest?.('figure[data-image]') as HTMLElement | null;
    return figure && editor.contains(figure) ? figure : null;
  }

  updateFigureSelection(resizeLabel: string): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    const editor = this.editor;
    if (!editor) return null;
    try {
      const target = this.findFigureFromSelection();
      const selected = editor.querySelector(
        'figure[data-image][data-selected]',
      );
      if (selected && selected !== target) {
        selected.removeAttribute('data-selected');
        selected.querySelector('.solaris-image-resize-handle')?.remove();
      }
      if (target && !target.hasAttribute('data-selected')) {
        target.setAttribute('data-selected', '');
        this.attachResizeHandle(target, resizeLabel);
      }
      return target;
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Figure selection failed.');
      return null;
    }
  }

  attachResizeHandle(target: HTMLElement, resizeLabel: string): void {
    const handle = document.createElement('span');
    handle.className = 'solaris-image-resize-handle';
    handle.setAttribute('contenteditable', 'false');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('aria-label', resizeLabel);
    handle.setAttribute('aria-valuemin', '44');
    target.appendChild(handle);
    this.resizeFigure(target, target.getBoundingClientRect().width);
  }

  deselectFigure(): void {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return;
    const selected = editor.querySelector('figure[data-image][data-selected]');
    if (selected) {
      selected.removeAttribute('data-selected');
      selected.querySelector('.solaris-image-resize-handle')?.remove();
    }
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const container =
        range?.commonAncestorContainer instanceof Element
          ? range.commonAncestorContainer
          : (range?.commonAncestorContainer.parentElement ?? null);
      const rangedFigure = container?.closest?.('figure[data-image]');
      if (range && rangedFigure && editor.contains(rangedFigure)) {
        range.setStartAfter(rangedFigure);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      if (
        this.lastRange &&
        rangedFigure?.contains(this.lastRange.commonAncestorContainer)
      ) {
        this.lastRange = null;
      }
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Figure deselect failed.');
    }
  }

  resizeFigure(figure: HTMLElement, widthPx: number): void {
    const editor = this.editor;
    if (!editor) return;
    const max = Math.max(44, editor.clientWidth - 2);
    const width = clampImageWidth(Math.round(widthPx), 44, max);
    figure.style.width = `${width}px`;
    describeFigureWidth(figure, width, max);
  }

  startFigureResize(
    event: MouseEvent,
    figure: HTMLElement,
    onDone: () => void,
  ): void {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth =
      figure.getBoundingClientRect().width ||
      Number.parseFloat(figure.style.width) ||
      0;
    const move = (e: PointerEvent): void => {
      this.resizeFigure(figure, startWidth + (e.clientX - startX));
    };
    const up = (): void => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      onDone();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }
  }

  floatingPlacement(
    rect: DOMRect,
    viewport: { width: number; height: number },
    size: { height: number; width: number },
  ): { top: number; left: number } {
    const gap = 8;
    const fitsAbove = rect.top - size.height - gap >= 0;
    const fitsBelow = viewport.height - rect.bottom - size.height - gap >= 0;
    const maxLeft = Math.max(gap, viewport.width - size.width - gap);
    return {
      left: Math.min(Math.max(gap, rect.left), maxLeft),
      top:
        fitsAbove || !fitsBelow
          ? rect.top - size.height - gap
          : rect.bottom + gap,
    };
  }

  panelBelow(
    hostRect: DOMRect,
    rect: DOMRect,
    gap = 8,
  ): { top: number; left: number } {
    return {
      left: Math.max(0, rect.left - hostRect.left),
      top: rect.bottom - hostRect.top + gap,
    };
  }
}
