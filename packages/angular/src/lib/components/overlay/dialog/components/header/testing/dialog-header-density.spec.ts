import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, type Type } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogHeaderComponent } from '../component/dialog-header.component';
import { SolarisDialogContainerComponent } from '../../container/component/dialog-container.component';
import { SolarisDialogComponent } from '../../root/component/dialog.component';
import type {
  SolarisDialogComponentConfig,
  SolarisDialogOptions,
} from '../../root/model/dialog.types';

function createHeaderFixture(
  density?: 'compact' | 'normal' | 'comfortable',
  themeDensity?: 'compact' | 'normal' | 'comfortable',
): ComponentFixture<SolarisDialogHeaderComponent> {
  configureSolarisTesting(
    themeDensity ? { theme: { density: themeDensity } } : undefined,
  );
  TestBed.configureTestingModule({
    providers: [
      ...provideSolaris({
        theme: themeDensity ? { density: themeDensity } : undefined,
        icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
      }),
      {
        provide: SOLARIS_DIALOG_REF,
        useValue: new SolarisDialogRef('test-header-density'),
      },
    ],
  });
  const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
  fixture.componentRef.setInput('title', 'Title');
  if (density !== undefined) {
    fixture.componentRef.setInput('density', density);
  }
  fixture.detectChanges();
  return fixture;
}

describe('SolarisDialogHeaderComponent density', () => {
  it('should default data-density to normal', () => {
    const fixture = createHeaderFixture();
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('normal');
  });

  it.each(['compact', 'normal', 'comfortable'] as const)(
    'should reflect input density %s on data-density',
    (density) => {
      const fixture = createHeaderFixture(density);
      const hostEl = fixture.nativeElement as HTMLElement;
      expect(hostEl.getAttribute('data-density')).toBe(density);
    },
  );

  it('should fall back to the theme density', () => {
    const fixture = createHeaderFixture(undefined, 'compact');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('compact');
  });

  it('should prefer input density over the theme density', () => {
    const fixture = createHeaderFixture('normal', 'comfortable');
    const hostEl = fixture.nativeElement as HTMLElement;
    expect(hostEl.getAttribute('data-density')).toBe('normal');
  });
});

describe('SolarisDialogHeaderComponent density scale', () => {
  let scss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    scss = readFileSync(
      resolve(here, '../component/dialog-header.component.scss'),
      'utf8',
    );
  });

  function densityBlock(density: string): string {
    const marker = `:host([data-density='${density}']) {`;
    const start = scss.indexOf(marker);
    expect(start).toBeGreaterThan(-1);
    const open = scss.indexOf('{', start);
    const close = scss.indexOf('}', open);
    return scss.slice(open + 1, close);
  }

  it.each([
    ['compact', '--solaris-font-size-md', '--solaris-spacing-7'],
    ['normal', '--solaris-font-size-lg', '--solaris-spacing-8'],
    ['comfortable', '--solaris-font-size-xl', '--solaris-spacing-9'],
  ])(
    'should pair icon and title on the same scale for density %s',
    (density, fontToken, mediaToken) => {
      const block = densityBlock(density);
      expect(block).toContain(`--solaris-dialog-icon-size: var(${fontToken})`);
      expect(block).toContain(`--solaris-dialog-title-size: var(${fontToken})`);
      expect(block).toContain(
        `--solaris-dialog-media-size: var(${mediaToken})`,
      );
    },
  );

  it('should correct the default icon scale from 2xl to lg', () => {
    expect(scss).toContain(
      '--solaris-dialog-icon-size: var(--solaris-font-size-lg)',
    );
    expect(scss).not.toContain('--solaris-font-size-2xl');
  });

  it('should render the title from the title-size variable', () => {
    expect(scss).toContain('var(--solaris-dialog-title-size)');
  });

  it('should use only solaris tokens without px for the scale', () => {
    const blocks = ['compact', 'normal', 'comfortable']
      .map(densityBlock)
      .join('\n');
    expect(blocks).not.toMatch(/\d+px/);
    expect(blocks).not.toMatch(/var\([^)]+,/);
  });
});

describe('SolarisDialogHeaderComponent density forwarding', () => {
  @Component({ standalone: true, template: '<p>External</p>' })
  class ExternalTestComponent {}

  function createContainerFixture(
    component: Type<unknown>,
    config?: SolarisDialogComponentConfig,
  ): ComponentFixture<SolarisDialogContainerComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        {
          provide: SOLARIS_DIALOG_REF,
          useValue: new SolarisDialogRef('test-density-forward'),
        },
      ],
    });
    const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
    fixture.componentRef.setInput('externalComponent', component);
    if (config) {
      fixture.componentRef.setInput('externalComponentConfig', config);
    }
    fixture.detectChanges();
    return fixture;
  }

  function createSimpleContainerFixture(
    options: SolarisDialogOptions,
  ): ComponentFixture<SolarisDialogContainerComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        {
          provide: SOLARIS_DIALOG_REF,
          useValue: new SolarisDialogRef('test-density-simple'),
        },
      ],
    });
    const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
    fixture.componentRef.setInput('simpleOptions', options);
    fixture.detectChanges();
    return fixture;
  }

  it('should forward chrome density to the header in component mode', () => {
    const fixture = createContainerFixture(ExternalTestComponent, {
      title: 'Chrome',
      density: 'comfortable',
    });
    const headerEl = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-header',
    );
    expect(headerEl?.getAttribute('data-density')).toBe('comfortable');
  });

  it('should default the chrome header density to normal', () => {
    const fixture = createContainerFixture(ExternalTestComponent, {
      title: 'Chrome',
    });
    const headerEl = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-header',
    );
    expect(headerEl?.getAttribute('data-density')).toBe('normal');
  });

  it('should forward density to the header in simple mode', () => {
    const fixture = createSimpleContainerFixture({
      title: 'Simple',
      density: 'compact',
    });
    const headerEl = (fixture.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-header',
    );
    expect(headerEl?.getAttribute('data-density')).toBe('compact');
  });

  it('should forward density to content and actions in simple mode', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({
      providers: [
        ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
        {
          provide: SOLARIS_DIALOG_REF,
          useValue: new SolarisDialogRef('test-density-dialog'),
        },
      ],
    });
    const host = TestBed.createComponent(SolarisDialogComponent);
    host.componentRef.setInput('options', {
      title: 'Title',
      description: 'Desc',
      density: 'comfortable',
    } as SolarisDialogOptions);
    host.detectChanges();
    const headerEl = (host.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-header',
    );
    const contentEl = (host.nativeElement as HTMLElement).querySelector(
      'solaris-dialog-content',
    );
    expect(headerEl?.getAttribute('data-density')).toBe('comfortable');
    expect(contentEl?.getAttribute('data-density')).toBe('comfortable');
  });
});
