import { TestBed, ComponentFixture } from '@angular/core/testing';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { SolarisDialogContentComponent } from '../component/dialog-content.component';

function createFixture(
  density?: 'compact' | 'normal' | 'comfortable',
  themeDensity?: 'compact' | 'normal' | 'comfortable',
): ComponentFixture<SolarisDialogContentComponent> {
  configureSolarisTesting(
    themeDensity ? { theme: { density: themeDensity } } : undefined,
  );
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisDialogContentComponent);
  if (density !== undefined) {
    fixture.componentRef.setInput('density', density);
  }
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogContentComponent density', () => {
  it('should default data-density to normal', () => {
    const fixture = createFixture();
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('normal');
  });

  it.each(['compact', 'normal', 'comfortable'] as const)(
    'should reflect input density %s on data-density',
    (density) => {
      const fixture = createFixture(density);
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('data-density')).toBe(density);
    },
  );

  it('should fall back to the theme density', () => {
    const fixture = createFixture(undefined, 'comfortable');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('comfortable');
  });

  it('should prefer input density over the theme density', () => {
    const fixture = createFixture('compact', 'comfortable');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('compact');
  });
});

describe('SolarisDialogContentComponent padding variable', () => {
  let scss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    scss = readFileSync(
      resolve(here, '../component/dialog-content.component.scss'),
      'utf8',
    );
  });

  it('should expose the padding as an overridable variable with spacing fallback', () => {
    expect(scss).toContain(
      '--solaris-dialog-content-padding: var(--solaris-spacing-0)',
    );
    expect(scss).toContain('padding: var(--solaris-dialog-content-padding)');
  });

  it('should map densities to spacing tokens without px', () => {
    const expectations = [
      ['compact', '--solaris-spacing-2'],
      ['normal', '--solaris-spacing-4'],
      ['comfortable', '--solaris-spacing-6'],
    ] as const;
    for (const [density, token] of expectations) {
      const block = scss.slice(
        scss.indexOf(`:host([data-density='${density}'])`),
        scss.indexOf('}', scss.indexOf(`:host([data-density='${density}'])`)),
      );
      expect(block).toContain(
        `--solaris-dialog-content-padding: var(${token})`,
      );
    }
    expect(scss).not.toMatch(/padding:\s*\d+px/);
  });

  it('should not provide a fallback for the public variable', () => {
    const uses = scss.match(/var\(--solaris-dialog-content-padding[^)]*\)/g);
    expect(uses?.length).toBeGreaterThan(0);
    for (const use of uses ?? []) {
      expect(use).not.toContain(',');
    }
  });
});
