import { vi } from 'vitest';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisRichTextEditorComponent } from '../component/rich-text-editor.component';
import {
  accumulateActiveElement,
  buildBlockHtml,
  buildCodeBlockHtml,
  buildColorSpanHtml,
  buildDataSpanHtml,
  buildHighlightSpanHtml,
  buildImageFigureHtml,
  buildInlineCodeHtml,
  buildLinkHtml,
  buildListHtml,
  buildTableHtml,
  buildTaskListHtml,
  clampTableDimension,
  clampImageWidth,
  cleanCommittedHtml,
  createActiveScan,
  createEmptyValue,
  filterFields,
  fromPlainText,
  getCharCount,
  getWordCount,
  insertBlockEntry,
  insertMention,
  insertTableBlock,
  isEmptyValue,
  isSafeHttpUrl,
  matchesImageAccept,
  normalizeCodeLanguage,
  normalizeEditorValue,
  parseCssRgb,
  parseCssRgba,
  contrastRatio,
  removeHighlightSpans,
  resetRichTextBlockSequence,
  RICH_TEXT_ZERO_WIDTH_SPACE,
  sanitizeRichTextHtml,
  shouldCoalesceHistory,
  stripZeroWidthSpaces,
  toMarkdown,
  trimTrailingWhitespace,
  truncateToMaxLength,
  unwrapInlineFormatting,
  validateImageSelection,
} from '../functions/rich-text-editor.utils';
import { SOLARIS_RICH_TEXT_HISTORY_IDLE_MS } from '../model/rich-text-editor.defaults';

