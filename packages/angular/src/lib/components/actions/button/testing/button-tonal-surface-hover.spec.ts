describe('Button tonal/surface hover backgrounds', () => {
  const colors = [
    'neutral',
    'primary',
    'success',
    'warning',
    'danger',
    'info',
  ] as const;
  const appearances = ['tonal', 'surface'] as const;

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
    buttonScss = variants
      .split('#{$selector}')
      .join('solaris-button')
      .split('#{$prefix}')
      .join('button');
    iconButtonScss = variants
      .split('#{$selector}')
      .join('solaris-icon-button')
      .split('#{$prefix}')
      .join('icon-button');
  });

  function blockBody(
    scss: string,
    host: string,
    color: string,
    appearance: string,
  ): string {
    const selector = `[${host}][data-color='${color}'][data-appearance='${appearance}'] {`;
    const start = scss.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const open = scss.indexOf('{', start);
    const close = scss.indexOf('}', open);
    return scss.slice(open + 1, close);
  }

  function backgroundToken(
    body: string,
    prefix: string,
    state: '' | 'hover-' | 'active-',
  ): string {
    const declaration = body
      .split(';')
      .find((part) => part.includes(`--solaris-${prefix}-${state}background:`));
    expect(declaration).toBeTruthy();
    const token = declaration?.match(/--solaris-[\w-]+/g)?.pop();
    expect(token).toBeTruthy();
    return token as string;
  }

  function stateTokens(host: string, prefix: string, color: string) {
    const scss = host === 'solaris-button' ? buttonScss : iconButtonScss;
    const result: Record<string, Record<string, string>> = {};
    for (const appearance of appearances) {
      const body = blockBody(scss, host, color, appearance);
      result[appearance] = {
        rest: backgroundToken(body, prefix, ''),
        hover: backgroundToken(body, prefix, 'hover-'),
        active: backgroundToken(body, prefix, 'active-'),
      };
    }
    return result;
  }

  it.each(colors.map((color) => [color]))(
    'button tonal uses a hover background above rest for color %s',
    (color) => {
      const tokens = stateTokens(
        'solaris-button',
        'button',
        color as (typeof colors)[number],
      );
      expect(tokens['tonal']['hover']).not.toBe(tokens['tonal']['rest']);
    },
  );

  it.each(colors.map((color) => [color]))(
    'button surface uses a hover background above rest for color %s',
    (color) => {
      const tokens = stateTokens(
        'solaris-button',
        'button',
        color as (typeof colors)[number],
      );
      expect(tokens['surface']['hover']).not.toBe(tokens['surface']['rest']);
    },
  );

  it.each(colors.map((color) => [color]))(
    'button keeps the rest < hover < active ladder for color %s',
    (color) => {
      const tokens = stateTokens(
        'solaris-button',
        'button',
        color as (typeof colors)[number],
      );
      for (const appearance of appearances) {
        const states = tokens[appearance];
        expect(states['active']).not.toBe(states['rest']);
        expect(states['active']).not.toBe(states['hover']);
      }
    },
  );

  it.each(colors.map((color) => [color]))(
    'icon-button mirrors the button hover ladder for color %s',
    (color) => {
      const button = stateTokens(
        'solaris-button',
        'button',
        color as (typeof colors)[number],
      );
      const iconButton = stateTokens(
        'solaris-icon-button',
        'icon-button',
        color as (typeof colors)[number],
      );
      for (const appearance of appearances) {
        expect(iconButton[appearance]['hover']).not.toBe(
          iconButton[appearance]['rest'],
        );
        expect(iconButton[appearance]['active']).not.toBe(
          iconButton[appearance]['rest'],
        );
        expect(iconButton[appearance]['hover']).toBe(
          button[appearance]['hover'],
        );
        expect(iconButton[appearance]['active']).toBe(
          button[appearance]['active'],
        );
      }
    },
  );
});

describe('Button surface border transition', () => {
  it.each([
    ['solaris-button', 'button'],
    ['solaris-icon-button', 'icon-button'],
  ] as Array<[string, string]>)(
    '%s transitions border-width on the motion-normal step',
    async (host) => {
      const { readFileSync } = await import('node:fs');
      const { fileURLToPath } = await import('node:url');
      const { dirname, resolve } = await import('node:path');
      const here = dirname(fileURLToPath(import.meta.url));
      const file =
        host === 'solaris-button' ? '_button.scss' : '_icon-button.scss';
      const scss = readFileSync(
        resolve(here, '../../../../../styles', file),
        'utf8',
      );
      const selector = `[${host}][data-hydrated] {`;
      const start = scss.indexOf(selector);
      expect(start).toBeGreaterThan(-1);
      const body = scss.slice(
        scss.indexOf('{', start) + 1,
        scss.indexOf('}', scss.indexOf('{', start)),
      );
      expect(body).toContain(
        'border-width var(--solaris-motion-duration-normal)',
      );
      expect(body).not.toContain('transition: all');
    },
  );
});
