import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, type Type } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF } from '../../../token/dialog-data.token';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';
import { SolarisDialogFooterComponent } from '../../footer/component/dialog-footer.component';
import { SolarisDialogActionsComponent } from '../../actions/component/dialog-actions.component';
import { SolarisDialogContainerComponent } from '../component/dialog-container.component';
import type {
  SolarisDialogComponentConfig,
  SolarisDialogOptions,
} from '../../root/model/dialog.types';

function providers(refId: string): unknown[] {
  return [
    ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
    {
      provide: SOLARIS_DIALOG_REF,
      useValue: new SolarisDialogRef(refId),
    },
  ];
}

describe('Dialog flat chrome', () => {
  it('should set data-flat on the header when flat is true', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({ providers: providers('flat-header') });
    const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
    fixture.componentRef.setInput('title', 'Title');
    fixture.componentRef.setInput('flat', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-flat'),
    ).toBe('');
  });

  it('should not set data-flat on the header by default', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({ providers: providers('flat-header-off') });
    const fixture = TestBed.createComponent(SolarisDialogHeaderComponent);
    fixture.componentRef.setInput('title', 'Title');
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-flat'),
    ).toBeNull();
  });

  it('should set data-flat on the footer when flat is true', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({ providers: providers('flat-footer') });
    const fixture = TestBed.createComponent(SolarisDialogFooterComponent);
    fixture.componentRef.setInput('flat', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-flat'),
    ).toBe('');
  });

  it('should set data-flat on actions when flat is true', () => {
    configureSolarisTesting();
    TestBed.configureTestingModule({ providers: providers('flat-actions') });
    const fixture = TestBed.createComponent(SolarisDialogActionsComponent);
    fixture.componentRef.setInput('actions', [{ label: 'Ok', close: true }]);
    fixture.componentRef.setInput('flat', true);
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('data-flat'),
    ).toBe('');
  });
});

describe('Dialog flat forwarding', () => {
  function createContainerFixture(
    refId: string,
    component: Type<unknown> | null,
    config?: SolarisDialogComponentConfig,
    options?: SolarisDialogOptions,
  ): ComponentFixture<SolarisDialogContainerComponent> {
    configureSolarisTesting();
    TestBed.configureTestingModule({ providers: providers(refId) });
    const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
    if (component) {
      fixture.componentRef.setInput('externalComponent', component);
    }
    if (config) {
      fixture.componentRef.setInput('externalComponentConfig', config);
    }
    if (options) {
      fixture.componentRef.setInput('simpleOptions', options);
    }
    fixture.detectChanges();
    return fixture;
  }

  @Component({ standalone: true, template: '<p>External</p>' })
  class ExternalFlatComponent {}

  @Component({ standalone: true, template: '<p>External</p>' })
  class ExternalOutlineComponent {}

  it('should forward flat appearance to chrome header and actions', () => {
    const fixture = createContainerFixture(
      'flat-chrome',
      ExternalFlatComponent,
      {
        title: 'Flat',
        appearance: 'flat',
        actions: [{ label: 'Ok', close: true }],
      },
    );
    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('solaris-dialog-header')?.getAttribute('data-flat'),
    ).toBe('');
    expect(
      root.querySelector('solaris-dialog-actions')?.getAttribute('data-flat'),
    ).toBe('');
  });

  it('should not fuse chrome for outline appearance', () => {
    const fixture = createContainerFixture(
      'flat-outline',
      ExternalOutlineComponent,
      {
        title: 'Outline',
        appearance: 'outline',
        actions: [{ label: 'Ok', close: true }],
      },
    );
    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('solaris-dialog-header')?.getAttribute('data-flat'),
    ).toBeNull();
  });

  it('should forward flat appearance to the simple-mode header', () => {
    const fixture = createContainerFixture('flat-simple', null, undefined, {
      title: 'Flat simple',
      appearance: 'flat',
    });
    const root = fixture.nativeElement as HTMLElement;
    expect(
      root.querySelector('solaris-dialog-header')?.getAttribute('data-flat'),
    ).toBe('');
  });
});

describe('Dialog flat styles', () => {
  let headerScss = '';
  let footerScss = '';
  let actionsScss = '';
  let containerScss = '';

  beforeAll(async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, resolve } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    headerScss = readFileSync(
      resolve(here, '../../header/component/dialog-header.component.scss'),
      'utf8',
    );
    footerScss = readFileSync(
      resolve(here, '../../footer/component/dialog-footer.component.scss'),
      'utf8',
    );
    actionsScss = readFileSync(
      resolve(here, '../../actions/component/dialog-actions.component.scss'),
      'utf8',
    );
    containerScss = readFileSync(
      resolve(here, '../component/dialog-container.component.scss'),
      'utf8',
    );
  });

  it('should fuse the header with the content in flat mode', () => {
    expect(headerScss).toContain(':host([data-flat])');
    expect(headerScss).toContain('background: transparent');
    expect(headerScss).toContain(':host([data-flat][data-separator])');
    expect(headerScss).toContain('border-bottom: none');
    expect(headerScss).toContain(':host([data-flat][data-scrolled])');
    expect(headerScss).toContain('box-shadow: none');
  });

  it('should fuse footer and actions with the content in flat mode', () => {
    for (const scss of [footerScss, actionsScss]) {
      expect(scss).toContain(':host([data-flat])');
      expect(scss).toContain('background: transparent');
      expect(scss).toContain('border-top: none');
      expect(scss).toContain('box-shadow: none');
    }
  });

  it('should keep the flat panel bordered like outline', () => {
    expect(containerScss).toContain(
      ":host([data-appearance='flat']) .solaris-dialog-panel",
    );
  });
});

describe('Dialog backdrop blur', () => {
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

  it('should blur the backdrop with an overridable variable', () => {
    expect(containerScss).toContain(
      '--solaris-dialog-backdrop-filter: blur(2px)',
    );
    expect(containerScss).toContain(
      'backdrop-filter: var(--solaris-dialog-backdrop-filter)',
    );
    expect(containerScss).toContain(
      '-webkit-backdrop-filter: var(--solaris-dialog-backdrop-filter)',
    );
  });
});
