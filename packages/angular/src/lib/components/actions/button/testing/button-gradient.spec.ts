describe('Button gradient appearance', () => {
  const colors = [
    'neutral',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
  ] as const;

  const gradientFrom: Record<(typeof colors)[number], string> = {
    neutral: '--solaris-neutral-inverse',
    primary: '--solaris-primary-solid',
    success: '--solaris-success-solid',
    warning: '--solaris-warning-solid',
    danger: '--solaris-danger-solid',
    info: '--solaris-info-solid',
  };

  const gradientTo: Record<(typeof colors)[number], string> = {
    neutral: '--solaris-neutral-text-secondary',
    primary: '--solaris-violet-solid',
    success: '--solaris-info-solid',
    warning: '--solaris-warning-solid-active',
    danger: '--solaris-danger-solid-deep',
    info: '--solaris-info-foreground',
  };

  let buttonVariants = '';
  let buttonScss = '';
  let iconButtonScss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    const variants = readFileSync(
      resolve(here, '../../../../../styles/_button-variants.scss'),
      'utf8',
    );
    buttonVariants = variants
      .split('#{$selector}')
      .join('solaris-button')
      .split('#{$prefix}')
      .join('button');
    buttonScss = readFileSync(
      resolve(here, '../../../../../styles/_button.scss'),
      'utf8',
    );
    iconButtonScss = readFileSync(
      resolve(here, '../../../../../styles/_icon-button.scss'),
      'utf8',
    );
  });

  function normalizeCss(css: string): string {
    return css
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')');
  }

  function gradientBody(color: string): string {
    const selector = `[solaris-button][data-color='${color}'][data-appearance='gradient'] {`;
    const start = buttonVariants.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const open = buttonVariants.indexOf('{', start);
    const close = buttonVariants.indexOf('}', open);
    return normalizeCss(buttonVariants.slice(open + 1, close));
  }

  it.each(colors.map((color) => [color]))(
    '%s gradient ramps solid into its gradient stop at 135deg',
    (color) => {
      const body = gradientBody(color);
      expect(body).toContain(
        'linear-gradient(135deg, var(--solaris-button-gradient-from), var(--solaris-button-gradient-to))',
      );
      expect(body).toContain(`gradient-from: var(${gradientFrom[color]})`);
      expect(body).toContain(`gradient-to: var(${gradientTo[color]})`);
    },
  );

  it('uses a distinct partner hue for primary/success and depth for the rest', () => {
    const duotone: Record<string, string> = {
      primary: 'violet',
      success: 'info',
    };
    for (const [color, hue] of Object.entries(duotone)) {
      const body = gradientBody(color);
      expect(body).toContain(`gradient-to: var(--solaris-${hue}-solid)`);
      expect(body).not.toContain(`gradient-to: var(--solaris-${color}-solid`);
    }
  });

  it('keeps warning, danger, info, and neutral monochrome so hue identity holds', () => {
    const mono: Record<string, string> = {
      neutral: 'neutral-text-secondary',
      warning: 'warning-solid-active',
      danger: 'danger-solid-deep',
      info: 'info-foreground',
    };
    for (const [color, token] of Object.entries(mono)) {
      const body = gradientBody(color);
      expect(body).toContain(`gradient-to: var(--solaris-${token})`);
    }
  });

  it('darkens the first stop on hover and holds the darkest pair on active', () => {
    const body = gradientBody('primary');
    expect(body).toContain(
      'gradient-hover-from: var(--solaris-primary-solid-hover)',
    );
    expect(body).toContain(
      'gradient-hover-to: var(--solaris-violet-solid-active)',
    );
    expect(body).toContain(
      'gradient-active-from: var(--solaris-primary-solid-active)',
    );
    expect(body).toContain(
      'gradient-active-to: var(--solaris-violet-solid-active)',
    );
    expect(body).toContain(
      'hover-background: linear-gradient(135deg, var(--solaris-button-gradient-hover-from), var(--solaris-button-gradient-hover-to))',
    );
    expect(body).toContain(
      'active-background: linear-gradient(135deg, var(--solaris-button-gradient-active-from), var(--solaris-button-gradient-active-to))',
    );
  });

  it('mirrors solid text, border, and focus-ring tokens', () => {
    const body = gradientBody('primary');
    expect(body).toContain('color: var(--solaris-primary-on-solid)');
    expect(body).toContain('border-color: var(--solaris-primary-border)');
    expect(body).toContain('focus-ring-color: var(--solaris-primary-solid)');
    expect(buttonVariants).not.toContain('transition: all');
  });

  it('falls back to flat custom solid without consumer gradient variables', () => {
    const selector = `[solaris-button][data-color='custom'][data-appearance='gradient'] {`;
    const start = buttonVariants.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const body = normalizeCss(
      buttonVariants.slice(
        buttonVariants.indexOf('{', start) + 1,
        buttonVariants.indexOf('}', buttonVariants.indexOf('{', start)),
      ),
    );
    expect(body).toContain(
      'gradient-from: var(--solaris-button-custom-background)',
    );
    expect(body).toContain(
      'gradient-to: var(--solaris-button-custom-background)',
    );
    expect(body).toContain(
      'linear-gradient(135deg, var(--solaris-button-gradient-from), var(--solaris-button-gradient-to))',
    );
  });

  it.each([
    ['solaris-button', 'button'],
    ['solaris-icon-button', 'icon-button'],
  ] as Array<[string, string]>)(
    '%s wires gradient through the shared mixin with root defaults',
    (host, prefix) => {
      const scss = host === 'solaris-button' ? buttonScss : iconButtonScss;
      expect(scss).toContain('solaris-button-gradient(');
      expect(scss).toContain(`'${host}'`);
      expect(scss).toContain(`[${host}][data-appearance='gradient']`);
      expect(scss).toContain(`--solaris-${prefix}-gradient-from:`);
      expect(scss).toContain(`--solaris-${prefix}-gradient-active-to:`);
    },
  );

  it('keeps group attached rules appearance-agnostic so gradient inherits them', () => {
    for (const scss of [buttonScss, iconButtonScss]) {
      expect(scss).toContain(`[data-group='horizontal'][data-appearance]`);
      expect(scss).toContain(`[data-group='vertical'][data-appearance]`);
    }
    expect(buttonVariants).not.toContain('[data-group]');
  });

  it('emits no animation for gradient stops', () => {
    const start = buttonVariants.indexOf('solaris-button-gradient');
    expect(start).toBeGreaterThan(-1);
    const tail = buttonVariants.slice(start);
    expect(tail).not.toContain('animation:');
    expect(tail).not.toContain('@keyframes');
  });
});

describe('Button gradient data attribute', () => {
  it('stamps static data-appearance="gradient" so no flash paints', async () => {
    const { TestBed } = await import('@angular/core/testing');
    const { Component } = await import('@angular/core');
    const { SolarisButtonDirective } = await import(
      '../directives/button.directive'
    );

    @Component({
      standalone: true,
      imports: [SolarisButtonDirective],
      template: `<button
        solaris-button
        appearance="gradient"
        data-appearance="gradient"
      >
        Go
      </button>`,
    })
    class StaticGradientHost {}

    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(StaticGradientHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('[solaris-button]');
    expect(el.getAttribute('data-appearance')).toBe('gradient');
  });
});