describe('SolarisRichTextEditorComponent', () => {
  let fixture: ComponentFixture<SolarisRichTextEditorComponent>;

  beforeEach(() => resetRichTextBlockSequence());

  function create(): HTMLElement {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(SolarisRichTextEditorComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('creates the component', () => {
    expect(create()).toBeTruthy();
  });

  it('uses md as the default size', () => {
    expect(create().getAttribute('data-size')).toBe('md');
  });

  it('defaults to document variant with fixed toolbar', () => {
    create();
    expect(fixture.componentInstance.variant()).toBe('document');
  });

  it('writes string HTML values by normalizing to object', () => {
    create();
    fixture.componentInstance.writeValue('<p>Hello</p>');
    expect(fixture.componentInstance.value().text).toBe('Hello');
  });

  it('writes null as empty value', () => {
    create();
    fixture.componentInstance.writeValue(null);
    expect(isEmptyValue(fixture.componentInstance.value())).toBe(true);
  });

  it('emits submitted on ctrl-enter in document variant', () => {
    create();
    const emitted: unknown[] = [];
    fixture.componentInstance.submitted.subscribe((v) => emitted.push(v));
    fixture.componentInstance.writeValue('<p>hi</p>');
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    fixture.componentInstance['onEditorKeydown'](event);
    expect(emitted).toHaveLength(1);
  });

  it('submits the current value through the public method', () => {
    create();
    const emitted: unknown[] = [];
    fixture.componentInstance.submitted.subscribe((v) => emitted.push(v));
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.componentInstance.submit();
    expect(emitted).toHaveLength(1);
    expect((emitted[0] as { text: string }).text).toBe('hi');
  });

  it('does not submit when disabled or readonly', () => {
    create();
    const emitted: unknown[] = [];
    fixture.componentInstance.submitted.subscribe((v) => emitted.push(v));
    fixture.componentRef.setInput('disabled', true);
    fixture.componentInstance.submit();
    expect(emitted).toHaveLength(0);
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('readonly', true);
    fixture.componentInstance.submit();
    expect(emitted).toHaveLength(0);
  });

  it('blocks input over maxLength', () => {
    create();
    fixture.componentRef.setInput('maxLength', 2);
    fixture.componentInstance.writeValue('<p>ab</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    area.innerHTML = '<p>abc</p>';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.value().text).toBe('ab');
  });

  it('toggles plain format through the Aa action', () => {
    create();
    fixture.componentInstance.writeValue('<p><strong>hi</strong></p>');
    fixture.componentInstance['toggleContentFormat']();
    expect(fixture.componentInstance.contentFormat()).toBe('plain');
    expect(fixture.componentInstance.value().html).toBe('<p>hi</p>');
    fixture.componentInstance['toggleContentFormat']();
    expect(fixture.componentInstance.contentFormat()).toBe('rich');
  });

  it('selects a mention with ArrowDown and Enter', () => {
    create();
    fixture.componentRef.setInput('fields', [
      { id: '1', label: 'Full name', key: 'fullName' },
      { id: '2', label: 'Email', key: 'email' },
    ]);
    fixture.componentInstance.writeValue('<p>{</p>');
    const host = fixture.nativeElement as HTMLElement;
    const area = host.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    area.innerHTML = '<p>{</p>';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance['mentionOpen']()).toBe(true);
    fixture.componentInstance['onEditorKeydown'](
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    fixture.componentInstance['onEditorKeydown'](
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(fixture.componentInstance['mentionOpen']()).toBe(false);
  });

  it('inserts a table and emits tableInserted', () => {
    create();
    const emitted: unknown[] = [];
    fixture.componentInstance.tableInserted.subscribe((v) => emitted.push(v));
    fixture.componentInstance['insertTable'](2, 2, true);
    expect(emitted).toEqual([{ rows: 2, cols: 2 }]);
    expect(fixture.componentInstance.value().html).toContain('<table>');
    expect(fixture.componentInstance.value().html).toContain('scope="col"');
  });

  it('rejects images without alt and validates accept/size', () => {
    const rejected: unknown[] = [];
    create();
    fixture.componentInstance.imageRejected.subscribe((v) => rejected.push(v));
    fixture.componentInstance['insertImageUrl'](
      'https://example.com/a.png',
      '',
      'a.png',
    );
    expect(rejected).toHaveLength(1);
    expect(
      validateImageSelection(
        { accept: 'image/png', maxSizeBytes: 10 },
        { name: 'a.jpg', size: 5, mime: 'image/jpeg' },
      ),
    ).toBe('type-not-allowed');
    expect(
      validateImageSelection(
        { maxSizeBytes: 10 },
        { name: 'a.png', size: 11, mime: 'image/png' },
      ),
    ).toBe('max-size');
    expect(
      matchesImageAccept('image/*', {
        name: 'a.png',
        size: 1,
        mime: 'image/png',
      }),
    ).toBe(true);
  });

  it('strips rich tags typed in plain mode', () => {
    create();
    fixture.componentInstance['setContentFormat']('plain');
    const host = fixture.nativeElement as HTMLElement;
    const area = host.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    area.innerHTML = '<p><strong>hi</strong></p>';
    area.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.value().html).toBe('<p>hi</p>');
    expect(fixture.componentInstance.value().text).toBe('hi');
  });

  it('keeps the floating toolbar hidden without a selection', () => {
    create();
    fixture.componentRef.setInput('variant', 'composer');
    fixture.detectChanges();
    fixture.componentInstance['updateFloatingPosition']();
    expect(fixture.componentInstance['showFloatingToolbar']()).toBe(false);
  });

  it('hides floating toolbar and blocks table in plain mode', () => {
    create();
    fixture.componentRef.setInput('variant', 'composer');
    fixture.componentInstance['setContentFormat']('plain');
    fixture.componentInstance['updateFloatingPosition']();
    expect(fixture.componentInstance['showFloatingToolbar']()).toBe(false);
    const before = fixture.componentInstance.value().html;
    fixture.componentInstance['insertTable'](2, 2, true);
    expect(fixture.componentInstance.value().html).toBe(before);
  });

  it('converts the current line to a code block in place', () => {
    create();
    fixture.componentInstance.writeValue('<p>console.log(1)</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    expect(area.querySelector('p')).toBeNull();
    const pres = area.querySelectorAll('pre');
    expect(pres).toHaveLength(1);
    expect(pres[0]?.getAttribute('data-language')).toBe('auto');
    expect(pres[0]?.hasAttribute('data-line-numbers')).toBe(true);
    const lines = pres[0]?.querySelectorAll('.solaris-rich-text-code-line');
    expect(lines?.length).toBe(1);
    expect(lines?.[0]?.textContent).toBe('console.log(1)');
    expect(fixture.componentInstance.value().html).toContain('<pre');
    fixture.componentInstance['formatBlock']('pre');
    expect(area.querySelectorAll('pre')).toHaveLength(1);
  });

  it('splits code lines on Enter without leaving the block', () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    placeCaret(area, line.firstChild as Node, 4);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const lines = pre.querySelectorAll('.solaris-rich-text-code-line');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.textContent).toBe('code');
    expect(lines[1]?.textContent).toBe('');
    expect(fixture.componentInstance.value().html).toContain('<pre');
  });

  it('carries indentation to the new code line on Enter', () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    line.textContent = '  code';
    placeCaret(area, line.firstChild as Node, 6);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const lines = pre.querySelectorAll('.solaris-rich-text-code-line');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.textContent).toBe('  code');
    expect(lines[1]?.textContent).toBe('  ');
  });

  it('keeps both lines when splitting the second one', () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const getLines = (): NodeListOf<HTMLElement> =>
      (area.querySelector('pre') as HTMLElement).querySelectorAll(
        '.solaris-rich-text-code-line',
      );
    const first = getLines()[0] as HTMLElement;
    placeCaret(area, first.firstChild as Node, 4);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const second = getLines()[1] as HTMLElement;
    second.textContent = 'def';
    placeCaret(area, second.firstChild as Node, 3);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    const lines = getLines();
    expect(lines).toHaveLength(3);
    expect(lines[0]?.textContent).toBe('code');
    expect(lines[1]?.textContent).toBe('def');
    expect(lines[2]?.textContent).toBe('');
  });

  it('lets empty code lines grow past two lines', () => {
    create();
    fixture.componentInstance.writeValue('<p><br /></p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const br = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, br, 0);
    fixture.componentInstance['formatBlock']('pre');
    const getLines = (): NodeListOf<HTMLElement> =>
      (area.querySelector('pre') as HTMLElement).querySelectorAll(
        '.solaris-rich-text-code-line',
      );
    expect(getLines()).toHaveLength(1);
    const first = getLines()[0] as HTMLElement;
    placeCaret(area, first.firstChild as Node, 0);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(getLines()).toHaveLength(2);
    const second = getLines()[1] as HTMLElement;
    placeCaret(area, second.firstChild as Node, 0);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(getLines()).toHaveLength(3);
  });

  it('inserts two spaces on Tab inside code', () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    placeCaret(area, line.firstChild as Node, 2);
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    const updated = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    expect(updated.textContent).toBe('co  de');
  });

  it('manages code block language, line numbers and copy', async () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    placeCaret(area, line.firstChild as Node, 0);
    fixture.componentInstance['setCodeLanguage']('TypeScript');
    expect(pre.getAttribute('data-language')).toBe('typescript');
    expect(fixture.componentInstance['codeLanguage']()).toBe('typescript');
    fixture.componentInstance['toggleCodeLineNumbers']();
    expect(pre.hasAttribute('data-line-numbers')).toBe(false);
    expect(fixture.componentInstance['codeLineNumbers']()).toBe(false);
    fixture.componentInstance['toggleCodeLineNumbers']();
    expect(pre.hasAttribute('data-line-numbers')).toBe(true);
    fixture.componentInstance['toggleCodeLineNumbers'](false);
    expect(pre.hasAttribute('data-line-numbers')).toBe(false);
    fixture.componentInstance['toggleCodeLineNumbers'](true);
    expect(pre.hasAttribute('data-line-numbers')).toBe(true);
    const written: string[] = [];
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: (value: string): Promise<void> => {
          written.push(value);
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    try {
      fixture.componentInstance['copyCode']();
      await Promise.resolve();
      expect(written[0]).toBe('code');
    } finally {
      Reflect.deleteProperty(window.navigator, 'clipboard');
    }
  });

  it('formats code by trimming trailing whitespace', () => {
    create();
    fixture.componentInstance.writeValue('<p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    line.textContent = 'code   ';
    placeCaret(area, line.firstChild as Node, 7);
    fixture.componentInstance['formatCode']();
    const trimmed = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    expect(trimmed.textContent).toBe('code');
  });

  it('removes the code block and keeps an editable paragraph', () => {
    create();
    fixture.componentInstance.writeValue('<p>before</p><p>code</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const paragraphs = area.querySelectorAll('p');
    const text = paragraphs[1]?.firstChild as Node;
    placeCaret(area, text, text.textContent?.length ?? 0);
    fixture.componentInstance['formatBlock']('pre');
    expect(area.querySelector('pre')).not.toBeNull();
    const pre = area.querySelector('pre') as HTMLElement;
    const line = pre.querySelector(
      '.solaris-rich-text-code-line',
    ) as HTMLElement;
    placeCaret(area, line.firstChild as Node, 0);
    fixture.componentInstance['removeCodeBlock']();
    expect(area.querySelector('pre')).toBeNull();
    expect(area.querySelectorAll('p')).toHaveLength(1);
    expect(fixture.componentInstance.value().html).not.toContain('<pre');
  });

  it('formats headings, lists, links and colors', () => {
    create();
    fixture.componentInstance['formatBlock']('h2');
    expect(fixture.componentInstance.value().html).toContain('<h2>');
    fixture.componentInstance['insertList']('ul');
    expect(fixture.componentInstance.value().html).toContain('<ul>');
    fixture.componentInstance['linkUrl'].set('https://example.com');
    fixture.componentInstance['applyLink']();
    expect(fixture.componentInstance.value().html).toContain(
      'https://example.com',
    );
    expect(fixture.componentInstance['linkUrl']()).toBe('');
    expect(fixture.componentInstance['linkText']()).toBe('');
    fixture.componentInstance['linkUrl'].set('javascript:alert(1)');
    const before = fixture.componentInstance.value().html;
    fixture.componentInstance['applyLink']();
    expect(fixture.componentInstance.value().html).toBe(before);
  });

  it('applies links with custom text and safe attributes', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['applyLink']('https://example.com', 'Custom');
    const anchor = area.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('https://example.com');
    expect(anchor?.textContent).toBe('Custom');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener');
  });

  it('prefills the link panel from the link under the caret', () => {
    create();
    fixture.componentInstance.writeValue(
      '<p><a href="https://example.com">Site</a></p>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const anchor = area.querySelector('a') as HTMLElement;
    placeCaret(area, anchor.firstChild as Node, 1);
    fixture.componentInstance['prepareLinkPopover']();
    expect(fixture.componentInstance['linkUrl']()).toBe('https://example.com');
    expect(fixture.componentInstance['linkText']()).toBe('Site');
  });

  it('prefills the link panel with ctrl+k', () => {
    create();
    fixture.componentInstance.writeValue(
      '<p><a href="https://example.com">Site</a></p>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const anchor = area.querySelector('a') as HTMLElement;
    placeCaret(area, anchor.firstChild as Node, 1);
    fixture.componentInstance['onEditorKeydown'](
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(fixture.componentInstance['linkUrl']()).toBe('https://example.com');
    expect(fixture.componentInstance['linkText']()).toBe('Site');
  });

  it('activates bold before typing and types inside the marker', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['toggleInline']('strong');
    const marker = area.querySelector('strong');
    expect(marker).toBeTruthy();
    marker?.appendChild(document.createTextNode('hi'));
    area.dispatchEvent(new Event('input', { bubbles: true }));
    expect(fixture.componentInstance.value().html).toBe('<strong>hi</strong>');
    expect(fixture.componentInstance['activeMarks']()['bold']).toBe(true);
  });

  it('toggles bold off on an empty marker', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['toggleInline']('strong');
    expect(area.querySelector('strong')).toBeTruthy();
    const strong = area.querySelector('strong') as HTMLElement;
    placeCaret(area, strong.firstChild as Node, 0);
    fixture.componentInstance['toggleInline']('strong');
    expect(area.querySelector('strong')).toBeNull();
  });

  it('applies color before typing and clears it after', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['setColor']('primary');
    expect(area.querySelector('span[data-color="primary"]')).toBeTruthy();
    fixture.componentInstance['setColor']('default');
    expect(area.querySelector('span[data-color]')).toBeNull();
  });

  it('reports active marks for the caret position', () => {
    create();
    fixture.componentInstance.writeValue('<p><strong><em>hi</em></strong></p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const em = area.querySelector('em') as HTMLElement;
    placeCaret(area, em.firstChild as Node, 1);
    expect(document.getSelection()?.rangeCount).toBe(1);
    expect(document.getSelection()?.anchorNode?.parentElement?.tagName).toBe(
      'EM',
    );
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeMarks']()['bold']).toBe(true);
    expect(fixture.componentInstance['activeMarks']()['italic']).toBe(true);
    expect(fixture.componentInstance['blockTag']()).toBe('p');
  });

  it('routes block select values and picks colors through the panel', () => {
    create();
    fixture.componentInstance['onBlockSelect']('h2');
    expect(fixture.componentInstance.value().html).toContain('<h2>');
    fixture.componentInstance['onBlockSelect']('nope');
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['pickTextColor']('primary');
    expect(area.querySelector('span[data-color="primary"]')).toBeTruthy();
    fixture.componentInstance['pickTextColor']('default');
    expect(area.querySelector('span[data-color]')).toBeNull();
  });

  it('routes align values including justify', () => {
    create();
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, 0);
    fixture.componentInstance['setAlign']('justify');
    expect(area.querySelector('p')?.getAttribute('data-align')).toBe('justify');
    fixture.componentInstance['setAlign']('left');
    expect(area.querySelector('p')?.hasAttribute('data-align')).toBe(false);
  });

  it('toggles code, sub and sup through the inline engine', () => {
    create();
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const selectText = (): void => {
      area.focus();
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
      const first = walker.nextNode() as Text | null;
      let last = first;
      let next: Node | null;
      while ((next = walker.nextNode())) last = next as Text;
      if (!first || !last) return;
      const range = document.createRange();
      range.setStart(first, 0);
      range.setEnd(last, last.length);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);
    };
    selectText();
    fixture.componentInstance['toggleInlineCode']();
    expect(area.querySelector('code')?.textContent).toBe('hi');
    selectText();
    fixture.componentInstance['toggleSubscript']();
    expect(area.querySelector('sub')?.textContent).toBe('hi');
    selectText();
    fixture.componentInstance['toggleSuperscript']();
    expect(area.querySelector('sup')?.textContent).toBe('hi');
  });

  it('clears inline formatting on selection and noops on a collapsed caret', () => {
    create();
    fixture.componentInstance.writeValue(
      '<p><strong>hi</strong> <a href="https://example.com">link</a></p>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    area.focus();
    const strong = area.querySelector('strong')?.firstChild as Node;
    const range = document.createRange();
    range.selectNodeContents(strong);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    fixture.componentInstance['clearFormatting']();
    expect(area.querySelector('strong')).toBeNull();
    expect(fixture.componentInstance.value().text).toContain('hi');
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, 1);
    const before = fixture.componentInstance.value().html;
    fixture.componentInstance['clearFormatting']();
    expect(fixture.componentInstance.value().html).toBe(before);
  });

  it('applies inline formats through keyboard shortcuts', () => {
    create();
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const selectText = (): void => {
      area.focus();
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
      const first = walker.nextNode() as Text | null;
      let last = first;
      let next: Node | null;
      while ((next = walker.nextNode())) last = next as Text;
      if (!first || !last) return;
      const range = document.createRange();
      range.setStart(first, 0);
      range.setEnd(last, last.length);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);
    };
    const press = (key: string, shiftKey = false): void => {
      fixture.componentInstance['onEditorKeydown'](
        new KeyboardEvent('keydown', {
          key,
          ctrlKey: true,
          shiftKey,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    selectText();
    press('b');
    expect(area.querySelector('strong')?.textContent).toBe('hi');
    selectText();
    press('S', true);
    expect(area.querySelector('s')?.textContent).toBe('hi');
    selectText();
    press('\\');
    expect(area.querySelector('s')).toBeNull();
    expect(area.querySelector('strong')).toBeNull();
    expect(fixture.componentInstance.value().text).toContain('hi');
  });

  it('applies strike and inline code through number shortcuts', () => {
    create();
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const selectText = (): void => {
      area.focus();
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
      let first = walker.nextNode() as Text | null;
      while (first && (first.textContent ?? '').length === 0) {
        first = walker.nextNode() as Text | null;
      }
      if (!first) return;
      const range = document.createRange();
      range.setStart(first, 0);
      range.setEnd(first, first.length);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);
    };
    const pressCode = (code: string, key: string): void => {
      fixture.componentInstance['onEditorKeydown'](
        new KeyboardEvent('keydown', {
          key,
          code,
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    selectText();
    pressCode('Digit5', '%');
    expect(area.querySelector('s')?.textContent).toBe('hi');
    selectText();
    pressCode('Digit9', '(');
    expect(area.querySelector('code')?.textContent).toBe('hi');
  });

  it('inserts a task list with static checkboxes', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    placeCaret(area, area, 0);
    fixture.componentInstance['insertTaskList']();
    const list = area.querySelector('ul[data-task-list]');
    expect(list).toBeTruthy();
    expect(list?.querySelector('input[type="checkbox"]')).toBeTruthy();
    expect(fixture.componentInstance.value().html).toContain('data-task-list');
  });

  it('undoes and redoes committed changes in a limited stack', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    fixture.componentInstance.writeValue('<p>a</p>');
    fixture.detectChanges();
    expect(fixture.componentInstance['canUndo']()).toBe(false);
    placeCaret(area, area, 0);
    fixture.componentInstance['insertTable'](2, 2);
    expect(fixture.componentInstance['canUndo']()).toBe(true);
    fixture.componentInstance['undo']();
    expect(fixture.componentInstance.value().html).toBe('<p>a</p>');
    expect(fixture.componentInstance['canUndo']()).toBe(false);
    expect(fixture.componentInstance['canRedo']()).toBe(true);
    fixture.componentInstance['redo']();
    expect(fixture.componentInstance.value().html).toContain('<table>');
    expect(fixture.componentInstance['canRedo']()).toBe(false);
    for (let i = 0; i < 60; i += 1) {
      fixture.componentInstance['commitValue'](
        normalizeEditorValue(`<p>${i}</p>`),
      );
    }
    expect(fixture.componentInstance['canUndo']()).toBe(true);
    expect(
      (fixture.componentInstance['historyPast']() as readonly unknown[]).length,
    ).toBeLessThanOrEqual(50);
  });

  it('merges fast typing into one history entry and splits on idle pauses', () => {
    expect(
      shouldCoalesceHistory(
        1000,
        1400,
        'typing',
        'typing',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(true);
    expect(
      shouldCoalesceHistory(
        1000,
        1000 + SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
        'typing',
        'typing',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(false);
    expect(
      shouldCoalesceHistory(
        1000,
        5000,
        'typing',
        'typing',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(false);
  });

  it('breaks history coalescing on toolbar actions and empty sessions', () => {
    expect(
      shouldCoalesceHistory(
        1000,
        1100,
        'action',
        'typing',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(false);
    expect(
      shouldCoalesceHistory(
        1000,
        1100,
        'typing',
        'action',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(false);
    expect(
      shouldCoalesceHistory(
        null,
        1100,
        null,
        'typing',
        SOLARIS_RICH_TEXT_HISTORY_IDLE_MS,
      ),
    ).toBe(false);
  });

  it('coalesces fast typing commits into a single undo step', () => {
    create();
    const now = vi.spyOn(Date, 'now');
    try {
      let current = 1000;
      now.mockImplementation(() => current);
      fixture.componentInstance.writeValue('<p></p>');
      const commitTyping = (html: string): void => {
        fixture.componentInstance['commitValue'](
          normalizeEditorValue(html),
          true,
          true,
        );
      };
      commitTyping('<p>t</p>');
      current += 100;
      commitTyping('<p>te</p>');
      current += 100;
      commitTyping('<p>ten</p>');
      expect(
        fixture.componentInstance['historyPast']() as readonly unknown[],
      ).toHaveLength(1);
      fixture.componentInstance['undo']();
      expect(fixture.componentInstance.value().text).toBe('');
    } finally {
      now.mockRestore();
    }
  });

  it('splits typing across idle pauses into separate undo steps', () => {
    create();
    const now = vi.spyOn(Date, 'now');
    try {
      let current = 2000;
      now.mockImplementation(() => current);
      fixture.componentInstance.writeValue('<p></p>');
      fixture.componentInstance['commitValue'](
        normalizeEditorValue('<p>eu </p>'),
        true,
        true,
      );
      current += SOLARIS_RICH_TEXT_HISTORY_IDLE_MS + 200;
      fixture.componentInstance['commitValue'](
        normalizeEditorValue('<p>eu tentei</p>'),
        true,
        true,
      );
      expect(
        fixture.componentInstance['historyPast']() as readonly unknown[],
      ).toHaveLength(2);
      fixture.componentInstance['undo']();
      expect(fixture.componentInstance.value().text).toBe('eu');
      fixture.componentInstance['undo']();
      expect(fixture.componentInstance.value().text).toBe('');
    } finally {
      now.mockRestore();
    }
  });

  it('breaks the typing session on toolbar commits', () => {
    create();
    const now = vi.spyOn(Date, 'now');
    try {
      let current = 3000;
      now.mockImplementation(() => current);
      fixture.componentInstance.writeValue('<p></p>');
      const commitTyping = (html: string): void => {
        fixture.componentInstance['commitValue'](
          normalizeEditorValue(html),
          true,
          true,
        );
      };
      commitTyping('<p>a</p>');
      current += 50;
      commitTyping('<p>ab</p>');
      expect(
        fixture.componentInstance['historyPast']() as readonly unknown[],
      ).toHaveLength(1);
      current += 50;
      fixture.componentInstance['commitValue'](
        normalizeEditorValue('<p>ab</p>'),
      );
      current += 50;
      commitTyping('<p>abc</p>');
      expect(
        fixture.componentInstance['historyPast']() as readonly unknown[],
      ).toHaveLength(3);
    } finally {
      now.mockRestore();
    }
  });

  it('animates the toolbar and area on content format switch', async () => {
    create();
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false }),
      configurable: true,
    });
    const animateSpy = vi
      .fn()
      .mockImplementation(() => ({ finished: Promise.resolve() }) as never);
    Object.defineProperty(window.HTMLElement.prototype, 'animate', {
      value: animateSpy,
      configurable: true,
    });
    try {
      fixture.componentInstance['toggleContentFormat']();
      expect(fixture.componentInstance.contentFormat()).toBe('plain');
      await new Promise((resolve) => setTimeout(resolve, 50));
      const slideIndexes = animateSpy.mock.calls
        .map((call, index) => ({ call, index }))
        .filter(({ call }) => JSON.stringify(call[0]).includes('translateX'))
        .map(({ index }) => index);
      expect(slideIndexes.length).toBeGreaterThan(0);
      // The block-style select (first toolbar child) stays fixed.
      const firstChild = fixture.nativeElement.querySelector(
        '.solaris-rich-text-toolbar',
      )?.firstElementChild;
      const slideInstances = slideIndexes.map(
        (index) => animateSpy.mock.instances[index],
      );
      expect(slideInstances).not.toContain(firstChild);
    } finally {
      Reflect.deleteProperty(window.HTMLElement.prototype, 'animate');
      Reflect.deleteProperty(window, 'matchMedia');
    }
  });

  it('skips the content format animation under reduced motion', () => {
    create();
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: true }),
      configurable: true,
    });
    const animateSpy = vi.fn();
    Object.defineProperty(window.HTMLElement.prototype, 'animate', {
      value: animateSpy,
      configurable: true,
    });
    try {
      fixture.componentInstance['toggleContentFormat']();
      expect(fixture.componentInstance.contentFormat()).toBe('plain');
      expect(animateSpy).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(window.HTMLElement.prototype, 'animate');
      Reflect.deleteProperty(window, 'matchMedia');
    }
  });

  it('skips the content format animation with data-reduced-motion', () => {
    create();
    document.documentElement.setAttribute('data-reduced-motion', 'true');
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({ matches: false }),
      configurable: true,
    });
    const animateSpy = vi.fn();
    Object.defineProperty(window.HTMLElement.prototype, 'animate', {
      value: animateSpy,
      configurable: true,
    });
    try {
      fixture.componentInstance['toggleContentFormat']();
      expect(fixture.componentInstance.contentFormat()).toBe('plain');
      expect(animateSpy).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(window.HTMLElement.prototype, 'animate');
      Reflect.deleteProperty(window, 'matchMedia');
      document.documentElement.removeAttribute('data-reduced-motion');
    }
  });

  it('undoes and redoes through keyboard shortcuts', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    fixture.componentInstance.writeValue('<p>a</p>');
    fixture.detectChanges();
    placeCaret(area, area, 0);
    fixture.componentInstance['insertTable'](2, 2);
    const press = (key: string, shiftKey = false): void => {
      fixture.componentInstance['onEditorKeydown'](
        new KeyboardEvent('keydown', {
          key,
          ctrlKey: true,
          shiftKey,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    press('z');
    expect(fixture.componentInstance.value().html).toBe('<p>a</p>');
    press('z', true);
    expect(fixture.componentInstance.value().html).toContain('<table>');
    press('z');
    press('y');
    expect(fixture.componentInstance.value().html).toContain('<table>');
  });

  it('inserts lists through keyboard shortcuts', () => {
    create();
    fixture.componentInstance.writeValue('<p>hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const selectText = (): void => {
      area.focus();
      const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
      const first = walker.nextNode() as Text | null;
      if (!first) return;
      const range = document.createRange();
      range.setStart(first, 0);
      range.setEnd(first, first.length);
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(range);
    };
    const pressCode = (code: string): void => {
      fixture.componentInstance['onEditorKeydown'](
        new KeyboardEvent('keydown', {
          key: code === 'Digit8' ? '*' : code === 'Digit7' ? '&' : '^',
          code,
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    };
    selectText();
    pressCode('Digit7');
    expect(area.querySelector('ol')).toBeTruthy();
    selectText();
    pressCode('Digit6');
    expect(area.querySelector('ul[data-task-list]')).toBeTruthy();
  });

  it('aligns figures and selects them for resizing', () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    const figure = area.querySelector('figure') as HTMLElement;
    expect(figure?.hasAttribute('data-selected')).toBe(true);
    fixture.componentInstance['setAlign']('center');
    expect(figure?.getAttribute('data-align')).toBe('center');
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeAlign']()).toBe('center');
    area.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    expect(figure?.hasAttribute('data-selected')).toBe(true);
    expect(figure?.querySelector('.solaris-image-resize-handle')).toBeTruthy();
    fixture.componentInstance['resizeFigure'](figure, 300);
    expect(figure.style.width).toBe('44px');
  });

  it('selects the figure when its image is clicked', () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    const figure = area.querySelector('figure[data-image]');
    expect(figure?.hasAttribute('data-selected')).toBe(true);
    expect(figure?.querySelector('.solaris-image-resize-handle')).toBeTruthy();
  });

  it('applies image presets, border toggle and removal on the selected figure', () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    const figure = area.querySelector(
      'figure[data-image]',
    ) as HTMLElement | null;
    expect(figure?.hasAttribute('data-selected')).toBe(true);
    fixture.componentInstance['applyImagePreset']('M');
    expect(figure?.style.width).toBe('44px');
    fixture.componentInstance['applyImagePreset']('original');
    expect(figure?.style.width).toBe('');
    fixture.componentInstance['toggleSelectedImageBorder']();
    expect(figure?.hasAttribute('data-bordered')).toBe(true);
    expect(fixture.componentInstance['imageBordered']()).toBe(true);
    fixture.componentInstance['toggleSelectedImageBorder']();
    expect(figure?.hasAttribute('data-bordered')).toBe(false);
    const removed: unknown[] = [];
    fixture.componentInstance.imageRemoved.subscribe(() => removed.push(true));
    fixture.componentInstance['removeImage']();
    expect(area.querySelector('figure[data-image]')).toBeNull();
    expect(removed).toHaveLength(1);
  });

  it('closes the image panel releasing the figure selection', () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    const figure = area.querySelector(
      'figure[data-image]',
    ) as HTMLElement | null;
    expect(figure?.hasAttribute('data-selected')).toBe(true);
    fixture.componentInstance['closeImagePanel']();
    expect(
      area.querySelector('figure[data-image]')?.hasAttribute('data-selected'),
    ).toBe(false);
    expect(fixture.componentInstance['imagePanelVisible']()).toBe(false);
    const liveAnchor = document.getSelection()?.anchorNode;
    const liveElement =
      liveAnchor instanceof Element ? liveAnchor : liveAnchor?.parentElement;
    expect(figure?.contains(liveElement ?? null)).toBe(false);
  });

  it('reports no color contrast without computed styles', () => {
    create();
    expect(fixture.componentInstance['colorContrast']()).toBeNull();
  });

  it('focuses the resize handle and copies the selected figure', async () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.componentInstance['focusImageHandle']();
    expect(
      (document.activeElement as HTMLElement | null)?.classList.contains(
        'solaris-image-resize-handle',
      ),
    ).toBe(true);
    const written: string[] = [];
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: (value: string): Promise<void> => {
          written.push(value);
          return Promise.resolve();
        },
      },
      configurable: true,
    });
    try {
      fixture.componentInstance['copySelectedImage']();
      await Promise.resolve();
      expect(written).toHaveLength(1);
      expect(written[0]).toContain('<figure data-image');
    } finally {
      Reflect.deleteProperty(window.navigator, 'clipboard');
    }
  });

  it('aligns the selected figure with justify', () => {
    create();
    fixture.componentInstance.writeValue(
      '<figure data-image><img src="https://example.com/a.png" alt="Logo" /></figure>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const img = area.querySelector('img') as HTMLElement;
    img.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    fixture.componentInstance['alignSelectedImage']('justify');
    expect(
      area.querySelector('figure[data-image]')?.getAttribute('data-align'),
    ).toBe('justify');
  });

  it('reports justify alignment in active states', () => {
    create();
    fixture.componentInstance.writeValue('<p data-align="justify">hi</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    placeCaret(area, text, 1);
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeAlign']()).toBe('justify');
  });

  it('applies the extended palette and detects it in active states', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    for (const color of ['danger', 'info', 'accent', 'violet'] as const) {
      placeCaret(area, area, 0);
      fixture.componentInstance['pickTextColor'](color);
      expect(area.querySelector(`span[data-color="${color}"]`)).toBeTruthy();
      fixture.componentInstance['updateActiveStates']();
      expect(fixture.componentInstance['activeColor']()).toBe(color);
      expect(buildColorSpanHtml(color, 'hi')).toContain(
        `data-color="${color}"`,
      );
      fixture.componentInstance['pickTextColor']('default');
    }
  });

  it('applies and clears highlight without touching text color', () => {
    create();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    expect(buildHighlightSpanHtml('info', 'x')).toContain(
      'data-highlight="info"',
    );
    expect(buildHighlightSpanHtml('default', 'x')).toBe('x');
    expect(
      removeHighlightSpans('<p><span data-highlight="info">a</span></p>'),
    ).toBe('<p>a</p>');
    placeCaret(area, area, 0);
    fixture.componentInstance['pickTextColor']('danger');
    fixture.componentInstance['pickHighlightColor']('info');
    expect(area.querySelector('span[data-color="danger"]')).toBeTruthy();
    expect(area.querySelector('span[data-highlight="info"]')).toBeTruthy();
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeColor']()).toBe('danger');
    expect(fixture.componentInstance['activeHighlight']()).toBe('info');
    const text = area.querySelector('span[data-highlight]')?.firstChild as Node;
    const range = document.createRange();
    range.selectNodeContents(text);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    fixture.componentInstance['clearHighlight']();
    expect(area.querySelector('span[data-highlight]')).toBeNull();
    expect(area.querySelector('span[data-color="danger"]')).toBeTruthy();
  });

  it('applies tonal colors through the merged span', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setColor']('primaryLight');
    expect(
      area.querySelector('span[data-color="primaryLight"]')?.textContent,
    ).toBe('hello');
    expect(fixture.componentInstance['activeColor']()).toBe('primaryLight');
    selectAllText(area);
    fixture.componentInstance['setColor']('primaryDark');
    expect(area.querySelectorAll('span[data-color]')).toHaveLength(1);
    expect(
      area.querySelector('span[data-color="primaryDark"]')?.textContent,
    ).toBe('hello');
  });

  it('applies the fixed Jira-style palette and detects it in active states', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setColor']('blue');
    expect(area.querySelector('span[data-color="blue"]')?.textContent).toBe(
      'hello',
    );
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeColor']()).toBe('blue');
    selectAllText(area);
    fixture.componentInstance['setHighlight']('lime');
    const merged = area.querySelector('span[data-color="blue"]');
    expect(merged?.textContent).toBe('hello');
    expect(merged?.getAttribute('data-highlight')).toBe('lime');
    fixture.componentInstance['updateActiveStates']();
    expect(fixture.componentInstance['activeHighlight']()).toBe('lime');
  });

  it('replaces text color on a second pick without nesting', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setColor']('primary');
    expect(area.querySelector('span[data-color="primary"]')?.textContent).toBe(
      'hello',
    );
    selectAllText(area);
    fixture.componentInstance['setColor']('danger');
    expect(area.querySelectorAll('span[data-color]')).toHaveLength(1);
    expect(area.querySelector('span[data-color="danger"]')?.textContent).toBe(
      'hello',
    );
    expect(area.querySelector('span[data-color="primary"]')).toBeNull();
    expect(fixture.componentInstance['activeColor']()).toBe('danger');
  });

  it('replaces highlight on a second pick without losing it', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setHighlight']('info');
    expect(area.querySelector('span[data-highlight="info"]')).toBeTruthy();
    selectAllText(area);
    fixture.componentInstance['setHighlight']('success');
    expect(area.querySelectorAll('span[data-highlight]')).toHaveLength(1);
    expect(area.querySelector('span[data-highlight="success"]')).toBeTruthy();
    expect(area.querySelector('span[data-highlight="info"]')).toBeNull();
    expect(fixture.componentInstance['activeHighlight']()).toBe('success');
  });

  it('keeps highlight when changing text color', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setColor']('primary');
    selectAllText(area);
    fixture.componentInstance['setHighlight']('info');
    selectAllText(area);
    fixture.componentInstance['setColor']('danger');
    const merged = area.querySelector('span[data-color="danger"]');
    expect(merged?.textContent).toBe('hello');
    expect(merged?.getAttribute('data-highlight')).toBe('info');
    expect(fixture.componentInstance['activeColor']()).toBe('danger');
    expect(fixture.componentInstance['activeHighlight']()).toBe('info');
  });

  it('keeps text color when changing highlight and clears only highlight', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    selectAllText(area);
    fixture.componentInstance['setColor']('primary');
    selectAllText(area);
    fixture.componentInstance['setHighlight']('info');
    selectAllText(area);
    fixture.componentInstance['setHighlight']('success');
    expect(area.querySelector('span[data-color="primary"]')).toBeTruthy();
    expect(area.querySelector('span[data-highlight="success"]')).toBeTruthy();
    selectAllText(area);
    fixture.componentInstance['clearHighlight']();
    expect(area.querySelector('span[data-highlight]')).toBeNull();
    expect(area.querySelector('span[data-color="primary"]')?.textContent).toBe(
      'hello',
    );
  });

  it('preserves sub and bold when coloring only part of the text', () => {
    create();
    fixture.componentInstance.writeValue(
      '<p>sdas<strong>bold</strong><sub>ss</sub></p>',
    );
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const sub = area.querySelector('sub')?.firstChild as Node;
    const range = document.createRange();
    range.selectNodeContents(sub);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    fixture.componentInstance['setColor']('danger');
    expect(area.querySelector('sub')?.textContent).toBe('ss');
    expect(area.querySelector('strong')?.textContent).toBe('bold');
    expect(
      area.querySelector('sub')?.closest('span[data-color="danger"]'),
    ).toBeTruthy();
    expect(
      area.querySelector('strong')?.closest('span[data-color="danger"]'),
    ).toBeNull();
  });

  it('restores a blurred selection when toggling from the toolbar', () => {
    create();
    fixture.componentInstance.writeValue('<p>hello</p>');
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector(
      '.solaris-rich-text-editor-area',
    ) as HTMLElement;
    const text = area.querySelector('p')?.firstChild as Node;
    const range = document.createRange();
    range.selectNodeContents(text);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
    area.dispatchEvent(new Event('blur'));
    document.getSelection()?.removeAllRanges();
    fixture.componentInstance['toggleInline']('strong');
    expect(fixture.componentInstance.value().html).toContain(
      '<strong>hello</strong>',
    );
  });

  function selectAllText(host: HTMLElement): void {
    host.focus();
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
    const first = walker.nextNode() as Text | null;
    let last = first;
    let next: Node | null;
    while ((next = walker.nextNode())) last = next as Text;
    if (!first || !last) return;
    const range = document.createRange();
    range.setStart(first, 0);
    range.setEnd(last, last.length);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
  }

  function placeCaret(host: HTMLElement, node: Node, offset: number): void {
    host.focus();
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
  }
});

