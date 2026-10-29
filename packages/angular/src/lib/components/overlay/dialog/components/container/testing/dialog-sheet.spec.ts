describe('Dialog sheet edges', () => {
  let containerScss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    containerScss = readFileSync(
      resolve(here, '../component/dialog-container.component.scss'),
      'utf8',
    );
  });

  it('should render sheets with straight edges regardless of radius', () => {
    expect(containerScss).toContain(
      ":host([data-sheet][data-placement='bottom']) .solaris-dialog-panel",
    );
    expect(containerScss).toContain(
      'border-radius: var(--solaris-radius-none)',
    );
  });
});
