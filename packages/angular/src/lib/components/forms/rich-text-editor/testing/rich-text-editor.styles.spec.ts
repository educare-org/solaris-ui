describe('rich-text-editor content shell', () => {
  let shell = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    shell = readFileSync(
      resolve(here, '../../../../../styles/_rich-text-editor.scss'),
      'utf8',
    );
  });

  it('keeps list markers beside left-floated images', () => {
    for (const list of ['ul', 'ol']) {
      expect(shell).toContain(
        `.solaris-rich-text-editor-area figure[data-align='start-wrap'] ~ ${list}`,
      );
    }
    expect(shell).toContain('display: flow-root;');
  });

  it('aligns ordered numbers with bullet markers in the same gutter', () => {
    expect(shell).toContain('.solaris-rich-text-editor-area ol > li::marker');
    expect(shell).not.toContain('ol > li::before');
  });

  it('keeps list gutters symmetric on both sides', () => {
    expect(shell).toContain('padding-right: var(--solaris-spacing-9)');
    expect(shell).toContain('padding-right: var(--solaris-spacing-2)');
  });

  it('animates the drag grip entrance with motion and opacity tokens', () => {
    expect(shell).toContain('@keyframes solaris-block-grip-enter');
    expect(shell).toContain('animation: solaris-block-grip-enter');
    expect(shell).toContain('var(--solaris-motion-duration-fast)');
    expect(shell).toContain('var(--solaris-motion-easing-decelerate)');
    expect(shell).toContain('var(--solaris-motion-translate-sm)');
    expect(shell).toContain('var(--solaris-opacity-0)');
    expect(shell).toContain('var(--solaris-opacity-50)');
    expect(shell).toContain('var(--solaris-opacity-100)');
  });

  it('keeps the content shell free of raw motion values and fallbacks', () => {
    expect(shell).not.toContain('120ms');
    expect(shell).not.toContain('radius-pill');
    expect(shell).not.toContain('opacity: 0.45');
    expect(shell).not.toContain('border-width-md,');
    expect(shell).not.toContain('easing-standard,');
  });

  it('floats the drag grip outside the text flow with a grab cursor', () => {
    expect(shell).toContain('.solaris-block-grip');
    expect(shell).toContain('cursor: grab');
    expect(shell).toContain('position: absolute');
  });

  it('keeps the drop line absolutely positioned inside the editor', () => {
    expect(shell).toContain('div:not(.solaris-block-drop-line)');
    expect(shell).toContain('.solaris-block-drop-line');
  });

  it('reserves a symmetric grip gutter without shifting text', () => {
    expect(shell).toContain(
      ".solaris-rich-text-editor:not([data-variant='composer'])",
    );
    expect(shell).toContain('padding-left: calc(');
    expect(shell).toContain('padding-right: calc(');
    expect(shell).toContain('--solaris-rich-text-grip-gutter');
    expect(shell).toContain(
      '--solaris-rich-text-grip-gutter: var(--solaris-spacing-8)',
    );
  });

  it('collapses the grip gutter when the editor is empty', () => {
    expect(shell).toContain('.solaris-rich-text-editor-area[data-empty]');
  });
});
