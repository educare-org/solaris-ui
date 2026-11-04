/**
 * Regression: button/icon-button press feedback is subtle (0.99) and button
 * width changes (loader, badge, text swap) animate instead of flicking.
 *
 * Context: `:active` used the global `--solaris-motion-scale-active` (0.97),
 * which reads as a hard shrink on small buttons. Width-affecting changes
 * (spinner insert, badge slot, label swap) had no `width`/`min-width`/
 * `padding`/`gap` transition, so the button jumped instantly.
 */
describe('Button press and width motion', () => {
  let buttonScss = '';
  let iconButtonScss = '';
  let motionScss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    buttonScss = readFileSync(
      resolve(here, '../../../../../styles/_button.scss'),
      'utf8',
    );
    iconButtonScss = readFileSync(
      resolve(here, '../../../../../styles/_icon-button.scss'),
      'utf8',
    );
    motionScss = readFileSync(
      resolve(here, '../../../../../styles/token/motion/_motion.scss'),
      'utf8',
    );
  });

  function hydratedBody(scss: string, host: string): string {
    const selector = `[${host}][data-hydrated] {`;
    const start = scss.indexOf(selector);
    expect(start).toBeGreaterThan(-1);
    const open = scss.indexOf('{', start);
    const close = scss.indexOf('}', open);
    return scss.slice(open + 1, close);
  }

  it('defines dedicated 0.99 press-scale tokens', () => {
    expect(motionScss).toContain('--solaris-button-scale-active: 0.99');
    expect(motionScss).toContain('--solaris-icon-button-scale-active: 0.99');
  });

  it.each([
    ['solaris-button', 'button'],
    ['solaris-icon-button', 'icon-button'],
  ] as Array<[string, string]>)(
    '%s uses its dedicated press-scale token on :active',
    (host, prefix) => {
      const scss = host === 'solaris-button' ? buttonScss : iconButtonScss;
      expect(scss).toContain(`scale(var(--solaris-${prefix}-scale-active))`);
      expect(scss).not.toContain('scale(var(--solaris-motion-scale-active))');
    },
  );

  it('button transitions width-affecting properties on the motion-normal step', () => {
    const body = hydratedBody(buttonScss, 'solaris-button');
    for (const property of ['min-width', 'width', 'padding', 'gap']) {
      expect(body).toContain(
        `${property} var(--solaris-motion-duration-normal)`,
      );
    }
    expect(body).not.toContain('transition: all');
  });

  it('button enables keyword size interpolation for auto-width animation', () => {
    expect(buttonScss).toContain('interpolate-size: allow-keywords');
  });

  it.each([
    ['solaris-button', '_button.scss'],
    ['solaris-icon-button', '_icon-button.scss'],
  ] as Array<[string, string]>)(
    '%s animates the loading spinner entry',
    (host, file) => {
      const scss = file === '_button.scss' ? buttonScss : iconButtonScss;
      const selector = `[${host}][data-loading] solaris-spinner {`;
      const start = scss.indexOf(selector);
      expect(start).toBeGreaterThan(-1);
      const body = scss.slice(
        scss.indexOf('{', start) + 1,
        scss.indexOf('}', scss.indexOf('{', start)),
      );
      expect(body).toContain('solaris-motion-pop-in');
      expect(body).toContain('var(--solaris-motion-duration-normal)');
    },
  );

  it('button disables width transition and spinner animation under reduced motion', () => {
    expect(buttonScss).toContain(
      "[data-reduced-motion='true'] [solaris-button][data-hydrated]",
    );
    expect(buttonScss).toContain('transition: none');
  });
});
