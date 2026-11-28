import { isDevMode } from '@angular/core';

import {
  anchorOf,
  describeFigureWidth,
} from '../functions/rich-text-editor.dom';
import {
  RICH_TEXT_ZERO_WIDTH_SPACE,
  clampImageWidth,
  snapImageWidth,
  stripHtmlToText,
} from '../functions/rich-text-editor.utils';
import {
  SOLARIS_RICH_TEXT_IMAGE_SNAP_STEP,
  SOLARIS_RICH_TEXT_IMAGE_SNAP_TOLERANCE_PX,
  SOLARIS_RICH_TEXT_CODE_LINE_CLASS,
} from '../model/rich-text-editor.defaults';

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

const MOVABLE_BLOCK_TAG_NAMES: ReadonlySet<string> = new Set([
  'P',
  'H1',
  'H2',
  'H3',
  'BLOCKQUOTE',
  'PRE',
  'UL',
  'OL',
  'LI',
  'FIGURE',
  'TABLE',
  'HR',
  'DIV',
]);

const BLOCK_GRIP_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></svg>';

export class SolarisRichTextEditingEngine {
  private editor: HTMLElement | null = null;
  private lastRange: Range | null = null;
  private gripAttached = false;

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

  insertFigureAtCaret(html: string): boolean {
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
      const block = this.splittableBlockOf(range.startContainer, editor);
      if (!block) return this.insertHtmlAtCaret(html);
      range.deleteContents();
      const afterRange = document.createRange();
      afterRange.setStart(range.startContainer, range.startOffset);
      afterRange.setEndAfter(block.lastChild ?? block);
      const afterFrag = afterRange.extractContents();
      const leftoverVisible =
        (block.textContent ?? '').replace(/[\u200b\s]/g, '').length > 0 ||
        block.querySelector('img, table, figure, input, br') !== null;
      if (!leftoverVisible) {
        block.append(document.createElement('br'));
      }
      const fragment = range.createContextualFragment(html);
      const hasVisible =
        (afterFrag.textContent ?? '').replace(/[\u200b\s]/g, '').length > 0 ||
        afterFrag.querySelector?.('img, table, figure, input, br') !== null;
      const tag = block.tagName.toLowerCase();
      const next = document.createElement(tag === 'blockquote' ? 'p' : tag);
      if (hasVisible) {
        next.append(afterFrag);
      } else {
        next.append(document.createElement('br'));
      }
      block.after(next);
      block.after(fragment);
      const caret = document.createRange();
      caret.selectNodeContents(next);
      caret.collapse(true);
      selection.removeAllRanges();
      selection.addRange(caret);
      editor.focus();
      return true;
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Figure insert failed.');
      return this.insertHtmlAtCaret(html);
    }
  }

  private splittableBlockOf(
    node: Node | null,
    editor: HTMLElement,
  ): HTMLElement | null {
    let el = node instanceof Element ? node : (node?.parentElement ?? null);
    while (
      el &&
      el !== editor &&
      !/^(P|H1|H2|H3|BLOCKQUOTE)$/.test(el.tagName)
    ) {
      el = el.parentElement;
    }
    return el && el !== editor ? (el as HTMLElement) : null;
  }

  private splitBlockAroundRange(
    range: Range,
    editor: HTMLElement,
  ): { block: HTMLElement; next: HTMLElement } | null {
    const block = this.splittableBlockOf(range.startContainer, editor);
    if (!block) return null;
    range.deleteContents();
    const afterRange = document.createRange();
    afterRange.setStart(range.startContainer, range.startOffset);
    afterRange.setEndAfter(block.lastChild ?? block);
    const afterFrag = afterRange.extractContents();
    const leftoverVisible =
      (block.textContent ?? '').replace(/[\u200b\s]/g, '').length > 0 ||
      block.querySelector('img, table, figure, input, br') !== null;
    if (!leftoverVisible) {
      block.append(document.createElement('br'));
    }
    const hasVisible =
      (afterFrag.textContent ?? '').replace(/[\u200b\s]/g, '').length > 0 ||
      afterFrag.querySelector?.('img, table, figure, input, br') !== null;
    const tag = block.tagName.toLowerCase();
    const next = document.createElement(tag === 'blockquote' ? 'p' : tag);
    if (hasVisible) {
      next.append(afterFrag);
    } else {
      next.append(document.createElement('br'));
    }
    block.after(next);
    return { block, next };
  }

  insertListAtCaret(html: string): boolean {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (
        !range ||
        !selection ||
        !editor.contains(range.commonAncestorContainer)
      ) {
        return this.appendListAndFocus(html);
      }
      const split = this.splitBlockAroundRange(range, editor);
      if (split) {
        const fragment = range.createContextualFragment(html);
        const firstLi = fragment.querySelector?.('li') ?? null;
        split.block.after(fragment);
        if (firstLi) {
          this.collapseCaretInListItem(firstLi as HTMLElement);
        } else {
          const caret = document.createRange();
          caret.selectNodeContents(split.next);
          caret.collapse(true);
          selection.removeAllRanges();
          selection.addRange(caret);
        }
        editor.focus({ preventScroll: true });
        return true;
      }
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      const firstLi = fragment.querySelector?.('li') ?? null;
      range.insertNode(fragment);
      if (firstLi) {
        this.collapseCaretInListItem(firstLi as HTMLElement);
      } else {
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editor.focus({ preventScroll: true });
      return true;
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] List insert failed.');
      return this.insertHtmlAtCaret(html);
    }
  }

  insertTableAtCaret(html: string): boolean {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return false;
    try {
      const selection = document.getSelection();
      const range =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      if (
        !range ||
        !selection ||
        !editor.contains(range.commonAncestorContainer)
      ) {
        // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
        editor.innerHTML += html;
        this.focusFirstTableCell();
        return true;
      }
      const split = this.splitBlockAroundRange(range, editor);
      if (split) {
        const fragment = range.createContextualFragment(html);
        split.block.after(fragment);
        this.focusFirstTableCell();
        editor.focus({ preventScroll: true });
        return true;
      }
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
      this.focusFirstTableCell();
      editor.focus({ preventScroll: true });
      return true;
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Table insert failed.');
      return this.insertHtmlAtCaret(html);
    }
  }

  private focusFirstTableCell(): void {
    try {
      const editor = this.editor;
      const selection = document.getSelection();
      if (!editor || !selection) return;
      const cell = editor.querySelector('table th, table td');
      if (!cell) return;
      const caret = document.createRange();
      caret.selectNodeContents(cell);
      caret.collapse(true);
      selection.removeAllRanges();
      selection.addRange(caret);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] Table caret failed.');
    }
  }

  private appendListAndFocus(html: string): boolean {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return false;
    const key = `solaris-list-${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
    const tagged = html.replace(/^<(ul|ol)/i, `<$1 data-solaris-tmp="${key}"`);
    // SECURITY_EXCEPTION: appending sanitized editor HTML requires native innerHTML; content comes from sanitizeRichTextHtml/built-in builders only.
    editor.innerHTML += tagged;
    if (tagged !== html) {
      const list = editor.querySelector(`[data-solaris-tmp="${key}"]`);
      if (list) {
        list.removeAttribute('data-solaris-tmp');
        const firstLi = list.querySelector('li');
        if (firstLi) {
          this.collapseCaretInListItem(firstLi as HTMLElement);
        }
      }
    }
    editor.focus({ preventScroll: true });
    return true;
  }

  collapseCaretInListItem(li: HTMLElement): void {
    try {
      const selection = document.getSelection();
      if (!selection) return;
      const checkbox = li.querySelector?.(
        'input[data-task-checkbox]',
      ) as HTMLElement | null;
      if (checkbox && this.isTaskItemTextEmpty(li)) {
        this.placeCaretInEmptyTaskItem(selection, li);
        return;
      }
      this.placeCaretAfterListMarker(selection, li, checkbox);
      this.adjustCaretBeforeTrailingBreak(selection, li, checkbox);
    } catch {
      if (isDevMode()) console.warn('[SolarisRichText] List caret failed.');
    }
  }

  private placeCaretInEmptyTaskItem(
    selection: Selection,
    li: HTMLElement,
  ): void {
    const anchor = this.ensureTaskCaretAnchor(li);
    const range = document.createRange();
    if (anchor) {
      range.setStart(anchor, anchor.textContent?.length ?? 0);
    } else {
      range.selectNodeContents(li);
    }
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private placeCaretAfterListMarker(
    selection: Selection,
    li: HTMLElement,
    checkbox: Element | null,
  ): void {
    const range = document.createRange();
    if (checkbox?.nextSibling) {
      range.setStartAfter(checkbox);
    } else if (checkbox && li.childNodes.length > 1) {
      range.setStart(li, 1);
    } else {
      range.selectNodeContents(li);
    }
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private adjustCaretBeforeTrailingBreak(
    selection: Selection,
    li: HTMLElement,
    checkbox: Element | null,
  ): void {
    const onlyBreak =
      li.childNodes.length === 1 && li.firstChild?.nodeName === 'BR';
    const taskBreak =
      checkbox != null &&
      li.childNodes.length === 2 &&
      li.lastChild?.nodeName === 'BR';
    if (!onlyBreak && !taskBreak) return;
    const anchor = checkbox?.nextSibling ?? li.firstChild;
    if (!anchor) return;
    const before = document.createRange();
    before.setStartBefore(anchor);
    before.collapse(true);
    selection.removeAllRanges();
    selection.addRange(before);
  }

  private ensureTaskCaretAnchor(li: HTMLElement): Text | null {
    const existing = Array.from(li.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').length > 0,
    ) as Text | undefined;
    if (existing) return existing;
    if (typeof document === 'undefined') return null;
    const anchor = document.createTextNode('\u00a0');
    const br = li.querySelector('br');
    if (br) {
      br.before(anchor);
    } else {
      li.appendChild(anchor);
    }
    return anchor;
  }

  private isTaskItemTextEmpty(li: HTMLElement): boolean {
    const text = Array.from(li.childNodes)
      .filter((node) => node.nodeName !== 'INPUT')
      .map((node) => node.textContent ?? '')
      .join('');
    return text.replace(/[\u200b\u00a0]/g, '').trim().length === 0;
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

  isMovableBlock(node: Node | null): node is HTMLElement {
    return (
      node instanceof HTMLElement &&
      MOVABLE_BLOCK_TAG_NAMES.has(node.tagName) &&
      !node.classList.contains('solaris-block-drop-line') &&
      !node.classList.contains('solaris-image-snap-guides')
    );
  }

  attachBlockGrip(block: HTMLElement): void {
    if (typeof document === 'undefined') return;
    if (block.tagName === 'PRE') {
      this.attachDetachedBlockGrip(block);
      return;
    }
    if (block.querySelector(':scope > .solaris-block-grip')) {
      this.gripAttached = true;
      return;
    }
    this.clearBlockGrip();
    const grip = document.createElement('span');
    grip.className = 'solaris-block-grip';
    grip.setAttribute('contenteditable', 'false');
    grip.setAttribute('draggable', 'false');
    grip.setAttribute('aria-hidden', 'true');
    // SECURITY_EXCEPTION: static six-dot grip glyph (same artwork as the
    // solaris grip-vertical icon); no consumer HTML.
    grip.innerHTML = BLOCK_GRIP_SVG;
    block.prepend(grip);
    this.gripAttached = true;
  }

  /**
   * Attaches the drag grip for scroll-clipped blocks (code <pre>) as a
   * sibling in the editor gutter instead of a child: a child with a
   * negative offset would be clipped by the block's own overflow, and it
   * would corrupt the code-line model (isCodeBlockClean/writeCodeLines).
   * The whole <pre> stays a single draggable group — never per line.
   */
  private attachDetachedBlockGrip(block: HTMLElement): void {
    const parent = block.parentElement;
    if (!parent) return;
    const prev = block.previousElementSibling;
    if (
      prev instanceof HTMLElement &&
      prev.classList.contains('solaris-block-grip')
    ) {
      prev.style.top = `${block.offsetTop + 2}px`;
      this.gripAttached = true;
      return;
    }
    this.clearBlockGrip();
    const grip = document.createElement('span');
    grip.className = 'solaris-block-grip solaris-block-grip--detached';
    grip.setAttribute('contenteditable', 'false');
    grip.setAttribute('draggable', 'false');
    grip.setAttribute('aria-hidden', 'true');
    // SECURITY_EXCEPTION: static six-dot grip glyph (same artwork as the
    // solaris grip-vertical icon); no consumer HTML.
    grip.innerHTML = BLOCK_GRIP_SVG;
    grip.style.top = `${block.offsetTop + 2}px`;
    parent.insertBefore(grip, block);
    this.gripAttached = true;
  }

  clearBlockGrip(): void {
    if (!this.gripAttached) return;
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return;
    editor
      .querySelectorAll('.solaris-block-grip')
      .forEach((node) => node.remove());
    this.gripAttached = false;
  }

  showBlockDropLine(topPx: number): void {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return;
    let line = editor.querySelector(
      '.solaris-block-drop-line',
    ) as HTMLElement | null;
    if (!line) {
      line = document.createElement('div');
      line.className = 'solaris-block-drop-line';
      line.setAttribute('contenteditable', 'false');
      line.setAttribute('aria-hidden', 'true');
      editor.append(line);
    }
    const max = Math.max(editor.scrollHeight - 2, 0);
    line.style.top = `${Math.min(Math.max(0, Math.round(topPx)), max)}px`;
  }

  clearBlockDropLine(): void {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return;
    editor
      .querySelectorAll('.solaris-block-drop-line')
      .forEach((node) => node.remove());
  }

  moveBlockBefore(block: HTMLElement, ref: HTMLElement | null): void {
    const parent = block.parentElement;
    if (!parent?.contains(block)) return;
    if (ref === block) return;
    if (ref?.parentElement === parent) {
      ref.before(block);
      return;
    }
    if (
      !ref &&
      (parent === this.editor ||
        parent.tagName === 'UL' ||
        parent.tagName === 'OL')
    ) {
      parent.append(block);
    }
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
        selected
          .querySelectorAll('.solaris-image-resize-handle')
          .forEach((node) => node.remove());
      }
      if (target && !target.hasAttribute('data-selected')) {
        target.setAttribute('data-selected', '');
        target.removeAttribute('data-hover');
        this.attachResizeHandles(target, resizeLabel);
      }
      return target;
    } catch {
      if (isDevMode())
        console.warn('[SolarisRichText] Figure selection failed.');
      return null;
    }
  }

  attachResizeHandles(target: HTMLElement, resizeLabel: string): void {
    const existing = target.querySelectorAll('.solaris-image-resize-handle');
    if (existing.length > 0) {
      this.resizeFigure(target, target.getBoundingClientRect().width);
      return;
    }
    for (const direction of ['west', 'east'] as const) {
      const handle = document.createElement('span');
      handle.className = `solaris-image-resize-handle solaris-image-resize-handle--${direction}`;
      handle.setAttribute('contenteditable', 'false');
      handle.setAttribute('data-direction', direction);
      handle.setAttribute('role', 'slider');
      handle.setAttribute('tabindex', direction === 'east' ? '0' : '-1');
      handle.setAttribute('aria-label', resizeLabel);
      handle.setAttribute('aria-valuemin', '44');
      handle.setAttribute(
        'aria-hidden',
        direction === 'east' ? 'false' : 'true',
      );
      target.appendChild(handle);
    }
    this.resizeFigure(target, target.getBoundingClientRect().width);
  }

  attachHoverHandle(target: HTMLElement, resizeLabel: string): void {
    if (target.hasAttribute('data-selected')) return;
    if (target.querySelector('.solaris-image-resize-handle')) return;
    this.attachResizeHandles(target, resizeLabel);
    target.setAttribute('data-hover', '');
  }

  clearHoverHandle(target: HTMLElement): void {
    if (target.hasAttribute('data-selected')) {
      target.removeAttribute('data-hover');
      return;
    }
    target.removeAttribute('data-hover');
    target
      .querySelectorAll('.solaris-image-resize-handle')
      .forEach((node) => node.remove());
  }

  deselectFigure(): void {
    const editor = this.editor;
    if (!editor || typeof document === 'undefined') return;
    const selected = editor.querySelector('figure[data-image][data-selected]');
    if (selected) {
      selected.removeAttribute('data-selected');
      selected
        .querySelectorAll('.solaris-image-resize-handle')
        .forEach((node) => node.remove());
    }
    for (const hovered of Array.from(
      editor.querySelectorAll('figure[data-image][data-hover]'),
    )) {
      hovered.removeAttribute('data-hover');
      hovered
        .querySelectorAll('.solaris-image-resize-handle')
        .forEach((node) => node.remove());
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

  resizeFigure(figure: HTMLElement, widthPx: number, snap = true): void {
    const editor = this.editor;
    if (!editor) return;
    const max = Math.max(44, editor.clientWidth - 2);
    let rounded = Math.round(widthPx);
    if (snap && !Number.isNaN(rounded)) {
      rounded = snapImageWidth(
        rounded,
        max,
        SOLARIS_RICH_TEXT_IMAGE_SNAP_STEP,
        SOLARIS_RICH_TEXT_IMAGE_SNAP_TOLERANCE_PX,
      );
    }
    const width = clampImageWidth(rounded, 44, max);
    figure.style.width = `${width}px`;
    describeFigureWidth(figure, width, max);
  }

  startFigureResize(
    event: MouseEvent,
    figure: HTMLElement,
    onDone: () => void,
    direction: 'west' | 'east' | 'southeast' = 'southeast',
    onMove?: (widthPx: number, snapped: boolean) => void,
  ): void {
    event.preventDefault();
    const editor = this.editor;
    const editorMax = editor ? Math.max(44, editor.clientWidth - 2) : 0;
    const startX = event.clientX;
    const startWidth =
      figure.getBoundingClientRect().width ||
      Number.parseFloat(figure.style.width) ||
      0;
    const sign = direction === 'west' ? -1 : 1;
    figure.setAttribute('data-resizing', '');
    const badge = document.createElement('span');
    badge.className = 'solaris-image-size-badge';
    badge.setAttribute('contenteditable', 'false');
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = `${Math.round(startWidth)} px`;
    figure.appendChild(badge);
    let guides: HTMLElement | null = null;
    if (editor && editorMax > 0) {
      guides = document.createElement('div');
      guides.className = 'solaris-image-snap-guides';
      guides.setAttribute('contenteditable', 'false');
      guides.setAttribute('aria-hidden', 'true');
      for (let step = 1; step <= 9; step += 1) {
        const line = document.createElement('span');
        line.className = 'solaris-image-snap-guide';
        line.style.left = `${Math.round(editorMax * step * SOLARIS_RICH_TEXT_IMAGE_SNAP_STEP)}px`;
        guides.appendChild(line);
      }
      editor.appendChild(guides);
    }
    const finish = (): void => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      badge.remove();
      guides?.remove();
      figure.removeAttribute('data-resizing');
      figure.removeAttribute('data-snapped');
      onDone();
    };
    const move = (e: PointerEvent): void => {
      const snap = !e.altKey;
      const raw = startWidth + (e.clientX - startX) * sign;
      this.resizeFigure(figure, raw, snap);
      const width = Number.parseFloat(figure.style.width) || Math.round(raw);
      badge.textContent = `${Math.round(width)} px`;
      let snapped = false;
      if (snap && editorMax > 0) {
        const stepPx = editorMax * SOLARIS_RICH_TEXT_IMAGE_SNAP_STEP;
        if (stepPx > 0) {
          const nearest = Math.round(width / stepPx) * stepPx;
          snapped =
            Math.abs(width - nearest) <=
            SOLARIS_RICH_TEXT_IMAGE_SNAP_TOLERANCE_PX;
        }
        if (!snapped) snapped = Math.abs(raw - width) > 0.5;
      }
      if (snapped) {
        figure.setAttribute('data-snapped', '');
        badge.setAttribute('data-snapped', '');
      } else {
        figure.removeAttribute('data-snapped');
        badge.removeAttribute('data-snapped');
      }
      onMove?.(Math.round(width), snapped);
    };
    const up = (): void => {
      finish();
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