describe('rich-text-editor utils (F1 core)', () => {
  beforeEach(() => resetRichTextBlockSequence());

  it('creates an empty value', () => {
    expect(isEmptyValue(createEmptyValue())).toBe(true);
  });

  it('trims trailing spaces and tabs', () => {
    expect(trimTrailingWhitespace('code   ')).toBe('code');
    expect(trimTrailingWhitespace('a\tb\t ')).toBe('a\tb');
    expect(trimTrailingWhitespace('  leading')).toBe('  leading');
    expect(trimTrailingWhitespace('')).toBe('');
  });

  it('normalizes code languages and builds code blocks', () => {
    expect(normalizeCodeLanguage('TypeScript')).toBe('typescript');
    expect(normalizeCodeLanguage('js')).toBe('javascript');
    expect(normalizeCodeLanguage('auto')).toBe('auto');
    expect(normalizeCodeLanguage('cobol')).toBe('text');
    expect(normalizeCodeLanguage(null)).toBe('text');
    expect(
      buildCodeBlockHtml({
        language: 'typescript',
        lineNumbers: true,
        text: 'a\nb',
      }),
    ).toBe(
      '<pre data-language="typescript" data-line-numbers=""><div class="solaris-rich-text-code-line">a</div><div class="solaris-rich-text-code-line">b</div></pre>',
    );
    expect(
      buildCodeBlockHtml({ language: 'cobol', lineNumbers: false, text: '' }),
    ).toBe(
      '<pre data-language="text"><div class="solaris-rich-text-code-line"><br /></div></pre>',
    );
  });

  it('computes WCAG contrast ratios from CSS colors', () => {
    expect(parseCssRgb('rgb(255, 255, 255)')).toEqual([255, 255, 255]);
    expect(parseCssRgb('rgba(0, 0, 0, 0)')).toEqual([0, 0, 0]);
    expect(parseCssRgb('transparent')).toBeNull();
    expect(parseCssRgba('rgba(0, 0, 0, 0)')).toEqual({
      color: [0, 0, 0],
      alpha: 0,
    });
    expect(parseCssRgba('rgb(36, 38, 45)')).toEqual({
      color: [36, 38, 45],
      alpha: 1,
    });
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 0);
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBeCloseTo(1, 2);
    expect(contrastRatio([36, 38, 45], [255, 255, 255])).toBeGreaterThan(4.5);
  });

  it('strips scripts and event handlers', () => {
    const clean = sanitizeRichTextHtml(
      '<p>hi</p><script>alert(1)</script><span onclick="x()">y</span><a href="javascript:1">z</a>',
    );
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('javascript:');
  });

  it('counts chars and words with emoji', () => {
    const value = fromPlainText('hello 👋 world');
    expect(getCharCount(value)).toBe(Array.from('hello 👋 world').length);
    expect(getWordCount(value)).toBe(3);
  });

  it('converts bold to markdown', () => {
    expect(toMarkdown(normalizeEditorValue('<p><strong>hi</strong></p>'))).toBe(
      '**hi**',
    );
  });

  it('truncates to maxLength without splitting surrogate pairs', () => {
    const value = truncateToMaxLength(fromPlainText('abc👋def'), 4);
    expect(Array.from(value.text)).toHaveLength(4);
  });

  it('inserts mention blocks and filters fields', () => {
    const fields = [
      { id: '1', label: 'Full name', key: 'fullName' },
      { id: '2', label: 'Email', key: 'email' },
    ];
    const blocks = insertMention(createEmptyValue().blocks, fields[0]);
    expect(blocks[blocks.length - 1]?.blockType).toBe('mention');
    expect(filterFields(fields, 'em')).toHaveLength(1);
  });

  it('normalizes empty string to empty value', () => {
    expect(isEmptyValue(normalizeEditorValue('   '))).toBe(true);
  });

  it('builds image figures and tables with clamped dimensions', () => {
    expect(buildImageFigureHtml({ url: 'https://x/y.png', alt: '' })).toBe('');
    expect(
      buildImageFigureHtml({ url: 'https://x/y.png', alt: 'Logo' }),
    ).toContain('<figure');
    expect(
      buildImageFigureHtml({ url: 'https://x/y.png', alt: 'Logo' }),
    ).not.toContain('figcaption');
    expect(buildTableHtml({ rows: 9, cols: 0 })).toContain('<table>');
    expect(clampTableDimension(9, 3)).toBe(5);
    expect(
      insertTableBlock(createEmptyValue().blocks, { rows: 2, cols: 2 }),
    ).toHaveLength(2);
  });

  it('validates links and builds blocks, lists and colored spans', () => {
    expect(isSafeHttpUrl('https://example.com/a?b=1')).toBe(true);
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('notaurl')).toBe(false);
    expect(buildLinkHtml('https://example.com', 'Site')).toContain(
      'rel="noopener"',
    );
    expect(buildLinkHtml('javascript:alert(1)', 'x')).toBe('x');
    expect(buildBlockHtml('h2', 'Hi')).toBe('<h2>Hi</h2>');
    expect(buildListHtml('ul', ['a', 'b'])).toContain('<li>a</li>');
    expect(buildColorSpanHtml('primary', 'hi')).toContain(
      'data-color="primary"',
    );
    expect(buildColorSpanHtml('default', 'hi')).toBe('hi');
    expect(
      insertBlockEntry(createEmptyValue().blocks, 'quote', 'q'),
    ).toHaveLength(2);
  });

  it('builds inline code and unwraps inline formatting', () => {
    expect(buildInlineCodeHtml('x<y')).toBe('<code>x&lt;y</code>');
    expect(
      unwrapInlineFormatting('<p><strong>hi</strong> <em>x</em></p>'),
    ).toBe('<p>hi x</p>');
    expect(
      unwrapInlineFormatting('<p><sub>s</sub><sup>2</sup><code>c</code></p>'),
    ).toBe('<p>s2c</p>');
    expect(
      unwrapInlineFormatting(
        '<p><a href="https://example.com">keep</a> <span data-mention data-field-id="f">Pill</span></p>',
      ),
    ).toBe(
      '<p><a href="https://example.com">keep</a> <span data-mention data-field-id="f">Pill</span></p>',
    );
    expect(
      unwrapInlineFormatting(
        '<p><span data-color="primary">a<span data-mention>b</span></span></p>',
      ),
    ).toBe('<p>a<span data-mention>b</span></p>');
    expect(
      unwrapInlineFormatting(
        '<p><span data-color="primary" data-highlight="info">hi</span></p>',
      ),
    ).toBe('<p><span data-highlight="info">hi</span></p>');
    expect(
      removeHighlightSpans(
        '<p><span data-color="primary" data-highlight="info">hi</span></p>',
      ),
    ).toBe('<p><span data-color="primary">hi</span></p>');
  });

  it('merges color and highlight into a single span', () => {
    expect(
      buildDataSpanHtml({ color: 'primary', highlight: 'info', text: 'hi' }),
    ).toBe('<span data-color="primary" data-highlight="info">hi</span>');
    expect(buildDataSpanHtml({ color: 'danger', text: 'hi' })).toBe(
      '<span data-color="danger">hi</span>',
    );
    expect(buildDataSpanHtml({ text: 'hi' })).toBe('hi');
  });

  it('detects light and dark tonal colors in active states', () => {
    expect(buildColorSpanHtml('primaryLight', 'hi')).toContain(
      'data-color="primaryLight"',
    );
    expect(buildColorSpanHtml('dangerDark', 'hi')).toContain(
      'data-color="dangerDark"',
    );
    expect(buildColorSpanHtml('cyan', 'hi')).toContain('data-color="cyan"');
    expect(buildColorSpanHtml('pinkDark', 'hi')).toContain(
      'data-color="pinkDark"',
    );
    const scan = createActiveScan();
    const host = document.createElement('div');
    host.innerHTML =
      '<p><span data-color="primaryLight">a</span><span data-color="violetDark">b</span></p>';
    const first = host.querySelector('span');
    if (first) accumulateActiveElement(first, scan);
    expect(scan.color).toBe('primaryLight');
  });

  it('builds task lists with escaped items', () => {
    expect(buildTaskListHtml([])).toContain('data-task-list');
    expect(buildTaskListHtml([])).toContain('type="checkbox"');
    expect(buildTaskListHtml(['a<b'])).toContain('a&lt;b');
    expect(buildTaskListHtml(['x', 'y']).split('<li>')).toHaveLength(3);
  });

  it('clamps image widths and strips resize chrome on commit', () => {
    expect(clampImageWidth(300, 44, 800)).toBe(300);
    expect(clampImageWidth(10, 44, 800)).toBe(44);
    expect(clampImageWidth(900, 44, 800)).toBe(800);
    expect(clampImageWidth(Number.NaN, 44, 800)).toBe(44);
    expect(
      cleanCommittedHtml(
        '<p><span class="solaris-image-resize-handle" role="slider"></span>hi</p>',
      ),
    ).toBe('<p>hi</p>');
    expect(
      cleanCommittedHtml('<figure data-image data-selected=""><br /></figure>'),
    ).toBe('<figure data-image><br /></figure>');
  });

  it('strips zero-width spaces and cleans empty inline tags', () => {
    expect(stripZeroWidthSpaces(`a${RICH_TEXT_ZERO_WIDTH_SPACE}b`)).toBe('ab');
    expect(
      cleanCommittedHtml(
        `<p><strong>${RICH_TEXT_ZERO_WIDTH_SPACE}</strong>hi</p>`,
      ),
    ).toBe('<p>hi</p>');
    expect(cleanCommittedHtml('<p><strong></strong>hi</p>')).toBe('<p>hi</p>');
    expect(
      cleanCommittedHtml('<p><span data-color="primary"></span>hi</p>'),
    ).toBe('<p>hi</p>');
  });
});
