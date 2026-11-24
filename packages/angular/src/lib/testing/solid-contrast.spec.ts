describe('Solid contrast regression (primary on-solid over primary solid)', () => {
  const cases: Array<{ file: string; selector: string }> = [
    {
      file: '../components/navigation/stepper/components/root/component/stepper.component.scss',
      selector: "[data-status='active']",
    },
    {
      file: '../components/data-display/badge/component/badge.component.scss',
      selector: "[data-color='primary'][data-appearance='solid']",
    },
    {
      file: '../components/forms/checkbox/component/checkbox.component.scss',
      selector: "[data-color='primary'][data-checked]",
    },
    {
      file: '../components/forms/date/component/calendar.component.scss',
      selector: '[data-selected]',
    },
    {
      file: '../components/scheduling/calendar/year-view/component/year-view.component.scss',
      selector: '[data-today]',
    },
    {
      file: '../components/scheduling/calendar/month-view/component/month-view.component.scss',
      selector: '[data-today]',
    },
    {
      file: '../components/scheduling/calendar/week-view/component/week-view.component.scss',
      selector: '[data-today]',
    },
    {
      file: '../components/scheduling/calendar/schedule-view/component/schedule-view.component.scss',
      selector: '[data-today]',
    },
    {
      file: '../components/scheduling/calendar/shell/component/shell.component.scss',
      selector: '[data-today]',
    },
  ];

  const sources = new Map<string, string>();

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    for (const { file } of cases) {
      if (!sources.has(file)) {
        sources.set(file, readFileSync(resolve(here, file), 'utf8'));
      }
    }
  });

  function blocksWith(scss: string, needle: string): string[] {
    return scss.split('}').filter((block) => block.includes(needle));
  }

  it.each(cases.map((c) => [c.file, c.selector] as [string, string]))(
    '%s: solid primary background pairs with on-solid text (%s)',
    (file, selector) => {
      const scss = sources.get(file) ?? '';
      expect(scss.length).toBeGreaterThan(0);
      const blocks = blocksWith(scss, selector).filter((block) =>
        block.includes('var(--solaris-primary-solid)'),
      );
      expect(blocks.length).toBeGreaterThan(0);
      const textBlocks = blocks.filter(
        (block) =>
          block.includes('var(--solaris-primary-solid)') &&
          (block.includes('color:') || block.includes('-color:')),
      );
      expect(textBlocks.length).toBeGreaterThan(0);
      for (const block of textBlocks) {
        expect(block).toContain('var(--solaris-primary-on-solid)');
        expect(block).not.toContain('var(--solaris-primary-foreground)');
      }
    },
  );

  it('never pairs primary-foreground text with a primary-solid background', () => {
    for (const [file, scss] of sources) {
      const suspect = scss
        .split('}')
        .filter(
          (block) =>
            block.includes('var(--solaris-primary-solid)') &&
            block.includes('var(--solaris-primary-foreground)'),
        );
      expect(`${file}: ${suspect.join(' | ')}`).toBe(`${file}: `);
    }
  });
});
