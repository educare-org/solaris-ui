import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, inject, type Type } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolarisIcons } from '../../../../../../services/icon/provider/provide-solaris-icons';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogContainerComponent } from '../component/dialog-container.component';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import { SOLARIS_DIALOG_REF, SOLARIS_DIALOG_DATA } from '../../../token/dialog-data.token';
import type { SolarisDialogOptions, SolarisDialogComponentConfig } from '../../root/model/dialog.types';

function createDialogRef(): SolarisDialogRef<unknown> {
  return new SolarisDialogRef<unknown>('test-dialog-id');
}

function q(fixture: ComponentFixture<unknown>, selector: string): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

describe('SolarisDialogContainerComponent', () => {
  describe('simple mode', () => {
    function createSimpleFixture(options: SolarisDialogOptions): ComponentFixture<SolarisDialogContainerComponent> {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
          { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
        ],
      });

      const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
      fixture.componentRef.setInput('simpleOptions', options);
      fixture.detectChanges();
      return fixture;
    }

    it('should create', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render the dialog panel with default host attributes', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-size')).toBe('md');
      expect(hostEl.getAttribute('data-variant')).toBe('neutral');
      expect(hostEl.getAttribute('data-appearance')).toBe('surface');
    });

    it('should render custom host attributes from options', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        size: 'lg',
        variant: 'info',
        appearance: 'outline',
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-size')).toBe('lg');
      expect(hostEl.getAttribute('data-variant')).toBe('info');
      expect(hostEl.getAttribute('data-appearance')).toBe('outline');
    });

    it('should render solaris-dialog component in simple mode', () => {
      const fixture = createSimpleFixture({ title: 'Simple Dialog' });
      const dialogEl = q(fixture, 'solaris-dialog');
      expect(dialogEl).toBeTruthy();
    });

    it('should pass simpleOptions to solaris-dialog', () => {
      const fixture = createSimpleFixture({ title: 'Pass Title', description: 'Pass Desc' });
      const titleEl = q(fixture, '.solaris-dialog-header__title');
      expect(titleEl?.textContent?.trim()).toBe('Pass Title');
      const descEl = q(fixture, '.solaris-dialog-header__description');
      expect(descEl?.textContent?.trim()).toBe('Pass Desc');
    });

    it('should apply panel dimensions from options', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        width: '500px',
        height: '400px',
        minWidth: '300px',
        maxWidth: '800px',
        minHeight: '200px',
        maxHeight: '600px',
      });
      fixture.detectChanges();

      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.style.width).toBe('500px');
      expect(panel.style.height).toBe('400px');
      expect(panel.style.minWidth).toBe('300px');
      expect(panel.style.maxWidth).toBe('800px');
      expect(panel.style.minHeight).toBe('200px');
      expect(panel.style.maxHeight).toBe('600px');
    });

    it('should default role to dialog', () => {
      const fixture = createSimpleFixture({ title: 'Test' });

      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.getAttribute('role')).toBe('dialog');
    });

    it('should set custom role when provided', () => {
      const fixture = createSimpleFixture({ title: 'Test', role: 'alertdialog' });

      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.getAttribute('role')).toBe('alertdialog');
    });

    it('should set aria-modal on dialog panel', () => {
      const fixture = createSimpleFixture({ title: 'Test' });

      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.getAttribute('aria-modal')).toBe('true');
    });

    describe('getters', () => {
      it('should return isSimpleMode true when simpleOptions is set', () => {
        const fixture = createSimpleFixture({ title: 'Test' });
        expect((fixture.componentInstance as any).isSimpleMode).toBe(true);
      });

      it('should reflect closeOnBackdrop default', () => {
        const fixture = createSimpleFixture({ title: 'Test' });
        expect((fixture.componentInstance as any).closeOnBackdrop).toBe(true);
      });

      it('should reflect closeOnBackdrop false', () => {
        const fixture = createSimpleFixture({ title: 'Test', closeOnBackdropClick: false });
        expect((fixture.componentInstance as any).closeOnBackdrop).toBe(false);
      });

      it('should reflect closeOnEscapeEnabled default', () => {
        const fixture = createSimpleFixture({ title: 'Test' });
        expect((fixture.componentInstance as any).closeOnEscapeEnabled).toBe(true);
      });

      it('should reflect closeOnEscapeEnabled false', () => {
        const fixture = createSimpleFixture({ title: 'Test', closeOnEscape: false });
        expect((fixture.componentInstance as any).closeOnEscapeEnabled).toBe(false);
      });
    });

    describe('backdrop click', () => {
      it('should close dialog when clicking backdrop and closeOnBackdrop is true', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test', closeOnBackdropClick: true });
        fixture.detectChanges();

        const backdrop = q(fixture, '.solaris-dialog-backdrop') as HTMLElement;
        backdrop.click();
        expect(closeSpy).toHaveBeenCalled();
      });

      it('should NOT close dialog when clicking backdrop and closeOnBackdrop is false', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test', closeOnBackdropClick: false });
        fixture.detectChanges();

        const backdrop = q(fixture, '.solaris-dialog-backdrop') as HTMLElement;
        backdrop.click();
        expect(closeSpy).not.toHaveBeenCalled();
      });

      it('should NOT close when clicking inside the panel (not backdrop)', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test' });
        fixture.detectChanges();

        const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
        panel.click();
        expect(closeSpy).not.toHaveBeenCalled();
      });
    });

    describe('escape key', () => {
      it('should close dialog on escape key when closeOnEscape is true', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test', closeOnEscape: true });
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(closeSpy).toHaveBeenCalled();
      });

      it('should NOT close dialog on escape key when closeOnEscape is false', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test', closeOnEscape: false });
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(closeSpy).not.toHaveBeenCalled();
      });

      it('should NOT close dialog on non-escape key', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
        fixture.componentRef.setInput('simpleOptions', { title: 'Test' });
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(closeSpy).not.toHaveBeenCalled();
      });
    });

    it('should show close button by default in rendered dialog', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      const closeBtn = q(fixture, '.solaris-dialog-header__close');
      expect(closeBtn).toBeTruthy();
    });

    it('should hide close button when closeable is false', () => {
      const fixture = createSimpleFixture({ title: 'Test', closeable: false });
      const closeBtn = q(fixture, '.solaris-dialog-header__close');
      expect(closeBtn).toBeFalsy();
    });
  });

  describe('external component mode', () => {
    @Component({
      standalone: true,
      template: '<p>External Component</p>',
    })
    class ExternalTestComponent {}

    @Component({
      standalone: true,
      template: '<p>{{ data }}</p>',
    })
    class ExternalWithDataComponent {
      readonly data = inject(SOLARIS_DIALOG_DATA);
    }

    function createExternalFixture(
      component: Type<unknown>,
      config?: SolarisDialogComponentConfig,
    ): ComponentFixture<SolarisDialogContainerComponent> {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
          { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
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

    it('should not render solaris-dialog in external component mode', () => {
      const fixture = createExternalFixture(ExternalTestComponent);
      const dialogEl = q(fixture, 'solaris-dialog');
      expect(dialogEl).toBeFalsy();
    });

    it('should render the external component', () => {
      const fixture = createExternalFixture(ExternalTestComponent);
      const content = (fixture.nativeElement as HTMLElement).textContent?.trim();
      expect(content).toContain('External Component');
    });

    it('should apply host attributes from externalComponentConfig', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        size: 'sm',
        appearance: 'outline',
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-size')).toBe('sm');
      expect(hostEl.getAttribute('data-appearance')).toBe('outline');
    });

    it('should set variant to null in external component mode', () => {
      const fixture = createExternalFixture(ExternalTestComponent);
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-variant')).toBeNull();
    });

    it('should inject dialog data into external component', () => {
      const fixture = createExternalFixture(ExternalWithDataComponent, {
        data: 'Injected Data',
      });
      fixture.detectChanges();
      const content = (fixture.nativeElement as HTMLElement).textContent?.trim();
      expect(content).toContain('Injected Data');
    });

    it('should provide dialog ref to external component', () => {
      @Component({
        standalone: true,
        template: '<p>ref:{{ hasRef }}</p>',
      })
      class RefCheckComponent {
        readonly ref = inject(SOLARIS_DIALOG_REF, { optional: true });
        get hasRef(): boolean {
          return !!this.ref;
        }
      }

      const fixture = createExternalFixture(RefCheckComponent);
      fixture.detectChanges();
      const content = (fixture.nativeElement as HTMLElement).textContent?.trim();
      expect(content).toContain('ref:true');
    });

    it('should update external component when changed via effect', () => {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolarisIcons({ extraIcons: SOLARIS_BUILT_IN_ICONS }),
          { provide: SOLARIS_DIALOG_REF, useValue: createDialogRef() },
        ],
      });

      const fixture = TestBed.createComponent(SolarisDialogContainerComponent);

      @Component({ standalone: true, template: '<p>First</p>' })
      class FirstComponent {}
      @Component({ standalone: true, template: '<p>Second</p>' })
      class SecondComponent {}

      fixture.componentRef.setInput('externalComponent', FirstComponent);
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('First');

      fixture.componentRef.setInput('externalComponent', SecondComponent);
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent).toContain('Second');
    });
  });
});
