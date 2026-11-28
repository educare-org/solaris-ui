import { beforeEach, describe, expect, it } from 'vitest';

import { SolarisRichTextEditingEngine } from '../component/rich-text-editor.engine';
import { SOLARIS_RICH_TEXT_CODE_LINE_CLASS } from '../model/rich-text-editor.defaults';

function makeRect(
  partial: Partial<DOMRect> & { top: number; left: number },
): DOMRect {
  return {
    x: partial.left,
    y: partial.top,
    top: partial.top,
    left: partial.left,
    right: partial.left + (partial.width ?? 0),
    bottom: partial.top + (partial.height ?? 0),
    width: partial.width ?? 0,
    height: partial.height ?? 0,
    toJSON: () => ({}),
  };
}

describe('SolarisRichTextEditingEngine', () => {
  let engine: SolarisRichTextEditingEngine;
  let host: HTMLElement;
  let editor: HTMLElement;

  beforeEach(() => {
    engine = new SolarisRichTextEditingEngine();
    host = document.createElement('div');
    editor = document.createElement('div');
    host.append(editor);
    document.body.append(host);
    engine.bind(editor);
  });

  it('is a no-op without a bound editor', () => {
    const idle = new SolarisRichTextEditingEngine();
    expect(() => idle.rememberSelection()).not.toThrow();
    expect(idle.restoreSelection()).toBe(false);
    expect(idle.selectedFigure()).toBeNull();
  });

  it('prefers the floating toolbar above the selection', () => {
    const { top, left } = engine.floatingPlacement(
      makeRect({ top: 200, left: 120, width: 60, height: 18 }),
      { width: 1024, height: 768 },
      { height: 52, width: 320 },
    );
    expect(top).toBe(200 - 52 - 8);
    expect(left).toBe(120);
  });

  it('flips the floating toolbar below when there is no room above', () => {
    const { top } = engine.floatingPlacement(
      makeRect({ top: 20, left: 120, width: 60, height: 18 }),
      { width: 1024, height: 768 },
      { height: 52, width: 320 },
    );
    expect(top).toBe(38 + 8);
  });

  it('clamps the floating toolbar inside the viewport width', () => {
    const { left } = engine.floatingPlacement(
      makeRect({ top: 200, left: 990, width: 60, height: 18 }),
      { width: 1024, height: 768 },
      { height: 52, width: 320 },
    );
    expect(left).toBe(1024 - 320 - 8);
  });

  it('places panels below the anchor relative to the host', () => {
    const hostRect = makeRect({ top: 100, left: 40, width: 600, height: 400 });
    const anchorRect = makeRect({ top: 150, left: 90, width: 200, height: 60 });
    const { top, left } = engine.panelBelow(hostRect, anchorRect);
    expect(top).toBe(150 + 60 - 100 + 8);
    expect(left).toBe(90 - 40);
  });

  it('reads code lines from uniform line divs', () => {
    const pre = document.createElement('pre');
    for (const text of ['const a = 1;', '  return a;']) {
      const line = document.createElement('div');
      line.className = SOLARIS_RICH_TEXT_CODE_LINE_CLASS;
      line.textContent = text;
      pre.append(line);
    }
    expect(engine.codeTextContent(pre)).toBe('const a = 1;\n  return a;');
    expect(engine.isCodeBlockClean(pre)).toBe(true);
  });

  it('treats stray breaks as line boundaries', () => {
    const pre = document.createElement('pre');
    pre.append(document.createTextNode('a'));
    pre.append(document.createElement('br'));
    pre.append(document.createTextNode('b'));
    expect(engine.codeTextContent(pre)).toBe('a\nb');
    expect(engine.isCodeBlockClean(pre)).toBe(false);
  });

  it('rebuilds code lines and restores the caret by offset', () => {
    const pre = document.createElement('pre');
    editor.append(pre);
    engine.writeCodeLines(pre, ['first', 'second'], 8);
    const lines = Array.from(
      pre.querySelectorAll(`.${SOLARIS_RICH_TEXT_CODE_LINE_CLASS}`),
    );
    expect(lines).toHaveLength(2);
    expect(lines[0]?.textContent).toBe('first');
    const selection = document.getSelection();
    expect(selection?.rangeCount).toBe(1);
    expect(selection?.anchorOffset).toBe(2);
    host.remove();
  });

  it('prepends the grip inside plain blocks', () => {
    const paragraph = document.createElement('p');
    editor.append(paragraph);
    engine.attachBlockGrip(paragraph);
    expect(
      paragraph.querySelector(':scope > .solaris-block-grip'),
    ).toBeTruthy();
    host.remove();
  });

  it('attaches a single detached grip as a sibling of code blocks', () => {
    const pre = document.createElement('pre');
    editor.append(pre);
    engine.writeCodeLines(pre, ['first'], null);
    engine.attachBlockGrip(pre);
    expect(pre.querySelector('.solaris-block-grip')).toBeNull();
    const grip = pre.previousElementSibling as HTMLElement | null;
    expect(grip?.classList.contains('solaris-block-grip')).toBe(true);
    expect(grip?.classList.contains('solaris-block-grip--detached')).toBe(true);
    expect(engine.isCodeBlockClean(pre)).toBe(true);
    host.remove();
  });
});
