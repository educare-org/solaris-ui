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
    expect(shell).toContain(
      ".solaris-rich-text-editor-area ol > li::marker",
    );
    expect(shell).not.toContain('ol > li::before');
  });

  it('floats the drag grip outside the text flow with a grab cursor', () => {
    expect(shell).toContain('.solaris-block-grip');
    expect(shell).toContain('cursor: grab');
    expect(shell).toContain('position: absolute');
  });

  it('reserves a grip gutter without shifting text', () => {
    expect(shell).toContain(
      '.solaris-rich-text-editor:not([data-variant=\'composer\'])',
    );
    expect(shell).toContain('padding-left: calc(');
    expect(shell).toContain('left: -22px');
  });
});
