import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, inject, type Type } from '@angular/core';
import { configureSolarisTesting } from '../../../../../../testing/solaris-test-utilities';
import { provideSolaris } from '../../../../../../providers/provide-solaris';
import { SOLARIS_BUILT_IN_ICONS } from '../../../../../../services/icon/icons/solaris-built-in-icons';
import { SolarisDialogContainerComponent } from '../component/dialog-container.component';
import { SolarisDialogHeaderComponent } from '../../header/component/dialog-header.component';
import { SolarisDialogRef } from '../../../service/dialog-ref';
import {
  SOLARIS_DIALOG_REF,
  SOLARIS_DIALOG_DATA,
} from '../../../token/dialog-data.token';
import type {
  SolarisDialogOptions,
  SolarisDialogComponentConfig,
} from '../../root/model/dialog.types';

function createDialogRef(): SolarisDialogRef<unknown> {
  return new SolarisDialogRef<unknown>('test-dialog-id');
}

function q(
  fixture: ComponentFixture<unknown>,
  selector: string,
): HTMLElement | null {
  return (fixture.nativeElement as HTMLElement).querySelector(selector);
}

describe('SolarisDialogContainerComponent', () => {
  describe('simple mode', () => {
    function createSimpleFixture(
      options: SolarisDialogOptions,
    ): ComponentFixture<SolarisDialogContainerComponent> {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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

      expect(hostEl.getAttribute('data-fullscreen')).toBeNull();
      expect(hostEl.getAttribute('data-variant')).toBe('neutral');
      expect(hostEl.getAttribute('data-appearance')).toBe('outline');
      expect(hostEl.getAttribute('data-placement')).toBe('center');
      expect(hostEl.getAttribute('data-backdrop')).toBe('true');
    });

    it('should render custom host attributes from options', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        fullscreen: true,
        variant: 'info',
        appearance: 'outline',
        placement: 'bottom',
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-fullscreen')).toBe('');
      expect(hostEl.getAttribute('data-variant')).toBe('info');
      expect(hostEl.getAttribute('data-appearance')).toBe('outline');
      expect(hostEl.getAttribute('data-placement')).toBe('bottom');
    });

    it('should render solaris-dialog component in simple mode', () => {
      const fixture = createSimpleFixture({ title: 'Simple Dialog' });
      const dialogEl = q(fixture, 'solaris-dialog');
      expect(dialogEl).toBeTruthy();
    });

    it('should pass simpleOptions to solaris-dialog', () => {
      const fixture = createSimpleFixture({
        title: 'Pass Title',
        description: 'Pass Desc',
      });
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
      const fixture = createSimpleFixture({
        title: 'Test',
        role: 'alertdialog',
      });

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
        const fixture = createSimpleFixture({
          title: 'Test',
          closeOnBackdropClick: false,
        });
        expect((fixture.componentInstance as any).closeOnBackdrop).toBe(false);
      });

      it('should reflect closeOnEscapeEnabled default', () => {
        const fixture = createSimpleFixture({ title: 'Test' });
        expect((fixture.componentInstance as any).closeOnEscapeEnabled).toBe(
          true,
        );
      });

      it('should reflect closeOnEscapeEnabled false', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          closeOnEscape: false,
        });
        expect((fixture.componentInstance as any).closeOnEscapeEnabled).toBe(
          false,
        );
      });
    });

    describe('backdrop click', () => {
      it('should close dialog when clicking backdrop and closeOnBackdrop is true', () => {
        const ref = createDialogRef();
        const closeSpy = vi.spyOn(ref, 'close');

        configureSolarisTesting();
        TestBed.configureTestingModule({
          providers: [
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
        fixture.componentRef.setInput('simpleOptions', {
          title: 'Test',
          closeOnBackdropClick: true,
        });
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
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
        fixture.componentRef.setInput('simpleOptions', {
          title: 'Test',
          closeOnBackdropClick: false,
        });
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
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
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
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
        fixture.componentRef.setInput('simpleOptions', {
          title: 'Test',
          closeOnEscape: true,
        });
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
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
        fixture.componentRef.setInput('simpleOptions', {
          title: 'Test',
          closeOnEscape: false,
        });
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
            ...provideSolaris({
              icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
            }),
            { provide: SOLARIS_DIALOG_REF, useValue: ref },
          ],
        });

        const fixture = TestBed.createComponent(
          SolarisDialogContainerComponent,
        );
        fixture.componentRef.setInput('simpleOptions', { title: 'Test' });
        fixture.detectChanges();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(closeSpy).not.toHaveBeenCalled();
      });
    });

    it('should show close button by default in rendered dialog', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      const closeBtn = q(fixture, '[data-dialog-close]');
      expect(closeBtn).toBeTruthy();
    });

    it('should hide close button when closeable is false', () => {
      const fixture = createSimpleFixture({ title: 'Test', closeable: false });
      const closeBtn = q(fixture, '[data-dialog-close]');
      expect(closeBtn).toBeFalsy();
    });

    it('should set default aria-label on close button', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      const closeBtn = q(fixture, '[data-dialog-close]');
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close');
    });

    it('should render the close button inside the header in simple mode', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      expect(q(fixture, '.solaris-dialog-header__close')).toBeTruthy();
      expect(q(fixture, '.solaris-dialog-container__close')).toBeNull();
    });

    it('should close dialog when close button is clicked', () => {
      const ref = createDialogRef();
      const closeSpy = vi.spyOn(ref, 'close');

      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolaris({
            icons: { extraIcons: SOLARIS_BUILT_IN_ICONS },
          }),
          { provide: SOLARIS_DIALOG_REF, useValue: ref },
        ],
      });

      const fixture = TestBed.createComponent(SolarisDialogContainerComponent);
      fixture.componentRef.setInput('simpleOptions', { title: 'Test' });
      fixture.detectChanges();

      const closeBtn = q(fixture, '[data-dialog-close]') as HTMLElement;
      closeBtn.click();
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should render default radius, density and separators on host', () => {
      const fixture = createSimpleFixture({ title: 'Test' });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-radius')).toBe('lg');
      expect(hostEl.getAttribute('data-density')).toBe('normal');
      expect(hostEl.getAttribute('data-header-separator')).toBe('');
      expect(hostEl.getAttribute('data-footer-separator')).toBe('');
    });

    it('should wire aria-labelledby and aria-describedby from title and description', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        description: 'Desc',
      });
      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.getAttribute('aria-labelledby')).toBe(
        'test-dialog-id-title',
      );
      expect(panel.getAttribute('aria-describedby')).toBe(
        'test-dialog-id-description',
      );
      expect(panel.getAttribute('aria-label')).toBeNull();
    });

    it('should match aria references with the rendered header ids', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        description: 'Desc',
      });
      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      const titleId = q(fixture, '.solaris-dialog-header__title')?.id;
      const descId = q(fixture, '.solaris-dialog-header__description')?.id;
      expect(titleId).toBeTruthy();
      expect(descId).toBeTruthy();
      expect(panel.getAttribute('aria-labelledby')).toBe(titleId);
      expect(panel.getAttribute('aria-describedby')).toBe(descId);
    });

    it('should prefer explicit aria attributes over title/description defaults', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        description: 'Desc',
        ariaLabel: 'Custom label',
        ariaLabelledBy: 'custom-title',
        ariaDescribedBy: 'custom-desc',
      });
      const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
      expect(panel.getAttribute('aria-label')).toBe('Custom label');
      expect(panel.getAttribute('aria-labelledby')).toBe('custom-title');
      expect(panel.getAttribute('aria-describedby')).toBe('custom-desc');
    });

    describe('auto focus', () => {
      it('should default autoFocus to first-tabbable', () => {
        const fixture = createSimpleFixture({ title: 'Test' });
        const instance = fixture.componentInstance as unknown as {
          resolvedAutoFocus: string;
        };
        expect(instance.resolvedAutoFocus).toBe('first-tabbable');
      });

      it('should not move focus when autoFocus is false', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          autoFocus: false,
        });
        expect(
          (fixture.nativeElement as HTMLElement).contains(
            document.activeElement,
          ),
        ).toBe(false);
      });

      it('should focus the panel when autoFocus is panel', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          autoFocus: 'panel',
        });
        const panel = q(fixture, '.solaris-dialog-panel');
        expect(document.activeElement).toBe(panel);
      });

      it('should focus the action with autoFocus', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          actions: [
            { label: 'Cancel', close: true },
            { label: 'Confirm', close: true, autoFocus: true },
          ],
        });
        const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
          '[solaris-button]',
        );
        expect(buttons).toHaveLength(2);
        expect(document.activeElement).toBe(buttons[1]);
      });

      it('should focus the first action by default', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          actions: [
            { label: 'Cancel', close: true },
            { label: 'Confirm', close: true },
          ],
        });
        const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
          '[solaris-button]',
        );
        expect(buttons).toHaveLength(2);
        expect(document.activeElement).toBe(buttons[0]);
      });

      it('should mark the autofocus action with data-autofocus', () => {
        const fixture = createSimpleFixture({
          title: 'Test',
          actions: [
            { label: 'Cancel', close: true },
            { label: 'Confirm', close: true, autoFocus: true },
          ],
        });
        const marked = (fixture.nativeElement as HTMLElement).querySelectorAll(
          '[solaris-button][data-autofocus]',
        );
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent?.trim()).toBe('Confirm');
      });
    });

    it('should reflect custom radius, density and separators on host', () => {
      const fixture = createSimpleFixture({
        title: 'Test',
        radius: 'xl',
        density: 'comfortable',
        headerSeparator: false,
        footerSeparator: false,
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-radius')).toBe('xl');
      expect(hostEl.getAttribute('data-density')).toBe('comfortable');
      expect(hostEl.getAttribute('data-header-separator')).toBeNull();
      expect(hostEl.getAttribute('data-footer-separator')).toBeNull();
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

    @Component({
      standalone: true,
      imports: [SolarisDialogHeaderComponent],
      template: '<solaris-dialog-header title="Manual" /><p>Body</p>',
    })
    class ManualHeaderComponent {}

    @Component({
      standalone: true,
      imports: [SolarisDialogHeaderComponent],
      template: '<solaris-dialog-header title="Manual" closeable /><p>Body</p>',
    })
    class ManualHeaderCloseableComponent {}

    function createExternalFixture(
      component: Type<unknown>,
      config?: SolarisDialogComponentConfig,
    ): ComponentFixture<SolarisDialogContainerComponent> {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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
      const content = (
        fixture.nativeElement as HTMLElement
      ).textContent?.trim();
      expect(content).toContain('External Component');
    });

    it('should apply host attributes from externalComponentConfig', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        fullscreen: true,
        appearance: 'outline',
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-fullscreen')).toBe('');
      expect(hostEl.getAttribute('data-appearance')).toBe('outline');
    });

    it('should set variant to null in external component mode', () => {
      const fixture = createExternalFixture(ExternalTestComponent);
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-variant')).toBeNull();
    });

    it('should default backdrop to true on the host', () => {
      const fixture = createExternalFixture(ExternalTestComponent);
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-backdrop')).toBe('true');
    });

    it('should reflect backdrop false on the host', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        backdrop: false,
      });
      const hostEl = fixture.nativeElement as HTMLElement;

      expect(hostEl.getAttribute('data-backdrop')).toBe('false');
    });

    it('should render the standard close button when closeable', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        closeable: true,
      });
      const closeBtn = q(fixture, '[data-dialog-close]');

      expect(closeBtn).toBeTruthy();
    });

    it('should not render the close button when closeable is false', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        closeable: false,
      });
      const closeBtn = q(fixture, '[data-dialog-close]');

      expect(closeBtn).toBeNull();
    });

    it('should not render solaris-dialog-header in external component mode', () => {
      const fixture = createExternalFixture(ExternalTestComponent, {
        closeable: true,
      });
      const headerEl = q(fixture, 'solaris-dialog-header');

      expect(headerEl).toBeNull();
    });

    it('should inject dialog data into external component', () => {
      const fixture = createExternalFixture(ExternalWithDataComponent, {
        data: 'Injected Data',
      });
      fixture.detectChanges();
      const content = (
        fixture.nativeElement as HTMLElement
      ).textContent?.trim();
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
      const content = (
        fixture.nativeElement as HTMLElement
      ).textContent?.trim();
      expect(content).toContain('ref:true');
    });

    it('should update external component when changed via effect', () => {
      configureSolarisTesting();
      TestBed.configureTestingModule({
        providers: [
          ...provideSolaris({ icons: { extraIcons: SOLARIS_BUILT_IN_ICONS } }),
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
      expect((fixture.nativeElement as HTMLElement).textContent).toContain(
        'First',
      );

      fixture.componentRef.setInput('externalComponent', SecondComponent);
      fixture.detectChanges();
      expect((fixture.nativeElement as HTMLElement).textContent).toContain(
        'Second',
      );
    });

    describe('external component chrome (header/actions)', () => {
      it('should not render chrome header or actions by default', () => {
        const fixture = createExternalFixture(ExternalTestComponent);
        expect(q(fixture, 'solaris-dialog-header')).toBeNull();
        expect(q(fixture, 'solaris-dialog-actions')).toBeNull();
      });

      it('should render chrome header from title and description', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          description: 'Chrome description',
        });
        const titleEl = q(fixture, '.solaris-dialog-header__title');
        expect(titleEl?.textContent?.trim()).toBe('Chrome Title');
        const descEl = q(fixture, '.solaris-dialog-header__description');
        expect(descEl?.textContent?.trim()).toBe('Chrome description');
      });

      it('should render chrome actions from config', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'With actions',
          actions: [
            { label: 'Cancel', appearance: 'ghost', close: true },
            { label: 'Confirm', color: 'primary', close: true },
          ],
        });
        const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll(
          'solaris-dialog-actions button',
        );
        expect(buttons).toHaveLength(2);
        expect(buttons[0].textContent?.trim()).toBe('Cancel');
        expect(buttons[1].textContent?.trim()).toBe('Confirm');
      });

      it('should wire aria-labelledby and aria-describedby for chrome header', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          description: 'Chrome description',
        });
        const panel = q(fixture, '.solaris-dialog-panel') as HTMLElement;
        expect(panel.getAttribute('aria-labelledby')).toBe(
          'test-dialog-id-title',
        );
        expect(panel.getAttribute('aria-describedby')).toBe(
          'test-dialog-id-description',
        );
      });

      it('should reflect chrome variant on the host', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Variant',
          variant: 'danger',
        });
        const hostEl = fixture.nativeElement as HTMLElement;
        expect(hostEl.getAttribute('data-variant')).toBe('danger');
      });

      it('should render the close button inside the chrome header', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          description: 'Chrome description',
        });
        expect(q(fixture, '.solaris-dialog-header__close')).toBeTruthy();
        expect(q(fixture, '.solaris-dialog-container__close')).toBeNull();
      });

      it('should hide the chrome header close button when closeable is false', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          closeable: false,
        });
        expect(q(fixture, '[data-dialog-close]')).toBeNull();
      });

      it('should keep the floating close button when there is no chrome header', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          closeable: true,
        });
        expect(q(fixture, 'solaris-dialog-header')).toBeNull();
        expect(q(fixture, '.solaris-dialog-container__close')).toBeTruthy();
      });

      it('should mark the chrome header as scrolled when the panel body scrolls', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          description: 'Chrome description',
        });
        const body = q(fixture, '.solaris-dialog-panel__body') as HTMLElement;
        body.scrollTop = 64;
        body.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        const headerEl = q(fixture, 'solaris-dialog-header');
        expect(headerEl?.getAttribute('data-scrolled')).toBe('');
      });

      it('should clear the scrolled mark when scrolled back to top', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          description: 'Chrome description',
        });
        const body = q(fixture, '.solaris-dialog-panel__body') as HTMLElement;
        body.scrollTop = 64;
        body.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        body.scrollTop = 0;
        body.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        const headerEl = q(fixture, 'solaris-dialog-header');
        expect(headerEl?.getAttribute('data-scrolled')).toBeNull();
      });

      it('should mark chrome actions as scrolled while the body has content below', () => {
        const fixture = createExternalFixture(ExternalTestComponent, {
          title: 'Chrome Title',
          actions: [{ label: 'Confirm', color: 'primary', close: true }],
        });
        const body = q(fixture, '.solaris-dialog-panel__body') as HTMLElement;
        mockScrollMetrics(body, {
          scrollTop: 0,
          clientHeight: 400,
          scrollHeight: 1000,
        });
        body.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();

        const actionsEl = q(fixture, 'solaris-dialog-actions');
        expect(actionsEl?.getAttribute('data-scrolled')).toBe('');

        body.scrollTop = 600;
        body.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(actionsEl?.getAttribute('data-scrolled')).toBeNull();
      });
    });

    describe('manual header composition', () => {
      it('should suppress the floating close when the component renders its own header', () => {
        const fixture = createExternalFixture(ManualHeaderComponent);
        fixture.detectChanges();
        expect(q(fixture, 'solaris-dialog-header')).toBeTruthy();
        expect(q(fixture, '[data-dialog-close]')).toBeNull();
      });

      it('should render the manual in-flow close without duplicating the fallback', () => {
        const fixture = createExternalFixture(ManualHeaderCloseableComponent);
        fixture.detectChanges();
        expect(q(fixture, '.solaris-dialog-header__close')).toBeTruthy();
        expect(q(fixture, '.solaris-dialog-container__close')).toBeNull();
      });
    });
  });
});

function mockScrollMetrics(
  element: HTMLElement,
  metrics: { scrollTop: number; clientHeight: number; scrollHeight: number },
): void {
  element.scrollTop = metrics.scrollTop;
  Object.defineProperty(element, 'clientHeight', {
    value: metrics.clientHeight,
    configurable: true,
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: metrics.scrollHeight,
    configurable: true,
  });
}
